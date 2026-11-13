import { useEffect, useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import type { PerspectiveCamera } from 'three'
import gsap from 'gsap'
import { EARTH_MAP, CLOUD_MAP } from './textures'
import { Atmosphere } from './Atmosphere'
import { PlanetLabel } from './PlanetLabel'
import { onSceneChange } from '../state/store'
import { bus } from '../lib/bus'
import { motion, RM } from '../lib/motion'

/** Aspect-scaled factor used by every scene transition. */
const aspectFactor = (camera: PerspectiveCamera) =>
  0.6 + 0.4 * Math.min(1, camera.aspect / 1.5)

const TWEEN = { duration: RM ? 0 : 2.4, ease: 'power3.inOut' } as const

/** City light positions, pre-computed ONCE at module load (260 points). */
const CITY_POSITIONS = (() => {
  const points: number[] = []
  for (let i = 0; i < 260; i++) {
    const lat = (Math.random() - 0.5) * 2.2
    const lon = Math.random() * 6.283
    const r = 5.03
    points.push(
      r * Math.cos(lat) * Math.cos(lon),
      r * Math.sin(lat),
      r * Math.cos(lat) * Math.sin(lon),
    )
  }
  return new Float32Array(points)
})()

/**
 * Earth group: surface + additive clouds + flickering city lights +
 * atmosphere shell + name label. Owns all of its scene transitions.
 */
export function Earth() {
  const group = useRef<THREE.Group>(null!)
  const surface = useRef<THREE.Mesh>(null!)
  const clouds = useRef<THREE.Mesh>(null!)
  const surfaceMat = useRef<THREE.MeshPhongMaterial>(null!)
  const cityMat = useRef<THREE.PointsMaterial>(null!)
  const camera = useThree((s) => s.camera) as PerspectiveCamera

  // Initial placement + rise from below.
  useLayoutEffect(() => {
    group.current.position.set(0, -9.6, 0)
    group.current.scale.setScalar(1.35)
    if (!RM) {
      gsap.from(group.current.position, { y: -18, duration: 3, ease: 'power3.out' })
    }
  }, [])

  // Scene transitions (position, scale, dimming for the dead-earth look).
  useEffect(
    () =>
      onSceneChange((scene) => {
        const f = aspectFactor(camera)
        const a = Math.min(1, camera.aspect / 1.5)
        if (scene === 'voyage') {
          gsap.to(group.current.position, { x: -9 * a, y: 1.5, z: -5, ...TWEEN })
          gsap.to(group.current.scale, { x: 0.55 * f, y: 0.55 * f, z: 0.55 * f, ...TWEEN })
        } else {
          gsap.to(group.current.position, { x: 0, y: -9.6, z: 0, ...TWEEN })
          gsap.to(group.current.scale, { x: 1.35, y: 1.35, z: 1.35, ...TWEEN })
        }
        const dim = scene === 'rem'
        gsap.to(surfaceMat.current.color, {
          r: dim ? 0.25 : 1,
          g: dim ? 0.25 : 1,
          b: dim ? 0.3 : 1,
          duration: TWEEN.duration ? 3 : 0,
        })
      }),
    [camera],
  )

  // "killCities" — fade the golden city dots out.
  useEffect(
    () =>
      bus.on('killCities', (seconds) =>
        gsap.to(cityMat.current, { opacity: 0, duration: seconds, ease: 'none' }),
      ),
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const spin = RM ? 0 : 1
    surface.current.rotation.y = t * 0.04 * spin
    clouds.current.rotation.y = t * 0.06 * spin
    cityMat.current.size = 0.065 + Math.random() * 0.02
    motion.earthPos.copy(group.current.position)
  })

  return (
    <group ref={group}>
      <mesh ref={surface}>
        <sphereGeometry args={[5, 64, 48]} />
        <meshPhongMaterial ref={surfaceMat} map={EARTH_MAP} shininess={22} specular="#224466" />
      </mesh>
      <mesh ref={clouds}>
        <sphereGeometry args={[5.07, 48, 32]} />
        <meshPhongMaterial
          map={CLOUD_MAP}
          transparent
          opacity={0.28}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[CITY_POSITIONS, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={cityMat}
          color="#ffd27a"
          size={0.07}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      <Atmosphere color="#27d3ff" radius={5.9} />
      <PlanetLabel text="EARTH" color="#7fe9ff" position={[0, 6.6, 0]} />
    </group>
  )
}
