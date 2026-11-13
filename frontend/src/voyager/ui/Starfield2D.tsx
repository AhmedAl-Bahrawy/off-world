import { useEffect, useRef } from 'react'
import { motion, RM } from '../lib/motion'

/**
 * Parallax star drift drawn on a plain 2D canvas behind everything (the R3F
 * scene renders above it). Speed is eased toward `motion.starTarget`, which
 * the story cranks up during the voyage.
 */
export function Starfield2D() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    let W = 0
    let H = 0
    let stars: Array<{ x: number; y: number; z: number }> = []

    const resize = () => {
      W = canvas.width = innerWidth
      H = canvas.height = innerHeight
      stars = Array.from({ length: Math.min(260, ((W * H) / 5500) | 0) }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        z: Math.random() * 0.9 + 0.1,
      }))
    }
    resize()
    addEventListener('resize', resize)

    let raf = 0
    const draw = () => {
      motion.starSpeed += (motion.starTarget - motion.starSpeed) * 0.02
      ctx.clearRect(0, 0, W, H)
      for (const s of stars) {
        if (!RM) s.x -= motion.starSpeed * s.z * 1.5
        if (s.x < -60) s.x = W + Math.random() * 30
        ctx.fillStyle = `rgba(200,235,255,${0.25 + s.z * 0.65})`
        ctx.fillRect(s.x, s.y, 1 + motion.starSpeed * s.z * 9, s.z > 0.6 ? 1.6 : 1)
      }
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className="kx-sky" />
}
