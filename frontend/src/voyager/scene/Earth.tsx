import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import type { PerspectiveCamera } from 'three'
import gsap from 'gsap'
import { EARTH_MAP, EARTH_LIGHTS, CLOUD_MAP } from './textures'
import { Atmosphere } from './Atmosphere'
import { PlanetLabel } from './PlanetLabel'
import { onSceneChange } from '../state/store'
import { bus } from '../lib/bus'
import { motion, RM } from '../lib/motion'
import { SCENE_TWEEN, aspectScale } from '../lib/anim'

/**
 * Earth surface shader.
 *
 * One sphere carries the day albedo, the night-side city lights and the cloud
 * shell. The terminator is a soft smoothstep around the sun direction, which
 * is enough to read as a real day/night line without a full PBR pipeline.
 */
const EARTH_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPosW;
  void main() {
    vUv = uv;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vPosW = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

const EARTH_FRAG = /* glsl */ `
  uniform sampler2D dayMap;
  uniform sampler2D nightMap;
  uniform sampler2D cloudMap;
  uniform vec3 sunDir;
  uniform vec3 rimColor;
  uniform float lightGain;
  uniform float cloudAmount;
  uniform float cloudShift;
  uniform float dim;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPosW;

  void main() {
    vec3 n = normalize(vNormalW);
    vec3 sun = normalize(sunDir);
    float ndl = dot(n, sun);

    // Soft terminator: a wide, slightly warm day side and a deep night side.
    float day = smoothstep(-0.16, 0.26, ndl);
    float night = 1.0 - smoothstep(-0.30, 0.06, ndl);

    vec3 albedo = texture2D(dayMap, vUv).rgb;
    vec3 lights = texture2D(nightMap, vUv).rgb;

    vec3 col = albedo * (0.05 + 1.08 * max(ndl, 0.0));

    // City lights only survive on the night side, and only while the grid is up.
    float cityMask = smoothstep(0.18, 0.55, max(lights.r, max(lights.g, lights.b)));
    col += lights * night * cityMask * lightGain * 2.6;

    // Warm scatter along the terminator.
    float dusk = pow(1.0 - abs(ndl), 8.0) * smoothstep(-0.25, 0.35, ndl);
    col += vec3(0.30, 0.13, 0.05) * dusk * 0.5;

    // Cloud shell, drifting slowly against the surface.
    vec2 cuv = vec2(fract(vUv.x + cloudShift), vUv.y);
    float clouds = texture2D(cloudMap, cuv).r;
    col = mix(col, vec3(0.92, 0.95, 1.0), clamp(clouds * cloudAmount * day, 0.0, 1.0));

    // Controlled rim light so the silhouette separates from the starfield.
    vec3 v = normalize(cameraPosition - vPosW);
    float rim = pow(1.0 - max(dot(n, v), 0.0), 3.0);
    col += rimColor * rim * 0.85 * max(ndl + 0.35, 0.0);

    col *= dim;
    gl_FragColor = vec4(col, 1.0);
  }
`

/**
 * Earth group: a single lit sphere with the real day/night surface, an
 * atmosphere shell and a name label. Owns all of its scene transitions.
 */
export function Earth() {
  const group = useRef<THREE.Group>(null!)
  const material = useRef<THREE.ShaderMaterial>(null!)
  const camera = useThree((s) => s.camera) as PerspectiveCamera

  const uniforms = useMemo(
    () => ({
      dayMap: { value: EARTH_MAP },
      nightMap: { value: EARTH_LIGHTS },
      cloudMap: { value: CLOUD_MAP },
      sunDir: { value: new THREE.Vector3(-0.55, 0.28, 0.79).normalize() },
      rimColor: { value: new THREE.Color('#27d3ff') },
      lightGain: { value: 1 },
      cloudAmount: { value: 0.55 },
      cloudShift: { value: 0 },
      dim: { value: 1 },
    }),
    [],
  )

  // Initial placement + rise from below. fromTo (not from) so StrictMode's
  // second run can't read the already-lifted inline y as its start value.
  useLayoutEffect(() => {
    group.current.position.set(0, -13, 0)
    group.current.scale.setScalar(0.9)
    if (!RM) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          group.current.position,
          { y: -18 },
          { y: -13, duration: 3, ease: 'power3.out' },
        )
      })
      return () => ctx.revert()
    }
  }, [])

  // Scene transitions (position, scale, dimming for the dead-earth look).
  useEffect(
    () =>
      onSceneChange((scene) => {
        const f = aspectScale(camera)
        const a = Math.min(1, camera.aspect / 1.5)
        if (scene === 'voyage') {
          gsap.to(group.current.position, { x: -9 * a, y: 1.5, z: -5, ...SCENE_TWEEN })
          gsap.to(group.current.scale, { x: 0.55 * f, y: 0.55 * f, z: 0.55 * f, ...SCENE_TWEEN })
        } else {
          gsap.to(group.current.position, { x: 0, y: -13, z: 0, ...SCENE_TWEEN })
          const s = scene === 'discovery' || scene === 'mars' ? 0.001 : 0.9
          gsap.to(group.current.scale, { x: s, y: s, z: s, ...SCENE_TWEEN })
        }
        // The last remnants are lit only by whatever the grid still holds.
        const dim = scene === 'rem' ? 0.34 : 1
        gsap.to(uniforms.dim, {
          value: dim,
          duration: SCENE_TWEEN.duration ? 2.4 : 0,
        })
      }),
    [camera, uniforms],
  )

  // "killCities" — the real DMSP city-light map fades out as the grid dies.
  useEffect(
    () =>
      bus.on('killCities', (seconds) =>
        gsap.to(uniforms.lightGain, { value: 0, duration: seconds, ease: 'none' }),
      ),
    [uniforms],
  )

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime
    const spin = RM ? 0 : 1
    group.current.rotation.y = t * 0.035 * spin
    uniforms.cloudShift.value = (uniforms.cloudShift.value + delta * 0.0035 * spin) % 1
    motion.earthPos.copy(group.current.position)
  })

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[5, 96, 64]} />
        <shaderMaterial
          ref={material}
          uniforms={uniforms}
          vertexShader={EARTH_VERT}
          fragmentShader={EARTH_FRAG}
        />
      </mesh>
      <Atmosphere color="#27d3ff" radius={5.3} power={4.2} strength={0.7} />
      <PlanetLabel text="EARTH" color="#7fe9ff" position={[0, 5.6, 0]} />
    </group>
  )
}
