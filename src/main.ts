import "./style.css";
import { getCameraStream, stopMediaStream } from "./camera";
import {
  createVideoGrid,
  shuffleGrid,
  resetGrid,
  applyColorEffect,
  type ColorEffect,
} from "./grid";

const videoContainer = document.querySelector(
  ".video-container"
) as HTMLDivElement;
const shuffleBtn = document.querySelector(".shuffle") as HTMLButtonElement;
const resetBtn = document.querySelector(".reset") as HTMLButtonElement;

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

// Existing Listeners
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

// New Effect Listeners
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

window.addEventListener("resize", () => {
  const newIsLandscape = window.innerWidth > window.innerHeight;
  if (newIsLandscape !== isLandscape) {
    isLandscape = newIsLandscape;
    setTimeout(initApp, 200);
  }
});

initApp();
