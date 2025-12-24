import "./style.css";
import { getCameraStream, stopMediaStream } from "./camera";
import { requestMotionPermission, onShake, onTilt } from "./motion";
import { startEyeTracking, hitTestGrid } from "./eye-tracking";
import { startCalibration } from "./calibration";
import {
  createVideoGrid,
  shuffleGrid,
  resetGrid,
  applyColorEffect,
  applyTiltTransform,
  highlightChunk,
  type ColorEffect,
} from "./grid";

const videoContainer = document.querySelector(
  ".video-container"
) as HTMLDivElement;
const shuffleBtn = document.querySelector(".shuffle") as HTMLButtonElement;
const resetBtn = document.querySelector(".reset") as HTMLButtonElement;
const motionBtn = document.querySelector("#enable-motion") as HTMLButtonElement;
const controls = document.querySelector(".controls");

// Dynamically create the Eye Tracking button
const eyeBtn = document.createElement("button");
eyeBtn.textContent = "Enable Eye Tracking";
eyeBtn.className = "effect-btn"; // Re-use existing styling
if (controls) controls.appendChild(eyeBtn);

let currentStream: MediaStream | null = null;
let isLandscape = window.innerWidth > window.innerHeight;

async function initApp() {
  try {
    // Ensure clean slate
    stopMediaStream(currentStream);

    // Default to standard camera on load
    currentStream = await getCameraStream();
    createVideoGrid(videoContainer, currentStream, isLandscape);
  } catch (err) {
    console.error("Initialization failed:", err);
  }
}

// --- Event Listeners ---

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

// Color Effects
document.querySelectorAll(".effect-btn").forEach((btn) => {
  // Skip the dynamically added eye button if it picked up the class
  if (btn === eyeBtn) return;

  btn.addEventListener("click", (e) => {
    const effect = (e.target as HTMLButtonElement).dataset
      .effect as ColorEffect;
    if (effect) {
      if ("startViewTransition" in document) {
        (document as any).startViewTransition(() =>
          applyColorEffect(videoContainer, effect)
        );
      } else {
        applyColorEffect(videoContainer, effect);
      }
    }
  });
});

// Motion Controls
motionBtn.addEventListener("click", async () => {
  const granted = await requestMotionPermission();
  if (granted) {
    motionBtn.style.display = "none";

    onShake(() => {
      if ("startViewTransition" in document) {
        (document as any).startViewTransition(() =>
          shuffleGrid(videoContainer)
        );
      } else {
        shuffleGrid(videoContainer);
      }
    });

    onTilt((beta, gamma) => {
      applyTiltTransform(videoContainer, beta, gamma);
    });
  } else {
    alert("Permission required for motion effects.");
  }
});

eyeBtn.addEventListener("click", async () => {
  eyeBtn.disabled = true;
  eyeBtn.textContent = "Loading...";

  try {
    stopMediaStream(currentStream);

    // 1. Initialize WebGazer
    const webgazerVideo = await startEyeTracking((x, y) => {
      const target = hitTestGrid(x, y, videoContainer);
      if (target) highlightChunk(target);
    });

    // 2. Set stream to grid
    if (webgazerVideo && webgazerVideo.srcObject) {
      currentStream = webgazerVideo.srcObject as MediaStream;
      createVideoGrid(videoContainer, currentStream, isLandscape);
    }

    // 3. START CALIBRATION immediately after loading
    eyeBtn.textContent = "Calibrate Now"; // Update text to instruct user

    startCalibration(() => {
      eyeBtn.textContent = "Eyes Active";
      eyeBtn.disabled = false;
    });
  } catch (err) {
    console.error("Eye tracking error:", err);
    initApp();
  }
});

// Orientation Handling
window.addEventListener("resize", () => {
  const newIsLandscape = window.innerWidth > window.innerHeight;
  if (newIsLandscape !== isLandscape) {
    isLandscape = newIsLandscape;
    // Debounce resize to prevent stream thrashing
    setTimeout(initApp, 200);
  }
});

// Start
initApp();
