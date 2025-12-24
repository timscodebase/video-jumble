// src/eye-tracking.ts
import webgazer from "webgazer";

export async function startEyeTracking(
  onGaze: (x: number, y: number) => void
): Promise<HTMLVideoElement> {
  // 1. Initialize WebGazer
  webgazer.params.showVideoPreview = true;

  // 2. Start the tracker
  // CHANGED: Use "TFFacemesh" instead of "clmtrackr"
  await webgazer.setRegression("ridge").setTracker("TFFacemesh").begin();

  // 3. Hide the default video/canvas elements Webgazer creates
  const video = document.getElementById(
    "webgazerVideoFeed"
  ) as HTMLVideoElement;
  const overlay = document.getElementById("webgazerFaceOverlay");
  const faceFeedback = document.getElementById("webgazerFaceFeedbackBox");

  if (video) {
    video.style.display = "none";
    video.style.position = "absolute";
  }
  if (overlay) overlay.style.display = "none";
  if (faceFeedback) faceFeedback.style.display = "none";

  // 4. Set up the listener
  webgazer.setGazeListener((data: any, _clock: number) => {
    if (data == null) return;
    onGaze(data.x, data.y);
  });

  return video;
}

export function hitTestGrid(
  x: number,
  y: number,
  container: HTMLElement
): HTMLElement | null {
  const element = document.elementFromPoint(x, y) as HTMLElement;

  if (element && container.contains(element)) {
    let current: HTMLElement | null = element;
    while (current && current !== container) {
      if (current.classList.contains("video-chunk")) {
        return current;
      }
      current = current.parentElement;
    }
  }
  return null;
}
