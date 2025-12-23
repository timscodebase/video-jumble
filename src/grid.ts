import { CHUNK_COUNT, GRID_COLUMNS, VIEW_TRANSITION_PREFIX } from "./constants";

export type ColorEffect = "none" | "rainbow" | "random" | "primary";

export function createVideoGrid(
  container: HTMLElement,
  stream: MediaStream,
  isLandscape: boolean
) {
  container.innerHTML = "";

  const settings = stream.getVideoTracks()[0].getSettings();
  const width = isLandscape ? settings.width : settings.height || 640;
  const height = isLandscape ? settings.height : settings.width || 480;
  container.style.setProperty("aspect-ratio", `${width} / ${height}`);

  for (let i = 0; i < CHUNK_COUNT; i++) {
    const chunk = document.createElement("div");
    chunk.style.overflow = "hidden";
    chunk.style.position = "relative";
    chunk.style.setProperty(
      "view-transition-name",
      `${VIEW_TRANSITION_PREFIX}${i}`
    );

    const videoEl = document.createElement("video");
    videoEl.srcObject = stream;
    videoEl.autoplay = true;
    videoEl.muted = true;
    videoEl.playsInline = true;

    videoEl.style.width = "400%";
    videoEl.style.height = "400%";
    videoEl.style.position = "absolute";
    videoEl.style.top = `${-Math.floor(i / GRID_COLUMNS) * 100}%`;
    videoEl.style.left = `${-(i % GRID_COLUMNS) * 100}%`;

    // Create and add the overlay
    const overlay = document.createElement("div");
    overlay.className = "color-overlay";

    chunk.appendChild(videoEl);
    chunk.appendChild(overlay); // Crucial for colorizing
    container.appendChild(chunk);
    videoEl.play().catch(console.error);
  }
}

export function applyColorEffect(container: HTMLElement, effect: ColorEffect) {
  const chunks = Array.from(container.children);

  chunks.forEach((chunk, i) => {
    const overlay = chunk.querySelector(".color-overlay") as HTMLElement;
    if (!overlay) return;

    const row = Math.floor(i / GRID_COLUMNS);
    const col = i % GRID_COLUMNS;

    switch (effect) {
      case "rainbow":
        const hue = ((row + col) / (GRID_COLUMNS + 2)) * 360;
        overlay.style.backgroundColor = `hsl(${hue}, 70%, 50%)`;
        break;
      case "random":
        overlay.style.backgroundColor = `rgb(${Math.random() * 255}, ${
          Math.random() * 255
        }, ${Math.random() * 255})`;
        break;
      case "primary":
        const primaries = ["#ff0000", "#00ff00", "#0000ff"];
        overlay.style.backgroundColor = primaries[i % primaries.length];
        break;
      case "none":
      default:
        overlay.style.backgroundColor = "transparent";
    }
  });
}

export function shuffleGrid(container: HTMLElement) {
  const chunks = Array.from(container.children);
  for (let i = chunks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chunks[i], chunks[j]] = [chunks[j], chunks[i]];
  }
  container.append(...chunks);
}

export function resetGrid(container: HTMLElement) {
  const chunks = Array.from(container.children);
  chunks.sort((a, b) => {
    const getIdx = (el: Element) =>
      parseInt(
        (el as HTMLElement).style
          .getPropertyValue("view-transition-name")
          .split("-")[1]
      );
    return getIdx(a) - getIdx(b);
  });
  container.append(...chunks);
}
