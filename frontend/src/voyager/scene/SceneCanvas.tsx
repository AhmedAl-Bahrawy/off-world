import { Canvas } from '@react-three/fiber'
import { CameraRig } from './CameraRig'
import { Starfield3D } from './Starfield3D'
import { Earth } from './Earth'
import { Kalamith } from './Kalamith'
import { Ship } from './Ship'
import { Beam } from './Beam'
import { PulseRings } from './PulseRings'

/**
 * The R3F renderer: transparent full-screen canvas behind the HUD windows,
 * containing every 3D actor. Each actor component owns its own scene
 * transitions — this file is only composition + lighting.
 */
export function SceneCanvas() {
  return (
    <Canvas
      className="kx-gl"
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      camera={{ fov: 50, near: 0.1, far: 600, position: [0, 0, 16] }}
    >
      {/* Lighting: cold blue ambient + a strong key light from the left. */}
      <ambientLight intensity={0.9} color="#2a3a66" />
      <directionalLight intensity={1.25} position={[-8, 6, 10]} />

      <CameraRig />
      <Starfield3D />
      <Earth />
      <Kalamith />
      <Ship />
      <Beam />
      <PulseRings />
    </Canvas>
  )
}
