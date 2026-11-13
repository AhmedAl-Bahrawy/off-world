import { useEffect, useRef } from 'react'
import type { PerspectiveCamera } from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { onSceneChange } from '../state/store'
import { bus } from '../lib/bus'
import { RM } from '../lib/motion'

/**
 * Camera behaviour: gentle mouse parallax every frame, a z-dolly per scene
 * change, and an elastic "shake" used for action feedback.
 */
export function CameraRig() {
  const camera = useThree((s) => s.camera) as PerspectiveCamera
  const target = useRef({ x: 0, y: 0 })

  // Track the pointer for parallax.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX / innerWidth - 0.5
      target.current.y = e.clientY / innerHeight - 0.5
    }
    addEventListener('pointermove', onMove)
    return () => removeEventListener('pointermove', onMove)
  }, [])

  // Scene change: pull the camera slightly closer for the voyage.
  useEffect(
    () =>
      onSceneChange((scene) => {
        gsap.to(camera.position, {
          z: scene === 'voyage' ? 15 : 16,
          duration: RM ? 0 : 2.4,
          ease: 'power2.inOut',
        })
      }),
    [camera],
  )

  // Elastic shake on clicks.
  useEffect(
    () =>
      bus.on('shake', () => {
        if (RM) return
        gsap.fromTo(
          camera.position,
          { z: 15.2 },
          { z: 16, duration: 0.6, ease: 'elastic.out(1,.3)' },
        )
      }),
    [camera],
  )

  useFrame(() => {
    if (RM) return
    camera.position.x += (target.current.x * 1.6 - camera.position.x) * 0.03
    camera.position.y += (-target.current.y - camera.position.y) * 0.03
    camera.lookAt(0, 0, 0)
  })

  return null
}
