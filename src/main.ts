import "./style.css";
import { getCameraStream, stopMediaStream } from "./camera";
import { requestMotionPermission, onShake, onTilt } from "./motion";
import {
  createVideoGrid,
  shuffleGrid,
  resetGrid,
  applyColorEffect,
  applyTiltTransform,
  type ColorEffect,
} from "./grid";

const videoContainer = document.querySelector(
  ".video-container"
) as HTMLDivElement;
const shuffleBtn = document.querySelector(".shuffle") as HTMLButtonElement;
const resetBtn = document.querySelector(".reset") as HTMLButtonElement;
const motionBtn = document.querySelector("#enable-motion") as HTMLButtonElement;

let currentStream: MediaStream | null = null;
let isLandscape = window.innerWidth > window.innerHeight;

async function initApp() {
  try {
    stopMediaStream(currentStream);
    currentStream = await getCameraStream();
    createVideoGrid(videoContainer, currentStream, isLandscape);
  } catch (err) {
    console.error("Initialization failed:", err);
  }
}

// Button Listeners
shuffleBtn.addEventListener("click", () => {
  if ("startViewTransition" in document) {
    (document as any).startViewTransition(() => shuffleGrid(videoContainer));
  } else {
    shuffleGrid(videoContainer);
  }
});

resetBtn.addEventListener("click", () => {
  if ("startViewTransition" in document) {
    (document as any).startViewTransition(() => resetGrid(videoContainer));
  } else {
    resetGrid(videoContainer);
  }
});

// Color Effect Listeners
document.querySelectorAll(".effect-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const effect = (e.target as HTMLButtonElement).dataset
      .effect as ColorEffect;

    if ("startViewTransition" in document) {
      (document as any).startViewTransition(() =>
        applyColorEffect(videoContainer, effect)
      );
    } else {
      applyColorEffect(videoContainer, effect);
    }
  });
});

// Motion & Orientation Listeners
motionBtn.addEventListener("click", async () => {
  const granted = await requestMotionPermission();
  if (granted) {
    motionBtn.style.display = "none";

    // Shake to Shuffle
    onShake(() => {
      if ("startViewTransition" in document) {
        (document as any).startViewTransition(() =>
          shuffleGrid(videoContainer)
        );
      } else {
        shuffleGrid(videoContainer);
      }
    });

    // Tilt to Slide
    onTilt((beta, gamma) => {
      applyTiltTransform(videoContainer, beta, gamma);
    });
  }
});

window.addEventListener("resize", () => {
  const newIsLandscape = window.innerWidth > window.innerHeight;
  if (newIsLandscape !== isLandscape) {
    isLandscape = newIsLandscape;
    setTimeout(initApp, 200);
  }
});

initApp();
