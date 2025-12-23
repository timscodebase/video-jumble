//
import { CHUNK_COUNT, GRID_COLUMNS, VIEW_TRANSITION_PREFIX } from "./constants";

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

    // Formatting chunk position
    videoEl.style.width = "400%";
    videoEl.style.height = "400%";
    videoEl.style.position = "absolute";
    videoEl.style.top = `${-Math.floor(i / GRID_COLUMNS) * 100}%`;
    videoEl.style.left = `${-(i % GRID_COLUMNS) * 100}%`;

    chunk.appendChild(videoEl);
    container.appendChild(chunk);
    videoEl.play().catch(console.error);
  }
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
