import { useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { RM } from '../lib/motion'

/**
 * Deep-space star shell (1400 points on a sphere, pre-computed once at module
 * load) slowly rotating behind everything.
 */
const STAR_POSITIONS = (() => {
  const points: number[] = []
  for (let i = 0; i < 1400; i++) {
    const r = 120 + Math.random() * 120
    const a = Math.random() * 6.283
    const b = Math.acos(2 * Math.random() - 1)
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

  useLayoutEffect(() => {
    points.current.rotation.y = Math.random() * Math.PI * 2
  }, [])

  useFrame(({ clock }) => {
    points.current.rotation.y = clock.elapsedTime * 0.004 * (RM ? 0 : 1)
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[STAR_POSITIONS, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#bfe6ff" size={1.4} sizeAttenuation={false} />
    </points>
  )
}
