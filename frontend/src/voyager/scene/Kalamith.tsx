import { useEffect, useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import type { PerspectiveCamera } from 'three'
import gsap from 'gsap'
import { KALAMITH_MAP } from './textures'
import { Atmosphere } from './Atmosphere'
import { PlanetLabel } from './PlanetLabel'
import { onSceneChange } from '../state/store'
import { RM } from '../lib/motion'

const TWEEN = { duration: RM ? 0 : 2.4, ease: 'power3.inOut' } as const

/**
 * The Kalamith home world: purple planet + tilted ring + atmosphere.
 * Shrinks to nothing once the ship reaches orbit (chapters 4-5).
 */
export function Kalamith() {
  const group = useRef<THREE.Group>(null!)
  const planet = useRef<THREE.Mesh>(null!)
  const ring = useRef<THREE.Mesh>(null!)
  const camera = useThree((s) => s.camera) as PerspectiveCamera

  useLayoutEffect(() => {
    group.current.position.set(9, 5.5, -12)
    group.current.scale.setScalar(0.45)
  }, [])

  useEffect(
    () =>
      onSceneChange((scene) => {
        const a = Math.min(1, camera.aspect / 1.5)
        const f = 0.6 + 0.4 * a
        if (scene === 'voyage') {
          gsap.to(group.current.position, { x: 9 * a, y: 1, z: -6, ...TWEEN })
          gsap.to(group.current.scale, { x: 1.1 * f, y: 1.1 * f, z: 1.1 * f, ...TWEEN })
        } else {
          gsap.to(group.current.position, { x: 9 * a, y: 5.5, z: -12, ...TWEEN })
          const s = scene === 'orbit' || scene === 'rem' || scene === 'discovery' || scene === 'mars' ? 0.001 : 0.45
          gsap.to(group.current.scale, { x: s, y: s, z: s, ...TWEEN })
        }
      }),
    [camera],
  )

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const spin = RM ? 0 : 1
    planet.current.rotation.y = t * 0.08 * spin
    ring.current.rotation.z = t * 0.05 * spin
  })

  return (
    <group ref={group}>
      <mesh ref={planet}>
        <sphereGeometry args={[2.2, 48, 32]} />
        <meshPhongMaterial map={KALAMITH_MAP} shininess={30} />
      </mesh>
      <mesh ref={ring} rotation={[1.2, 0, 0]}>
        <ringGeometry args={[3, 4.3, 64]} />
        <meshBasicMaterial
          color="#b07bff"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>
      <Atmosphere color="#b07bff" radius={2.7} />
      <PlanetLabel text="KALAMITH" color="#d6b8ff" position={[0, 4, 0]} />
    </group>
  )
}
