import { useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useVoyager } from '../state/store'
import { motion } from '../lib/motion'

/**
 * Violet scanning beam from the orbiting ship down to Earth's surface.
 * Only visible during the orbit chapter; geometry is rebuilt every frame
 * from the live ship/earth positions (same as the original demo).
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

  useFrame(({ clock }) => {
    const scene = useVoyager.getState().scene
    if (scene === 'orbit') {
      target.set(motion.earthPos.x, motion.earthPos.y + 6.7, motion.earthPos.z)
      line.geometry.setFromPoints([motion.shipPos, target])
      line.material.opacity = 0.55 + Math.sin(clock.elapsedTime * 9) * 0.25
    } else {
      line.material.opacity = 0
    }
  })

  return <primitive object={line} />
}
