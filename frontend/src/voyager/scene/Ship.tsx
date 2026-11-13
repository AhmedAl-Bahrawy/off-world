import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import type { PerspectiveCamera } from 'three'
import gsap from 'gsap'
import { onSceneChange, useVoyager } from '../state/store'
import { bus } from '../lib/bus'
import { motion, RM } from '../lib/motion'

const TWEEN = { duration: RM ? 0 : 2.4, ease: 'power3.inOut' } as const

/**
 * The refugee ship. Hidden (scale ~0) except during voyage (flies Kalamith→Earth)
 * and orbit (circles the dead Earth trailing the scanning beam).
 */
export function Ship() {
  const group = useRef<THREE.Group>(null!)
  const flame = useRef<THREE.Mesh>(null!)
  const camera = useThree((s) => s.camera) as PerspectiveCamera

  // Shared hull material for body + nose.
  const hull = useMemo(
    () => new THREE.MeshPhongMaterial({ color: 0xcfe9ff, shininess: 60 }),
    [],
  )

  useLayoutEffect(() => {
    group.current.scale.setScalar(0.001)
  }, [])

  // Scene transitions.
  useEffect(
    () =>
      onSceneChange((scene) => {
        const a = Math.min(1, camera.aspect / 1.5)
        const f = 0.6 + 0.4 * a
        if (scene === 'voyage') {
          gsap.to(group.current.scale, { x: 1.6 * f, y: 1.6 * f, z: 1.6 * f, ...TWEEN })
          group.current.position.set(7 * a, 1.5, -3)
          group.current.rotation.set(0, Math.PI, 0)
        } else {
          const s = scene === 'orbit' ? 1.6 * f : 0.001
          gsap.to(group.current.scale, { x: s, y: s, z: s, ...TWEEN })
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
    // Engine flicker.
    flame.current.scale.set(1, 0.8 + Math.random() * 0.4, 1)

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
    }
    motion.shipPos.copy(group.current.position)
  })

  return (
    <group ref={group} scale={0.001}>
      {/* Fuselage, pointing +X */}
      <mesh material={hull} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.2, 1.1, 12]} />
      </mesh>
      <mesh material={hull} position={[0.8, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.16, 0.5, 12]} />
      </mesh>
      <mesh position={[-0.2, 0, 0]}>
        <boxGeometry args={[0.5, 0.04, 1.1]} />
        <meshPhongMaterial color="#5b7cff" />
      </mesh>
      <mesh ref={flame} position={[-1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.14, 0.9, 12]} />
        <meshBasicMaterial
          color="#7fe9ff"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}
