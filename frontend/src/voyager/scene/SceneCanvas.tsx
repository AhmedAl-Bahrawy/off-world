import { Canvas } from '@react-three/fiber'
import { useVoyager } from '../state/store'
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
      aria-hidden="true"
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      camera={{ fov: 50, near: 0.1, far: 600, position: [0, 0, 16] }}
      onCreated={({ gl }) => {
        // Report the first successful frame so the welcome screen can show
        // that the array is live instead of leaving the player guessing.
        gl.domElement.dataset.ready = '1'
        useVoyager.getState().setReady(true)
      }}
    >
      <Lighting />
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

/**
 * A three-light setup: a cold key from the sun's direction (the Earth shader
 * uses the same vector), a soft fill so the night side is not pure black, and
 * a cool rim that separates silhouettes from the starfield.
 */
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.42} color="#24365f" />
      <directionalLight intensity={1.5} position={[-11, 5.6, 15.8]} />
      <directionalLight intensity={0.55} position={[9, -4, -8]} color="#2f4fa8" />
      <directionalLight intensity={0.4} position={[0, 8, -14]} color="#4fd6ff" />
    </>
  )
}
