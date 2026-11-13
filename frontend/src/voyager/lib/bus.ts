/**
 * Tiny typed event bus for one-off scene commands ("shake the camera",
 * "kill the city lights"...). Lets the story script talk to the 3D scene
 * without threading refs through the component tree.
 */
type Handlers = {
  /** Fade the earth city lights out over `seconds`. */
  killCities: (seconds: number) => void
  /** Fire the blue transmission pulse rings. */
  pulse: () => void
  /** Fly the ship forward for `seconds`. */
  shipGo: (seconds: number) => void
  /** Elastic camera shake (used on every action click). */
  shake: () => void
}

const listeners: { [K in keyof Handlers]: Set<Handlers[K]> } = {
  killCities: new Set(),
  pulse: new Set(),
  shipGo: new Set(),
  shake: new Set(),
}

export const bus = {
  on<K extends keyof Handlers>(event: K, fn: Handlers[K]) {
    listeners[event].add(fn)
    return () => {
      listeners[event].delete(fn)
    }
  },
  emit<K extends keyof Handlers>(event: K, ...args: Parameters<Handlers[K]>) {
    for (const fn of listeners[event]) (fn as (...a: unknown[]) => void)(...args)
  },
}
