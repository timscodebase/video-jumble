// src/calibration.ts

export function startCalibration(onComplete: () => void) {
  // Create overlay
  const overlay = document.createElement("div");
  overlay.className = "calibration-overlay";
  document.body.appendChild(overlay);

  // 9-point positions (percentages of screen width/height)
  const points = [
    { x: 10, y: 10 },
    { x: 50, y: 10 },
    { x: 90, y: 10 },
    { x: 10, y: 50 },
    { x: 50, y: 50 },
    { x: 90, y: 50 },
    { x: 10, y: 90 },
    { x: 50, y: 90 },
    { x: 90, y: 90 },
  ];

  let clicksRemaining = points.length;

  points.forEach((p) => {
    const dot = document.createElement("div");
    dot.className = "calibration-dot";
    dot.style.left = `${p.x}%`;
    dot.style.top = `${p.y}%`;

    dot.addEventListener("click", () => {
      // Visual feedback
      dot.style.backgroundColor = "yellow";

      // WebGazer registers the click automatically for calibration.
      // We just need to manage the UI.

      setTimeout(() => {
        dot.classList.add("calibrated");
        clicksRemaining--;

        if (clicksRemaining === 0) {
          alert("Calibration Complete!");
          document.body.removeChild(overlay);
          onComplete();
        }
      }, 200);
    });

    overlay.appendChild(dot);
  });
}
