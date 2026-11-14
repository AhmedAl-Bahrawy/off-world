export const SCENE_NAVIGATE_EVENT = "offworld:scene-navigate";

export function navigateScene(path: string) {
  window.dispatchEvent(
    new CustomEvent(SCENE_NAVIGATE_EVENT, { detail: { path } }),
  );
}
