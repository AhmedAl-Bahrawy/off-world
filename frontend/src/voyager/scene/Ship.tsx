import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import type { PerspectiveCamera } from 'three'
import gsap from 'gsap'
import { onSceneChange, useVoyager } from '../state/store'
import { bus } from '../lib/bus'
import { flicker, motion, RM } from '../lib/motion'
import { SCENE_TWEEN, aspectScale } from '../lib/anim'

/**
 * The Kalamith survey ship.
 *
 * It is a fictional craft, so there is no public-domain model that would be
 * truthful here — it is modelled instead of borrowed. The hull is a lathed
 * spindle with a luminous equator band, swept vanes and a single drive bell,
 * which gives it a silhouette that reads as "not ours" at a glance.
 *
 * Hidden (scale ~0) except during the voyage (flies Kalamith → Earth) and the
 * orbit (circles the dead Earth trailing the scanning beam).
 */
export function Ship() {
  const group = useRef<THREE.Group>(null!)
  const plume = useRef<THREE.Mesh>(null!)
  const band = useRef<THREE.Mesh>(null!)
  const camera = useThree((s) => s.camera) as PerspectiveCamera

  /** Hull profile revolved into a spindle (revolves around Y). */
  const hullGeometry = useMemo(() => {
    const profile = [
      new THREE.Vector2(0.001, -0.78),
      new THREE.Vector2(0.07, -0.7),
      new THREE.Vector2(0.15, -0.55),
      new THREE.Vector2(0.195, -0.32),
      new THREE.Vector2(0.205, -0.05),
      new THREE.Vector2(0.185, 0.18),
      new THREE.Vector2(0.13, 0.38),
      new THREE.Vector2(0.06, 0.54),
      new THREE.Vector2(0.001, 0.62),
    ]
    const geo = new THREE.LatheGeometry(profile, 28)
    geo.rotateZ(Math.PI / 2) // point the spindle along +X
    geo.computeVertexNormals()
    return geo
  }, [])

  const hull = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x9fb4d8,
        metalness: 0.72,
        roughness: 0.34,
        emissive: new THREE.Color('#2a3f7a'),
        emissiveIntensity: 0.22,
      }),
    [],
  )
  const dark = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0x1b2230, metalness: 0.5, roughness: 0.62 }),
    [],
  )
  const glow = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#8fe4ff'),
        transparent: true,
        opacity: 0.92,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  )

  useLayoutEffect(() => {
    group.current.scale.setScalar(0.001)
    return () => {
      hullGeometry.dispose()
      hull.dispose()
      dark.dispose()
      glow.dispose()
    }
  }, [hullGeometry, hull, dark, glow])

  // Scene transitions.
  useEffect(
    () =>
      onSceneChange((scene) => {
        const a = Math.min(1, camera.aspect / 1.5)
        const f = aspectScale(camera)
        if (scene === 'voyage') {
          gsap.to(group.current.scale, {
            x: 1.7 * f,
            y: 1.7 * f,
            z: 1.7 * f,
            ...SCENE_TWEEN,
          })
          gsap.to(group.current.position, {
            x: 7 * a,
            y: 1.5,
            z: -3,
            ...SCENE_TWEEN,
          })
          gsap.to(group.current.rotation, { y: Math.PI, duration: SCENE_TWEEN.duration, ease: 'power3.inOut' })
        } else {
          const s = scene === 'orbit' ? 1.7 * f : 0.001
          gsap.to(group.current.scale, { x: s, y: s, z: s, ...SCENE_TWEEN })
        }
      }),
    [camera],
  )

  // One-off "fly forward" command from the story.
  useEffect(
    () =>
      bus.on('shipGo', (seconds) =>
        gsap.to(group.current.position, {
          x: -7 * (Math.min(1, camera.aspect / 1.5)),
          duration: seconds,
          ease: 'power1.inOut',
        }),
      ),
    [camera],
  )

  useFrame(({ clock }) => {
    const t = clock.elapsedTime

    // Engine flicker: deterministic, so it is identical on every run.
    const f = flicker(t, 7)
    const surge = 1 + f * 0.18 + Math.sin(t * 11.3) * 0.06
    plume.current.scale.set(surge, 0.85 + f * 0.22, surge)
    band.current.scale.setScalar(1 + Math.sin(t * 1.7) * 0.02)

    const scene = useVoyager.getState().scene
    if (scene === 'orbit') {
      // Circle the dead Earth; flip to face travel direction on each half.
      const a = t * 0.35
      const cs = Math.cos(a)
      const aspect = Math.min(1, camera.aspect / 1.5)
      group.current.position.set(
        Math.sin(a) * 6.5 * aspect,
        3.2 + Math.cos(a * 1.3) * 0.6,
        2 + cs * 2,
      )
      group.current.rotation.y += ((cs > 0 ? 0 : Math.PI) - group.current.rotation.y) * 0.08
    } else if (!RM) {
      // A slow, deliberate roll while under way — never random.
      group.current.rotation.z = Math.sin(t * 0.22) * 0.06
    }
    motion.shipPos.copy(group.current.position)
  })

  return (
    <group ref={group} scale={0.001}>
      {/* Spindle hull */}
      <mesh geometry={hullGeometry} material={hull} />

      {/* Luminous equator band — the ship's one human-readable "face" */}
      <mesh ref={band} material={glow} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <torusGeometry args={[0.2, 0.022, 8, 40]} />
      </mesh>

      {/* Dorsal spine */}
      <mesh material={dark} position={[0, 0.19, 0]}>
        <boxGeometry args={[0.9, 0.05, 0.07]} />
      </mesh>

      {/* Swept vanes */}
      {[1, -1].map((s) => (
        <group key={s} rotation={[0, 0, s * 0.42]}>
          <mesh material={dark} position={[0.06, 0.02, s * 0.3]} rotation={[s * 0.28, 0, 0]}>
            <boxGeometry args={[0.62, 0.02, 0.3]} />
          </mesh>
        </group>
      ))}

      {/* Forward sensor cluster */}
      <mesh material={glow} position={[0.55, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.06, 0.22, 12]} />
      </mesh>

      {/* Drive bell */}
      <mesh material={dark} position={[-0.62, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.13, 0.09, 0.2, 16, 1, true]} />
      </mesh>

      {/* Exhaust */}
      <mesh ref={plume} material={glow} position={[-1.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.11, 0.95, 14, 1, true]} />
      </mesh>
    </group>
  )
}
