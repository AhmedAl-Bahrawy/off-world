import { useMemo } from 'react'
import * as THREE from 'three'

const ATMO_VERT = /* glsl */ `
  varying vec3 n;
  void main() {
    n = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
  }
`

const ATMO_FRAG = /* glsl */ `
  varying vec3 n;
  uniform vec3 c;
  void main() {
    float i = pow(.74 - dot(n, vec3(0., 0., 1.)), 3.);
    gl_FragColor = vec4(c * i * 1.8, i);
  }
`

/**
 * Glowing atmosphere shell rendered on the back side of a sphere, additive
 * over whatever is behind it. Used by both Earth and Kalamith.
 */
export function Atmosphere({ color, radius }: { color: string; radius: number }) {
  const uniforms = useMemo(
    () => ({ c: { value: new THREE.Color(color) } }),
    [color],
  )

  return (
    <mesh>
      <sphereGeometry args={[radius, 48, 32]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={ATMO_VERT}
        fragmentShader={ATMO_FRAG}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}
