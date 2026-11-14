import { useEffect, useMemo, useRef } from 'react'
import type { MutableRefObject } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { MARS_MAP_URL } from './assets'
import { PARTS, type Ctl, type PartId, type SceneApi } from './parts'
import { RM } from '../../../lib/motion'
import { D } from '../../../lib/anim'

const MARS_Z = -140
const MARS_R = 11
const Y = new THREE.Vector3(0, 1, 0)

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
  const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646
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
  const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646
  for (let i = 0; i < 2600; i++) {
    const r = 70 + rnd() * 330
    const a = rnd() * Math.PI * 2
    const b = Math.acos(2 * rnd() - 1)
    pts.push(r * Math.sin(b) * Math.cos(a), r * Math.sin(b) * Math.sin(a), r * Math.cos(b))
  }
  return new Float32Array(pts)
}

/* ------------------------------------------------------------------ */
/* Small geometry helper: a cylinder between two points                 */
/* ------------------------------------------------------------------ */

function Bar({ a, b, r, mat }: { a: [number, number, number]; b: [number, number, number]; r: number; mat: THREE.Material }) {
  const { pos, quat, len } = useMemo(() => {
    const va = new THREE.Vector3(...a)
    const vb = new THREE.Vector3(...b)
    const dir = vb.clone().sub(va)
    return {
      pos: va.clone().add(vb).multiplyScalar(0.5),
      quat: new THREE.Quaternion().setFromUnitVectors(Y, dir.clone().normalize()),
      len: dir.length(),
    }
  }, [a, b])
  return (
    <mesh position={pos} quaternion={quat} material={mat}>
      <cylinderGeometry args={[r, r, len, 8]} />
    </mesh>
  )
}

/* ------------------------------------------------------------------ */
/* World                                                                */
/* ------------------------------------------------------------------ */

interface WorldProps {
  ctl: Ctl
  apiRef: MutableRefObject<SceneApi | null>
  onPick: (id: PartId) => void
}

const rimPoint = (deg: number): [number, number, number] => [
  Math.cos((deg * Math.PI) / 180) * 1.88,
  1.03,
  Math.sin((deg * Math.PI) / 180) * 1.88,
]
const FEED: [number, number, number] = [0, 2.1, 0]

