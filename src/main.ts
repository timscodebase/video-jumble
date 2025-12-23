import "./style.css";

// Put variables in global scope to make them available to the browser console.
const videoContainer = document.querySelector(
  ".video-container"
) as HTMLDivElement;
const shuffleBtn = document.querySelector(".shuffle") as HTMLButtonElement;
const resetBtn = document.querySelector(".reset") as HTMLButtonElement;

let currentStream: MediaStream | null = null;

// Track the current orientation state (landscape vs portrait)
let isLandscape = window.innerWidth > window.innerHeight;

async function startStream() {
  // Stop any existing tracks to free up the camera
  if (currentStream) {
    currentStream.getTracks().forEach((track) => track.stop());
  }

  // Define constraints
  // We use 'ideal' values. On mobile, the browser will typically flip these
  // (e.g., 480x640) if the device is in portrait mode.
  const constraints = {
    audio: false,
    video: {
      facingMode: "user",
      width: { ideal: 640 },
      height: { ideal: 480 },
    },
  };

  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    currentStream = stream;

    const videoTracks = stream.getVideoTracks();
    stream.onremovetrack = () => {
      console.log("Stream ended");
    };

    videoContainer.innerHTML = "";
    const settings = videoTracks[0].getSettings();

    // Use the actual settings from the camera to set the aspect ratio
    const width = isLandscape ? settings.width : settings.height || 640;
    const height = isLandscape ? settings.height : settings.width || 480;

    // Update the container's aspect ratio to match the camera feed
    videoContainer.style.setProperty("aspect-ratio", `${width} / ${height}`);

    for (let i = 0; i < 16; i++) {
      const chunk = document.createElement("div");
      chunk.style.overflow = "hidden";
      chunk.style.position = "relative";
      chunk.style.setProperty("view-transition-name", `chunk-${i}`);

      const videoEl = document.createElement("video");
      videoEl.srcObject = stream;
      videoEl.autoplay = true;
      videoEl.muted = true;
      videoEl.playsInline = true;
      videoEl.className = `video-${i}`;

      videoEl.play().catch((e) => console.error("Play error:", e));

      videoEl.style.width = "400%";
      videoEl.style.height = "400%";
      videoEl.style.position = "absolute";
      videoEl.style.top = `${-Math.floor(i / 4) * 100}%`;
      videoEl.style.left = `${-(i % 4) * 100}%`;

      chunk.appendChild(videoEl);
      videoContainer.appendChild(chunk);
    }
  } catch (error: any) {
    if (error.name === "OverconstrainedError") {
      console.error(
        "The requested resolution is not supported by your device."
      );
    } else if (error.name === "NotAllowedError") {
      console.error("Permission denied.");
    } else {
      console.error(`getUserMedia error: ${error.name}`, error);
    }
  }
}

// Initial start
startStream();

// Handle device orientation changes
window.addEventListener("resize", () => {
  const newIsLandscape = window.innerWidth > window.innerHeight;

  // Only restart the stream if the orientation actually changed (Landscape <-> Portrait)
  // This prevents restarting on minor resizes (like the URL bar hiding/showing)
  if (newIsLandscape !== isLandscape) {
    isLandscape = newIsLandscape;
    // Add a small delay to allow the device to settle
    setTimeout(startStream, 200);
  }
});

shuffleBtn.addEventListener("click", () => {
  const shuffle = () => {
    const chunks = Array.from(videoContainer.children);
    for (let i = chunks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chunks[i], chunks[j]] = [chunks[j], chunks[i]];
    }
    videoContainer.append(...chunks);
  };

  if ("startViewTransition" in document) {
    (document as any).startViewTransition(shuffle);
  } else {
    shuffle();
  }
});

resetBtn.addEventListener("click", () => resetVideoChunkOrder());

function resetVideoChunkOrder() {
  const reset = () => {
    const chunks = Array.from(videoContainer.children);
    chunks.sort((a, b) => {
      const nameA = (a as HTMLElement).style.getPropertyValue(
        "view-transition-name"
      );
      const nameB = (b as HTMLElement).style.getPropertyValue(
        "view-transition-name"
      );
      return parseInt(nameA.split("-")[1]) - parseInt(nameB.split("-")[1]);
    });
    videoContainer.append(...chunks);
  };

  if ("startViewTransition" in document) {
    (document as any).startViewTransition(reset);
  }
}
