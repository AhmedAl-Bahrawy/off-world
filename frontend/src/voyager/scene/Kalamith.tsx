import { useEffect, useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import type { PerspectiveCamera } from 'three'
import gsap from 'gsap'
import { KALAMITH_MAP, RING_MAP } from './textures'
import { Atmosphere } from './Atmosphere'
import { PlanetLabel } from './PlanetLabel'
import { onSceneChange } from '../state/store'
import { RM } from '../lib/motion'
import { SCENE_TWEEN, aspectScale } from '../lib/anim'

/**
 * The Kalamith home world: violet ocean planet + banded ring + atmosphere.
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
        const f = aspectScale(camera)
        if (scene === 'voyage') {
          gsap.to(group.current.position, { x: 9 * a, y: 1, z: -6, ...SCENE_TWEEN })
          gsap.to(group.current.scale, { x: 1.1 * f, y: 1.1 * f, z: 1.1 * f, ...SCENE_TWEEN })
        } else {
          gsap.to(group.current.position, { x: 9 * a, y: 5.5, z: -12, ...SCENE_TWEEN })
          const s =
            scene === 'orbit' || scene === 'rem' || scene === 'discovery' || scene === 'mars'
              ? 0.001
              : 0.45
          gsap.to(group.current.scale, { x: s, y: s, z: s, ...SCENE_TWEEN })
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
        <sphereGeometry args={[2.2, 64, 48]} />
        <meshStandardMaterial
          map={KALAMITH_MAP}
          roughness={0.86}
          metalness={0.06}
          emissive="#4a2d84"
          emissiveIntensity={0.16}
        />
      </mesh>
      <mesh ref={ring} rotation={[1.2, 0, 0]}>
        <ringGeometry args={[3, 4.3, 96]} />
        <meshBasicMaterial
          map={RING_MAP}
          transparent
          opacity={0.42}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <Atmosphere color="#b07bff" radius={2.55} power={3.6} strength={0.8} />
      <PlanetLabel text="KALAMITH" color="#d6b8ff" position={[0, 4, 0]} />
    </group>
  )
}
