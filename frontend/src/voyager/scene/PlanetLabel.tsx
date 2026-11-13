import { useEffect, useMemo, useRef } from 'react'
import type { SpriteMaterial } from 'three'
import gsap from 'gsap'
import { labelTexture } from './textures'
import { onSceneChange } from '../state/store'
import { RM } from '../lib/motion'

/**
 * Canvas-sprite planet name ("EARTH", "KALAMITH"), only visible during the
 * voyage chapter. The texture is stamped immediately and re-stamped once the
 * Orbitron webfont has loaded.
 */
export function PlanetLabel({
  text,
  color,
  position,
}: {
  text: string
  color: string
  position: [number, number, number]
}) {
  const matRef = useRef<SpriteMaterial>(null!)
  const { texture, draw } = useMemo(() => labelTexture(text, color), [text, color])

  useEffect(() => {
    document.fonts.load('800 38px Orbitron').then(draw).catch(() => {})
  }, [draw])

  // Fade in only for the voyage scene.
  useEffect(
    () =>
      onSceneChange((scene) => {
        gsap.to(matRef.current, {
          opacity: scene === 'voyage' ? 1 : 0,
          duration: RM ? 0 : 1,
        })
      }),
    [],
  )

  return (
    <sprite position={position} scale={[6.4, 0.96, 1]}>
      <spriteMaterial
        ref={matRef}
        map={texture}
        transparent
        depthTest={false}
        opacity={0}
      />
    </sprite>
  )
}
