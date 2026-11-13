import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import type { Mesh, MeshBasicMaterial } from 'three'
import gsap from 'gsap'
import { bus } from '../lib/bus'

/**
 * Blue shockwave rings expanding from Earth when the distress message is
 * transmitted. <PulseRings/> listens on the bus; each <PulseRing/> animates
 * itself and removes itself when done.
 */
interface RingItem {
  id: number
  delay: number
}

let ringId = 0

export function PulseRings() {
  const [rings, setRings] = useState<RingItem[]>([])

  useEffect(
    () =>
      bus.on('pulse', () => {
        setRings((prev) => [
          ...prev,
          ...[0, 1, 2, 3].map((i) => ({ id: ++ringId, delay: i * 0.55 })),
        ])
      }),
    [],
  )

  return (
    <>
      {rings.map((r) => (
        <PulseRing
          key={r.id}
          delay={r.delay}
          onDone={() => setRings((prev) => prev.filter((x) => x.id !== r.id))}
        />
      ))}
    </>
  )
}

function PulseRing({ delay, onDone }: { delay: number; onDone: () => void }) {
  const mesh = useRef<Mesh>(null!)
  const mat = useRef<MeshBasicMaterial>(null!)

  useEffect(() => {
    gsap.fromTo(
      mesh.current.scale,
      { x: 1, y: 1 },
      { x: 14, y: 14, duration: 2.6, delay, ease: 'power1.out' },
    )
    gsap.fromTo(
      mat.current,
      { opacity: 0.9 },
      { opacity: 0, duration: 2.6, delay, onComplete: onDone },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <mesh ref={mesh} position={[0, -3, 2]}>
      <ringGeometry args={[0.9, 1, 64]} />
      <meshBasicMaterial
        ref={mat}
        color="#3a86ff"
        transparent
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}
