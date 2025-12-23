//
import "./style.css";
import { getCameraStream, stopMediaStream } from "./camera";
import { createVideoGrid, shuffleGrid, resetGrid } from "./grid";

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

// Event Listeners
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

window.addEventListener("resize", () => {
  const newIsLandscape = window.innerWidth > window.innerHeight;
  if (newIsLandscape !== isLandscape) {
    isLandscape = newIsLandscape;
    setTimeout(initApp, 200);
  }
});

initApp();
