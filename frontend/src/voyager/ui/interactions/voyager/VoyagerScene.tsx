import { Suspense, useEffect, useMemo, useRef } from 'react'
import type { MutableRefObject } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import gsap from 'gsap'
import { MARS_MAP_URL, VOYAGER_MODEL } from './assets'
import { PARTS, type Ctl, type PartId, type SceneApi } from './parts'
import { RM } from '../../../lib/motion'
import { D } from '../../../lib/anim'

const MARS_Z = -140
const MARS_R = 11
const Y = new THREE.Vector3(0, 1, 0)

/**
 * Model-space constants measured off the NASA glTF:
 * the bus centre is the natural origin, and the craft is rotated a quarter
 * turn so the RTG boom runs to screen-right and the science boom to
 * screen-left — a far better silhouette than head-on.
 */
const BUS_CENTRE = new THREE.Vector3(0, 0.41, 0)
const MODEL_SCALE = 1
const MODEL_TURN = Math.PI / 2

/** Anchor positions in the scene's own space (scale + quarter turn applied). */
const LOCAL_ANCHORS: Record<PartId, THREE.Vector3> = Object.fromEntries(
  PARTS.map((p) => [
    p.id,
    new THREE.Vector3(...p.anchor)
      .sub(BUS_CENTRE)
      .applyAxisAngle(Y, MODEL_TURN)
      .multiplyScalar(MODEL_SCALE),
  ]),
) as Record<PartId, THREE.Vector3>

/* ------------------------------------------------------------------ */
/* Procedural placeholders (canvas, never SVG)                          */
/* ------------------------------------------------------------------ */

