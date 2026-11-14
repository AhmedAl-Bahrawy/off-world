import { useEffect, useRef } from 'react'
import type { PerspectiveCamera } from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { onSceneChange, useVoyager, type SceneName } from '../state/store'
import { bus } from '../lib/bus'
import { RM } from '../lib/motion'
import { SCENE_DUR } from '../lib/anim'

type Shot = {
  px: number
  py: number
  pz: number
  tx: number
  ty: number
  tz: number
  fov: number
}

/**
 * The camera rig is the ONLY thing that writes camera properties.
 *
 * Everything else (actors, effects, the story) asks the rig to move by
 * changing the scene, so two systems can never fight over the same
 * transform. The rig holds one pose object that GSAP animates:
 *
 *   px/py/pz  camera position
 *   tx/ty/tz  look-at target
 *   lift      vertical arc added during a transition
 *   dolly     slow continuous push-in (used during the voyage)
 *   fov       field of view
 *
 * Pointer parallax and the action "shake" are additive offsets applied on
 * top of that pose, so they can never corrupt a choreographed move.
 */
export function CameraRig() {
  const camera = useThree((s) => s.camera) as PerspectiveCamera
  const pointer = useRef({ x: 0, y: 0 })
  const shake = useRef(0)

  const pose = useRef({
    px: 0,
    py: 0,
    pz: 16,
    tx: 0,
    ty: 0,
    tz: 0,
    lift: 0,
    dolly: 0,
    fov: 50,
  })

  // Track the pointer for parallax.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX / innerWidth - 0.5
      pointer.current.y = e.clientY / innerHeight - 0.5
    }
    addEventListener('pointermove', onMove)
    return () => removeEventListener('pointermove', onMove)
  }, [])

  /** Move the rig to a shot. `pushIn` marks scenes that keep dollying. */
  const applyShot = (shot: Shot, pushIn = false, arc = 1.9) => {
    const p = pose.current
    gsap.killTweensOf(p)

    if (RM) {
      Object.assign(p, shot)
      p.lift = 0
      p.dolly = 0
      return
    }

    // A short lead-in that lifts the camera, then settles into the shot.
    // The arc reads as a deliberate move instead of a linear slide.
    gsap.fromTo(p, { lift: arc }, { lift: 0, duration: SCENE_DUR, ease: 'power2.out' })
    gsap.to(p, {
      px: shot.px,
      py: shot.py,
      pz: shot.pz,
      tx: shot.tx,
      ty: shot.ty,
      tz: shot.tz,
      fov: shot.fov,
      duration: SCENE_DUR,
      ease: 'power3.inOut',
    })

    // The voyage keeps pushing in for as long as it lasts — the travel has
    // to feel like travel, not a held frame.
    if (pushIn) {
      gsap.fromTo(p, { dolly: 0 }, { dolly: -3.2, duration: 46, ease: 'none' })
    } else {
      gsap.to(p, { dolly: 0, duration: 2, ease: 'power2.out' })
    }
  }

  // Scene change: a single coordinated move to the new shot.
  useEffect(
    () =>
      onSceneChange((scene) => {
        if (useVoyager.getState().phase !== 'playing') return
        applyShot(SHOTS[scene], scene === 'voyage', scene === 'voyage' ? 1.1 : 1.9)
      }),
    [],
  )

  // The title screen is its own shot: Earth small and low, room for the type.
  useEffect(
    () =>
      useVoyager.subscribe((s, prev) => {
        if (s.phase === prev.phase) return
        if (s.phase === 'gate') applyShot(SHOTS.gate, false, 0.9)
        else applyShot(SHOTS[s.scene], s.scene === 'voyage')
      }),
    [],
  )

  // Elastic shake on clicks.
  useEffect(
    () =>
      bus.on('shake', () => {
        if (RM) return
        shake.current = 1
      }),
    [],
  )

  useFrame((_, delta) => {
    const p = pose.current

    // Shake decays quickly; it is a punctuation mark, not an effect.
    if (shake.current > 0) {
      shake.current = Math.max(0, shake.current - delta * 3.4)
    }

    const par = RM ? 0 : 1
    const parX = pointer.current.x * 1.5 * par
    const parY = -pointer.current.y * 0.9 * par
    const sh = shake.current * shake.current
    const shX = Math.sin(p.lift * 9 + shake.current * 40) * 0.32 * sh
    const shY = Math.cos(shake.current * 33) * 0.26 * sh

    camera.position.set(
      p.px + parX + shX,
      p.py + p.lift + parY + shY,
      p.pz + p.dolly,
    )
    camera.lookAt(p.tx, p.ty, p.tz)

    if (Math.abs(camera.fov - p.fov) > 0.01) {
      camera.fov = p.fov
      camera.updateProjectionMatrix()
    }
  })

  return null
}

/**
 * One shot per scene: where the camera stands and what it looks at.
 * Framing is composed so each scene has a single, clear subject and the
 * HUD never fights the image.
 */
const SHOTS: Record<SceneName | 'gate', Shot> = {
  // Title screen: Earth a small limb in the lower third.
  gate: { px: 0, py: 3.2, pz: 31, tx: 0, ty: -7.5, tz: 0, fov: 48 },
  // Earth sits low in frame, rising into view — a quiet establishing shot.
  collapse: { px: 0, py: 1.2, pz: 16.5, tx: 0, ty: -6.2, tz: 0, fov: 50 },
  // Closer on the same body: the transmission is the subject now.
  signal: { px: 0, py: 0.4, pz: 14.5, tx: 0, ty: -6.6, tz: 0, fov: 46 },
  // Wide two-shot: Kalamith on one side, Earth on the other, ship between.
  voyage: { px: 0, py: 1.4, pz: 21, tx: 0, ty: 0.8, tz: -5.4, fov: 52 },
  // Pulled back and low, so the orbiting ship and the beam both read.
  orbit: { px: 1.6, py: 3.4, pz: 17.5, tx: 0, ty: -4.6, tz: 0, fov: 50 },
  // Nothing left to look at: a slow drift across empty space.
  rem: { px: -2.2, py: 1.2, pz: 17, tx: 0, ty: 0, tz: 0, fov: 58 },
  // The discovery scene is a full-screen layer; the canvas stays out of the way.
  discovery: { px: 0, py: 0, pz: 26, tx: 0, ty: 0, tz: 0, fov: 50 },
  mars: { px: 0, py: 0, pz: 24, tx: 0, ty: 0, tz: 0, fov: 50 },
}
