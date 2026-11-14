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
  uniform float power;
  uniform float strength;
  void main() {
    // n points along the view direction at the centre of the disc and is
    // perpendicular at the limb, so (1 - n.z) is a clean limb mask.
    float limb = pow(1.0 - clamp(n.z, 0.0, 1.0), power);
    gl_FragColor = vec4(c * limb * strength, limb * strength);
  }
`

/**
 * A thin atmosphere shell rendered on the back side of a sphere, additively
 * blended over whatever is behind it. The glow is confined to the limb so it
 * reads as air rather than as a halo around the planet.
 */
export function Atmosphere({
  color,
  radius,
  power = 3.4,
  strength = 0.85,
}: {
  color: string
  radius: number
  power?: number
  strength?: number
}) {
  const uniforms = useMemo(
    () => ({
      c: { value: new THREE.Color(color) },
      power: { value: power },
      strength: { value: strength },
    }),
    [color, power, strength],
  )

  return (
    <mesh>
      <sphereGeometry args={[radius, 64, 48]} />
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