function makeMarsTexture() {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 512
  const g = c.getContext('2d')!
  const grad = g.createLinearGradient(0, 0, 0, 512)
  grad.addColorStop(0, '#d8d2cc')
  grad.addColorStop(0.1, '#b9744c')
  grad.addColorStop(0.5, '#a1472a')
  grad.addColorStop(0.9, '#b9744c')
  grad.addColorStop(1, '#d8dde2')
  g.fillStyle = grad
  g.fillRect(0, 0, 1024, 512)
  let s = 7
  const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2144967296
  for (let i = 0; i < 900; i++) {
    const dark = rnd() > 0.45
    g.fillStyle = dark ? `rgba(60,22,12,${0.05 + rnd() * 0.12})` : `rgba(240,170,120,${0.04 + rnd() * 0.1})`
    g.beginPath()
    g.arc(rnd() * 1024, 40 + rnd() * 430, 4 + rnd() * 46, 0, Math.PI * 2)
    g.fill()
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function makeStars() {
  const pts: number[] = []
  let s = 11
  const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2144967296
  for (let i = 0; i < 2600; i++) {
    const r = 70 + rnd() * 330
    const a = rnd() * Math.PI * 2
    const b = Math.acos(2 * rnd() - 1)
    pts.push(r * Math.sin(b) * Math.cos(a), r * Math.sin(b) * Math.sin(a), r * Math.cos(b))
  }
  return new Float32Array(pts)
}

/* ------------------------------------------------------------------ */
/* World                                                                */
/* ------------------------------------------------------------------ */

interface WorldProps {
  ctl: Ctl
  apiRef: MutableRefObject<SceneApi | null>
  onPick: (id: PartId) => void
}

function World({ ctl, apiRef, onPick }: WorldProps) {
  const get = useThree((s) => s.get)
  const gl = useThree((s) => s.gl)

  const voy = useRef<THREE.Group>(null!)
  const modelTilt = useRef<THREE.Group>(null!)
  const marsG = useRef<THREE.Group>(null!)
  const key = useRef<THREE.DirectionalLight>(null!)
  const amb = useRef<THREE.AmbientLight>(null!)
  const scan = useRef<THREE.Group>(null!)
  const marsMat = useRef<THREE.MeshStandardMaterial>(null!)
  const locator = useRef<THREE.Mesh>(null!)
  const dragging = useRef(false)

  const rot = useRef({ x: 0.2, y: -0.6 }).current
  const marsRot = useRef({ x: 0.1, y: -2.2 }).current
  const cam = useRef({ px: 0, py: 1.5, pz: 11, lx: 0, ly: 0.6, lz: 0, fov: 50 }).current
  const pointer = useRef({ x: 0, y: 0 }).current
  const tmp = useMemo(() => new THREE.Vector3(), [])
  const tmp2 = useMemo(() => new THREE.Vector3(), [])

  const stars = useMemo(() => makeStars(), [])
  const marsTex = useMemo(() => makeMarsTexture(), [])

  /* The real spacecraft. */
  const gltf = useLoader(GLTFLoader, VOYAGER_MODEL)
  const model = useMemo(() => {
    const scene = gltf.scene
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (mesh.isMesh) {
        mesh.castShadow = false
        mesh.receiveShadow = false
      }
    })
    return scene
  }, [gltf])

  /* Camera framing that survives portrait screens. */
  const fit = () => {
    const a = Math.min(1, (get().camera as THREE.PerspectiveCamera).aspect / 1.4)
    return 1 + (1 / Math.pow(a, 0.75) - 1)
  }
  const overviewCam = () => ({ px: 0, py: 1.2, pz: 9.2 * fit(), lx: 0, ly: 0.5, lz: 0 })

  /** Local-space position of a part (the model's own frame, before the spin). */
  const localOf = (id: PartId) => LOCAL_ANCHORS[id]

  /* Optional external Mars map; the canvas texture stays if it fails. */
  useEffect(() => {
    if (!MARS_MAP_URL) return
    let dead = false
    const loader = new THREE.TextureLoader()
    loader.setCrossOrigin('anonymous')
    loader.load(
      MARS_MAP_URL,
      (t) => {
        if (dead || !marsMat.current) return
        t.colorSpace = THREE.SRGBColorSpace
        t.anisotropy = 4
        marsMat.current.map = t
        marsMat.current.needsUpdate = true
      },
      undefined,
      () => {},
    )
    return () => {
      dead = true
    }
  }, [])

  /* Drag to orbit (Voyager) or spin (Mars) + pointer parallax. */
  useEffect(() => {
    const dom = gl.domElement
    let down = false
    let lx = 0
    let ly = 0
    const onDown = (e: PointerEvent) => {
      if (ctl.focus || ctl.mode === 'transit') return
      down = true
      dragging.current = true
      lx = e.clientX
      ly = e.clientY
      gsap.killTweensOf(rot)
      gsap.killTweensOf(marsRot)
    }
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX / innerWidth - 0.5
      pointer.y = e.clientY / innerHeight - 0.5
      if (!down) return
      const t = ctl.mode === 'mars' ? marsRot : rot
      t.y += (e.clientX - lx) * 0.008
      t.x = THREE.MathUtils.clamp(t.x + (e.clientY - ly) * 0.005, -0.7, 1.1)
      lx = e.clientX
      ly = e.clientY
    }
    const onUp = () => {
      down = false
      dragging.current = false
    }
    dom.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      dom.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [gl, ctl, rot, marsRot, pointer])

  /* Hover / click resolution against the real model: the nearest part
     anchor wins, which works even though the glTF is a single merged mesh. */
  const resolvePart = (e: { point: THREE.Vector3 }): PartId | null => {
    const local = modelTilt.current.worldToLocal(e.point.clone())
    let best: PartId | null = null
    let bestDist = Infinity
    for (const part of PARTS) {
      const d = local.distanceTo(tmp2.set(...part.anchor))
      if (d < bestDist) {
        bestDist = d
        best = part.id
      }
    }
    // Reject hits that are nowhere near any part (e.g. empty space on the
    // magnetometer lattice far from every anchor).
    return bestDist < 2.2 ? best : null
  }

  const hoverHandlers = useMemo(
    () => ({
      onPointerMove: (e: { point: THREE.Vector3; stopPropagation: () => void }) => {
        e.stopPropagation()
        if (ctl.mode !== 'explore') return
        const id = resolvePart(e)
        ctl.hover = id
        document.body.style.cursor = id ? 'pointer' : ''
      },
      onPointerOut: () => {
        ctl.hover = null
        document.body.style.cursor = ''
      },
      onClick: (e: { point: THREE.Vector3; stopPropagation: () => void; delta: number }) => {
        e.stopPropagation()
        if (e.delta > 6 || ctl.mode !== 'explore') return
        const id = resolvePart(e)
        if (id) onPick(id)
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ctl, onPick],
  )

  /* Imperative API used by the HTML overlay. */
  useEffect(() => {
    apiRef.current = {
      focus(id) {
        const part = PARTS.find((p) => p.id === id)!
        const local = localOf(id)
        const r = Math.hypot(local.x, local.z)
        ctl.focus = id
        gsap.killTweensOf([rot, cam, ctl])

        // Spin the craft so the part faces the camera, taking the short way.
        if (r > 0.01) {
          const azimuth = Math.atan2(local.x, local.z)
          let target = -azimuth
          target += Math.PI * 2 * Math.round((rot.y - target) / (Math.PI * 2))
          gsap.to(rot, { y: target, x: 0, duration: 1.15 * D, ease: 'power3.inOut' })
        } else {
          gsap.to(rot, { x: 0, duration: 1.15 * D, ease: 'power3.inOut' })
        }

        const dur = 1.15 * D
        gsap.to(cam, {
          px: 0,
          py: local.y + part.pitch,
          pz: r + part.dist * fit(),
          lx: 0,
          ly: local.y,
          lz: r,
          duration: dur,
          ease: 'power3.inOut',
        })
      },
      overview() {
        ctl.focus = null
        gsap.killTweensOf([rot, cam, ctl])
        gsap.to(rot, { x: 0.2, duration: 0.9 * D, ease: 'power3.inOut' })
        gsap.to(cam, { ...overviewCam(), duration: 1 * D, ease: 'power3.inOut' })
      },
      toMars(onArrive) {
        ctl.focus = null
        ctl.hover = null
        ctl.mode = 'transit'
        gsap.killTweensOf([rot, cam, ctl, voy.current.position, voy.current.scale])
        const dist = 30 * fit()
        const tl = gsap.timeline({
          onComplete: () => {
            ctl.mode = 'mars'
            voy.current.visible = false
            onArrive()
          },
        })
        const T = 5 * D || 0.01
        tl.to(rot, { x: 0.1, y: rot.y + Math.PI * 0.6, duration: T, ease: 'power2.inOut' }, 0)
        tl.to(voy.current.position, { z: MARS_Z + 22, duration: T, ease: 'power2.inOut' }, 0.2 * D)
        tl.to(voy.current.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 1.2 * D, ease: 'power2.in' }, T - 1 * D)
        tl.to(cam, { fov: 92, duration: 2.2 * D, ease: 'power2.in' }, 0.6 * D)
        tl.to(cam, { fov: 50, duration: 2.4 * D, ease: 'power3.out' }, 2.8 * D)
        tl.to(
          cam,
          { px: 0, py: 0.4, pz: MARS_Z + dist, lx: 0, ly: 0, lz: MARS_Z, duration: T, ease: 'power2.inOut' },
          0.2 * D,
        )
        tl.fromTo(marsRot, { y: -2.2, x: 0.1 }, { y: 1.34, x: 0.45, duration: T, ease: 'power2.out' }, 0.2 * D)
      },
    }
    // Start framed on the overview.
    Object.assign(cam, overviewCam())
    return () => {
      apiRef.current = null
      gsap.killTweensOf([rot, cam, ctl, marsRot])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame((state, dt) => {
    const m = ctl.mode
    const camera = state.camera as THREE.PerspectiveCamera
    const p = ctl.power

    /* Power-up lighting: a dark silhouette that wakes up. */
    key.current.intensity = 0.18 + 2.4 * p
    amb.current.intensity = 0.16 + 0.85 * p
    const sweeping = m === 'dark' && p > 0.01 && p < 0.995
    scan.current.visible = sweeping
    if (sweeping) scan.current.position.x = -5.5 + 11 * p

    /* Idle drift: a slow oscillation rather than a full spin, so the craft
       keeps a readable silhouette and the boom never sweeps the camera. */
    if ((m === 'dark' || m === 'explore') && !ctl.focus && !dragging.current && !RM) {
      rot.y += (Math.sin(state.clock.elapsedTime * 0.17) * 0.34 - rot.y) * dt * 0.9
    }
    voy.current.rotation.set(rot.x, rot.y, 0)
    marsG.current.rotation.set(marsRot.x, marsRot.y, 0)
    marsG.current.visible = m === 'transit' || m === 'mars'

    /* Camera. */
    const par = m === 'explore' && !ctl.focus ? 1 : m === 'mars' ? 0.5 : 0.2
    camera.position.set(cam.px + pointer.x * 0.9 * par, cam.py - pointer.y * 0.5 * par, cam.pz)
    camera.lookAt(cam.lx, cam.ly, cam.lz)
    if (Math.abs(camera.fov - cam.fov) > 0.01) {
      camera.fov = cam.fov
      camera.updateProjectionMatrix()
    }
    camera.updateMatrixWorld()

    /* Locator: a ring that marks the focused part on the model itself. */
    voy.current.updateMatrixWorld()
    const active = ctl.focus ?? ctl.hover
    if (active) {
      const local = LOCAL_ANCHORS[active]
      tmp.copy(local).applyEuler(voy.current.rotation)
      locator.current.position.set(tmp.x, tmp.y, tmp.z)
      locator.current.lookAt(camera.position)
      const pulse = 0.85 + Math.sin(state.clock.elapsedTime * 4) * 0.15
      locator.current.scale.setScalar(pulse * (ctl.focus ? 1 : 0.7))
      locator.current.visible = true
    } else {
      locator.current.visible = false
    }

    /* Project hotspots to the DOM overlay. */
    const { width, height } = state.size
    for (const part of PARTS) {
      const el = ctl.hotEls[part.id]
      if (!el) continue
      tmp.copy(LOCAL_ANCHORS[part.id]).applyMatrix4(voy.current.matrixWorld)
      tmp.project(camera)
      const x = (tmp.x * 0.5 + 0.5) * width
      const y = (-tmp.y * 0.5 + 0.5) * height
      el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) translate(-50%,-50%)`
      let o = m === 'explore' && !ctl.focus ? 1 : 0
      if (tmp.z > 1) o = 0
      el.style.opacity = o.toFixed(2)
      el.style.pointerEvents = o > 0.5 ? 'auto' : 'none'
    }

    /* Arcadia Planitia pin (46°N, 193°E) on Mars. */
    const pin = ctl.marsPin
    if (pin) {
      const phi = ((193 - 360 + 180) / 360) * Math.PI * 2
      const th = Math.PI / 2 - (46 * Math.PI) / 180
      tmp.set(-MARS_R * Math.cos(phi) * Math.sin(th), MARS_R * Math.cos(th), MARS_R * Math.sin(phi) * Math.sin(th))
      marsG.current.updateWorldMatrix(true, false)
      tmp.multiplyScalar(1.005).applyMatrix4(marsG.current.matrixWorld)
      const facing = tmp.z - MARS_Z > 1.5
      tmp.project(camera)
      const x = (tmp.x * 0.5 + 0.5) * width
      const y = (-tmp.y * 0.5 + 0.5) * height
      pin.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) translate(-50%,-50%)`
      pin.style.opacity = m === 'mars' && facing ? '1' : '0'
    }
  })

  return (
    <>
      <ambientLight ref={amb} color="#6f86c9" intensity={0.16} />
      <directionalLight ref={key} position={[-7, 6, 9]} intensity={0.18} />
      <directionalLight position={[6, 3, -9]} intensity={1.1} color="#3b5fd0" />
      <directionalLight position={[0, -8, 4]} intensity={0.35} color="#8fb8ff" />

      {/* Stars */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[stars, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#cfe8ff" size={1.5} sizeAttenuation={false} transparent opacity={0.85} />
      </points>

      {/* Scan beam used while powering up */}
      <group ref={scan} visible={false}>
        <mesh position={[0, 0.5, 1.2]}>
          <planeGeometry args={[0.05, 10]} />
          <meshBasicMaterial color="#8fe3ff" transparent opacity={0.95} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh position={[0.35, 0.5, 1.2]}>
          <planeGeometry args={[0.8, 10]} />
          <meshBasicMaterial color="#48a8ff" transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>

      {/* ---------------- Voyager 1 ---------------- */}
      <group ref={voy}>
        <group
          ref={modelTilt}
          scale={MODEL_SCALE}
          rotation={[0, MODEL_TURN, 0]}
          position={[
            -MODEL_SCALE * BUS_CENTRE.x,
            -MODEL_SCALE * BUS_CENTRE.y,
            -MODEL_SCALE * BUS_CENTRE.z,
          ]}
        >
          <primitive object={model} {...hoverHandlers} />
        </group>

        {/* Locator ring marking the focused / hovered component */}
        <mesh ref={locator} visible={false}>
          <ringGeometry args={[0.22, 0.3, 28]} />
          <meshBasicMaterial
            color="#ffd77a"
            transparent
            opacity={0.95}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* ---------------- Mars ---------------- */}
      <group position={[0, 0, MARS_Z]}>
        <group ref={marsG} visible={false}>
          <mesh>
            <sphereGeometry args={[MARS_R, 96, 64]} />
            <meshStandardMaterial ref={marsMat} map={marsTex} roughness={1} metalness={0} />
          </mesh>
          <mesh scale={1.035}>
            <sphereGeometry args={[MARS_R, 48, 32]} />
            <meshBasicMaterial color="#ff9a6a" transparent opacity={0.13} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        </group>
      </group>
    </>
  )
}

/* ------------------------------------------------------------------ */

interface SceneProps extends WorldProps {
  onMiss: () => void
}

/** Shown while the 727 KB model is still on the wire. */
function ModelPending() {
  return (
    <mesh>
      <icosahedronGeometry args={[0.6, 1]} />
      <meshBasicMaterial color="#1a2a55" wireframe transparent opacity={0.6} />
    </mesh>
  )
}

export function VoyagerScene({ ctl, apiRef, onPick, onMiss }: SceneProps) {
  return (
    <Canvas
      className="vy-canvas"
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      camera={{ fov: 50, near: 0.1, far: 900, position: [0, 1.5, 11] }}
      onPointerMissed={onMiss}
    >
      <Suspense fallback={<ModelPending />}>
        <World ctl={ctl} apiRef={apiRef} onPick={onPick} />
      </Suspense>
    </Canvas>
  )
}
