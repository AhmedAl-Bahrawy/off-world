# Component guide

How to reuse the primitives introduced in the pro-polish pass. Everything
lives under `frontend/src/voyager/ui/primitives/` and `lib/`.

## `ActLayout` / `ActRow` — interaction window bodies

Every player-facing window body used to copy-paste the same
`prompt → controls → hint` skeleton. Use the shared layout instead:

```tsx
import { ActLayout, ActRow } from '../primitives'

<ActLayout question="Tap fast to charge." hint={hint}>
  <ActRow>
    <button onClick={mash}>CHARGE</button>
  </ActRow>
</ActLayout>
```

- `question` renders the `.q` prompt line (optional).
- `hint` renders the `.hint` status line with `aria-live` semantics
  (omit when the interaction has no status).
- `ActRow` is the centered flex row of controls.

## `Tile` — the square action button

Used by the repair/scan panels, key authorization and vault pads — one
component instead of three diverging copies.

```tsx
<Tile
  icon="key"
  label="WEST KEY"
  on={lit}              // lit/done state (renders the glow + note)
  note="TURNED"         // result text revealed when `on`
  accent="bl"           // optional accent override (defaults to window accent)
  pressed={lit}         // aria-pressed
  ariaLabel="…"         // for icon-only pads
  buttonRef={ref}       // optional ref for direct animation
  onClick={turn}
/>
```

## `useLitSet` — "which items are lit" state

One representation for click-to-complete interactions:

```tsx
const { add, has, size, litRef, clear } = useLitSet()
```

- `add(i)` / `has(i)` / `size` — render from state.
- `litRef` — a `Set<number>` kept in sync for reading inside intervals
  without re-subscribing (used by the decoder scramble loop).
- `clear()` — reset (key reset window).

## `useTimeout` — unmount-safe timers

Every interaction that schedules a delayed `finishAct()` uses this instead
of a raw `setTimeout`, so a stale callback can never fire after the window
changed or unmounted:

```tsx
const finish = useTimeout()
finish(() => finishAct(), 650)   // auto-cleared on unmount
```

## `lib/anim.ts` — shared animation constants

- `SCENE_TWEEN` — the long planet/ship/camera transition tween
  (`duration: 2.4s, power3.inOut`, `0` under reduced motion). Used by
  `Earth`, `Ship`, `Kalamith`.
- `SCENE_DUR` — just the duration, when a custom ease is needed (`CameraRig`).
- `WIN_OPEN` / `WIN_CLOSE` — HUD window chrome timings (`Windows.tsx`).
- `D` — reduced-motion duration multiplier for the discovery scene.

Change pacing app-wide by editing this one file.

## `lib/audio.ts` — audio with a mute switch

One `AudioContext` for the whole session (a fresh one per replay used to
leak oscillators until browsers capped out at ~6 contexts):

```ts
startAudio()      // create/resume the hum (call from a user gesture)
stopAudio()       // close it (used when returning to the gate)
blip(660, 0.04)   // short UI tone — no-op when muted or no context
setMuted(true) / isMuted()
```

The `<SoundToggle />` component in the header wraps this; mute state
survives replays because it lives in the module, not the store.

## `state/interactions.ts` — the act bridge

```ts
// Story side (script.ts):
const choice = await requestAct<number>('or', 'ask', { ... })  // parks a promise

// UI side (interaction component):
finishAct(choiceIndex, 260)     // closes the act window, resolves the promise
```

Replays: `cancelAct()` resolves any parked promise with `ACT_CANCELLED`
so an old screenplay wakes up, notices its run token is stale and aborts.
New interactions should follow the same contract: check `alive()` /
`ACT_CANCELLED` after every `await`.