function World({ ctl, apiRef, onPick }: WorldProps) {
  const get = useThree((s) => s.get)
  const gl = useThree((s) => s.gl)

  const voy = useRef<THREE.Group>(null!)
  const marsG = useRef<THREE.Group>(null!)
  const recG = useRef<THREE.Group>(null!)
  const key = useRef<THREE.DirectionalLight>(null!)
  const amb = useRef<THREE.AmbientLight>(null!)
  const scan = useRef<THREE.Group>(null!)
  const marsMat = useRef<THREE.MeshStandardMaterial>(null!)
  const dragging = useRef(false)

  const rot = useRef({ x: 0.2, y: -0.6 }).current
  const marsRot = useRef({ x: 0.1, y: -2.2 }).current
  const cam = useRef({ px: 0, py: 1.5, pz: 11, lx: 0, ly: 0.6, lz: 0, fov: 50 }).current
  const pointer = useRef({ x: 0, y: 0 }).current
  const tmp = useMemo(() => new THREE.Vector3(), [])

  const stars = useMemo(() => makeStars(), [])
  const marsTex = useMemo(() => makeMarsTexture(), [])

  /* One material per part so a part can glow as a whole. */
  const mats = useMemo(() => {
    const make = (color: string, metalness: number, roughness: number) =>
      new THREE.MeshStandardMaterial({
        color,
        metalness,
        roughness,
        side: THREE.DoubleSide,
        emissive: new THREE.Color('#3fb6ff'),
        emissiveIntensity: 0,
      })
    return {
      antenna: make('#dfe3e8', 0.7, 0.35),
      platform: make('#aeb7c2', 0.6, 0.4),
      bus: make('#b8903f', 0.85, 0.3),
      rtg: make('#7d8794', 0.6, 0.45),
      boom: make('#c8cdd4', 0.6, 0.4),
      record: make('#e6bd4a', 0.95, 0.22),
    } as Record<PartId, THREE.MeshStandardMaterial>
  }, [])
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: '#20242b', metalness: 0.4, roughness: 0.6 }), [])

  /* Camera framing that survives portrait screens. */
  const fit = () => {
    const a = Math.min(1, (get().camera as THREE.PerspectiveCamera).aspect / 1.4)
    return 1 + (1 / Math.pow(a, 0.75) - 1)
  }
  const overviewCam = () => ({ px: 0, py: 1.5, pz: 10.8 * fit(), lx: 0, ly: 0.6, lz: 0 })

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

  /* Imperative API used by the HTML overlay. */
  useEffect(() => {
    apiRef.current = {
      focus(id) {
        const part = PARTS.find((p) => p.id === id)!
        const [ax, ay, az] = part.anchor
        const r = Math.hypot(ax, az)
        ctl.focus = id
        gsap.killTweensOf([rot, cam, ctl])
        let target = r > 0.01 ? -Math.atan2(ax, az) : rot.y
        target += Math.PI * 2 * Math.round((rot.y - target) / (Math.PI * 2))
        const dur = 1.15 * D
        gsap.to(rot, { y: target, x: 0, duration: dur, ease: 'power3.inOut' })
        gsap.to(cam, {
          px: 0,
          py: ay + 0.5,
          pz: r + part.dist * fit(),
          lx: 0,
          ly: ay,
          lz: r,
          duration: dur,
          ease: 'power3.inOut',
        })
        gsap.to(ctl, {
          recordOut: id === 'record' ? 1 : 0,
          duration: id === 'record' ? 1.2 * D : 0.5 * D,
          delay: id === 'record' ? 0.8 * D : 0,
          ease: id === 'record' ? 'back.out(1.5)' : 'power2.out',
        })
      },
      overview() {
        ctl.focus = null
        gsap.killTweensOf([rot, cam, ctl])
        gsap.to(rot, { x: 0.2, duration: 0.9 * D, ease: 'power3.inOut' })
        gsap.to(cam, { ...overviewCam(), duration: 1 * D, ease: 'power3.inOut' })
        gsap.to(ctl, { recordOut: 0, duration: 0.6 * D })
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
        tl.to(ctl, { recordOut: 0, duration: 0.4 * D }, 0)
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
    key.current.intensity = 0.25 + 2.6 * p
    amb.current.intensity = 0.2 + 0.75 * p
    const sweeping = m === 'dark' && p > 0.01 && p < 0.995
    scan.current.visible = sweeping
    if (sweeping) scan.current.position.x = -5.5 + 11 * p

    /* Idle spin. */
    if ((m === 'dark' || m === 'explore') && !ctl.focus && !dragging.current && !RM) {
      rot.y += dt * (m === 'dark' ? 0.05 : 0.14)
    }
    voy.current.rotation.set(rot.x, rot.y, 0)
    marsG.current.rotation.set(marsRot.x, marsRot.y, 0)
    marsG.current.visible = m === 'transit' || m === 'mars'

    /* Record sliding out of its cover. */
    recG.current.position.z = 0.95 + ctl.recordOut * 0.95
    recG.current.rotation.z += dt * (0.4 + ctl.recordOut * 2.2)

    /* Camera. */
    const par = m === 'explore' && !ctl.focus ? 1 : m === 'mars' ? 0.5 : 0.2
    camera.position.set(cam.px + pointer.x * 0.9 * par, cam.py - pointer.y * 0.5 * par, cam.pz)
    camera.lookAt(cam.lx, cam.ly, cam.lz)
    if (Math.abs(camera.fov - cam.fov) > 0.01) {
      camera.fov = cam.fov
      camera.updateProjectionMatrix()
    }
    camera.updateMatrixWorld()

    /* Part glow. */
    const k = Math.min(1, dt * 8)
    for (const part of PARTS) {
      const mat = mats[part.id]
      const target = ctl.focus === part.id ? 0.85 : ctl.hover === part.id ? 0.4 : 0
      mat.emissiveIntensity += (target - mat.emissiveIntensity) * k
    }

    /* Project hotspots to the DOM overlay. */
    voy.current.updateMatrixWorld()
    const { width, height } = state.size
    for (const part of PARTS) {
      const el = ctl.hotEls[part.id]
      if (!el) continue
      tmp.set(...part.anchor).applyMatrix4(voy.current.matrixWorld)
      const wz = tmp.z
      tmp.project(camera)
      const x = (tmp.x * 0.5 + 0.5) * width
      const y = (-tmp.y * 0.5 + 0.5) * height
      el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) translate(-50%,-50%)`
      let o = m === 'explore' && !ctl.focus ? 1 : 0
      if (wz < -1.6) o *= 0.2
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

  /* Part event handlers, built once per part (they close over stable refs). */
  const hover = useMemo(() => {
    const cache = new Map<PartId, {
      onPointerOver: (e: { stopPropagation: () => void }) => void
      onPointerOut: () => void
      onClick: (e: { stopPropagation: () => void; delta: number }) => void
    }>()
    return (id: PartId) => {
      let handlers = cache.get(id)
      if (!handlers) {
        handlers = {
          onPointerOver: (e) => {
            e.stopPropagation()
            if (ctl.mode !== 'explore') return
            ctl.hover = id
            document.body.style.cursor = 'pointer'
          },
          onPointerOut: () => {
            if (ctl.hover === id) ctl.hover = null
            document.body.style.cursor = ''
          },
          onClick: (e) => {
            e.stopPropagation()
            if (e.delta > 6 || ctl.mode !== 'explore') return
            onPick(id)
          },
        }
        cache.set(id, handlers)
      }
      return handlers
    }
  }, [ctl, onPick])

  return (
    <>
      <ambientLight ref={amb} color="#6f86c9" intensity={0.2} />
      <directionalLight ref={key} position={[-7, 6, 9]} intensity={0.25} />
      <directionalLight position={[6, 3, -9]} intensity={1.1} color="#3b5fd0" />

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
        <group>
          {/* Bus (decagon) */}
          <mesh position={[0, 0.15, 0]} material={mats.bus} {...hover('bus')}>
            <cylinderGeometry args={[0.85, 0.85, 0.5, 10]} />
          </mesh>
          <mesh position={[0, -0.12, 0]} material={dark}>
            <cylinderGeometry args={[0.7, 0.8, 0.12, 10]} />
          </mesh>

          {/* High-gain dish */}
          <group {...hover('antenna')}>
            <mesh position={[0, 4.1, 0]} material={mats.antenna}>
              <sphereGeometry args={[3.6, 56, 14, 0, Math.PI * 2, Math.PI - 0.55, 0.55]} />
            </mesh>
            <mesh position={[0, 0.45, 0]} material={mats.antenna}>
              <cylinderGeometry args={[0.2, 0.3, 0.3, 10]} />
            </mesh>
            {[90, 210, 330].map((d) => (
              <Bar key={d} a={rimPoint(d)} b={FEED} r={0.025} mat={mats.antenna} />
            ))}
            <mesh position={FEED} material={mats.antenna}>
              <sphereGeometry args={[0.2, 16, 12]} />
            </mesh>
          </group>

          {/* RTG boom */}
          <group {...hover('rtg')}>
            <Bar a={[0.8, -0.1, 0]} b={[3.95, -0.1, 0]} r={0.04} mat={mats.rtg} />
            {[2.0, 2.9, 3.75].map((x) => (
              <mesh key={x} position={[x, -0.1, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.rtg}>
                <cylinderGeometry args={[0.2, 0.2, 0.7, 16]} />
              </mesh>
            ))}
          </group>

          {/* Science boom + scan platform */}
          <group {...hover('platform')}>
            <Bar a={[-0.8, -0.05, 0]} b={[-2.3, -0.05, 0]} r={0.035} mat={mats.platform} />
            <mesh position={[-2.6, 0, 0]} material={mats.platform}>
              <boxGeometry args={[0.7, 0.5, 0.7]} />
            </mesh>
            <mesh position={[-2.6, 0.05, 0.55]} rotation={[Math.PI / 2, 0, 0]} material={dark}>
              <cylinderGeometry args={[0.15, 0.18, 0.5, 14]} />
            </mesh>
            <mesh position={[-2.6, -0.15, -0.45]} rotation={[Math.PI / 2, 0, 0]} material={dark}>
              <cylinderGeometry args={[0.1, 0.1, 0.3, 12]} />
            </mesh>
          </group>

          {/* Magnetometer boom */}
          <group {...hover('boom')}>
            <Bar a={[-0.3, -0.1, -0.8]} b={[-1.8, -0.2, -4.4]} r={0.03} mat={mats.boom} />
            <mesh position={[-1.8, -0.2, -4.45]} material={mats.boom}>
              <boxGeometry args={[0.18, 0.18, 0.18]} />
            </mesh>
          </group>

          {/* Golden Record + cover */}
          <group {...hover('record')}>
            <mesh position={[0, 0.15, 0.9]} rotation={[Math.PI / 2, 0, 0]} material={mats.antenna}>
              <cylinderGeometry args={[0.64, 0.64, 0.03, 40]} />
            </mesh>
            <group ref={recG} position={[0, 0.15, 0.95]}>
              <mesh rotation={[Math.PI / 2, 0, 0]} material={mats.record}>
                <cylinderGeometry args={[0.56, 0.56, 0.035, 48]} />
              </mesh>
              <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]} material={dark}>
                <cylinderGeometry args={[0.1, 0.1, 0.02, 20]} />
              </mesh>
              <mesh position={[0.3, 0, 0.02]} material={dark}>
                <ringGeometry args={[0.02, 0.05, 16]} />
              </mesh>
            </group>
          </group>
        </group>
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

export function VoyagerScene({ ctl, apiRef, onPick, onMiss }: SceneProps) {
  return (
    <Canvas
      className="vy-canvas"
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      camera={{ fov: 50, near: 0.1, far: 900, position: [0, 1.5, 11] }}
      onPointerMissed={onMiss}
    >
      <World ctl={ctl} apiRef={apiRef} onPick={onPick} />
    </Canvas>
  )
}
