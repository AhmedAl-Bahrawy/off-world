import { useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { RM, seeded } from '../lib/motion'

/**
 * Deep-space star shell (1400 points on a sphere, pre-computed once at module
 * load with a seeded PRNG so every run looks identical) slowly rotating
 * behind everything.
 */
const STAR_POSITIONS = (() => {
  const rand = seeded(90210)
  const points: number[] = []
  for (let i = 0; i < 1400; i++) {
    const r = 120 + rand() * 120
    const a = rand() * 6.283
    const b = Math.acos(2 * rand() - 1)
    points.push(
      r * Math.sin(b) * Math.cos(a),
      r * Math.sin(b) * Math.sin(a),
      r * Math.cos(b),
    )
  }
  return new Float32Array(points)
})()

/** A second, closer shell adds depth between the stars and the actors. */
const NEAR_STARS = (() => {
  const rand = seeded(31337)
  const points: number[] = []
  for (let i = 0; i < 420; i++) {
    const r = 38 + rand() * 34
    const a = rand() * 6.283
    const b = Math.acos(2 * rand() - 1)
    points.push(
      r * Math.sin(b) * Math.cos(a),
      r * Math.sin(b) * Math.sin(a),
      r * Math.cos(b),
    )
  }
  return new Float32Array(points)
})()

export function Starfield3D() {
  const points = useRef<THREE.Points>(null!)
  const near = useRef<THREE.Points>(null!)

  useLayoutEffect(() => {
    points.current.rotation.y = 0.7
    near.current.rotation.y = -1.2
  }, [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const spin = RM ? 0 : 1
    points.current.rotation.y = t * 0.004 * spin
    near.current.rotation.y = -t * 0.011 * spin
    near.current.rotation.x = Math.sin(t * 0.05) * 0.04 * spin
  })

  return (
    <>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[STAR_POSITIONS, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#bfe6ff" size={1.4} sizeAttenuation={false} />
      </points>
      <points ref={near}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[NEAR_STARS, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#dbeeff"
          size={1.9}
          sizeAttenuation={false}
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </points>
    </>
  )
}
