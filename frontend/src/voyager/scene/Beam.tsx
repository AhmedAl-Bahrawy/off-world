import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useVoyager } from '../state/store'
import { motion } from '../lib/motion'

/**
 * Violet scanning beam from the orbiting ship down to Earth's surface.
 * Only visible during the orbit chapter. The beam is a two-point line whose
 * positions are written straight into a pre-allocated buffer — rebuilding
 * the geometry every frame used to allocate a new BufferAttribute per frame.
 */
export function Beam() {
  const line = useMemo(
    () =>
      new THREE.Line(
        new THREE.BufferGeometry(),
        new THREE.LineBasicMaterial({ color: 0xb07bff, transparent: true, opacity: 0 }),
      ),
    [],
  )
  const target = useMemo(() => new THREE.Vector3(), [])

  // Pre-allocated 2-point position buffer, updated in place every frame.
  useEffect(() => {
    const geometry = line.geometry
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3))
    return () => {
      geometry.dispose()
      ;(line.material as THREE.Material).dispose()
    }
  }, [line])

  useFrame(({ clock }) => {
    const scene = useVoyager.getState().scene
    if (scene === 'orbit') {
      const pos = line.geometry.getAttribute('position') as THREE.BufferAttribute
      const arr = pos.array as Float32Array
      target.set(motion.earthPos.x, motion.earthPos.y + 6.7, motion.earthPos.z)
      arr[0] = motion.shipPos.x
      arr[1] = motion.shipPos.y
      arr[2] = motion.shipPos.z
      arr[3] = target.x
      arr[4] = target.y
      arr[5] = target.z
      pos.needsUpdate = true
      line.material.opacity = 0.55 + Math.sin(clock.elapsedTime * 9) * 0.25
    } else {
      line.material.opacity = 0
    }
  })

  return <primitive object={line} />
}
