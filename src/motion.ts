// src/motion.ts

export async function requestMotionPermission(): Promise<boolean> {
  // Check if the browser requires permission (mostly iOS)
  if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
    try {
      const response = await (DeviceMotionEvent as any).requestPermission();
      return response === "granted";
    } catch (e) {
      console.error("Permission request failed", e);
      return false;
    }
  }
  // Android/Desktop usually doesn't require explicit permission
  return true;
}

export function onShake(callback: () => void) {
  let lastX: number | null = null;
  let lastY: number | null = null;
  let lastZ: number | null = null;
  const threshold = 15; // Sensitivity: higher is harder to shake

  window.addEventListener("devicemotion", (event) => {
    const acc = event.accelerationIncludingGravity;
    if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

    if (lastX !== null && lastY !== null && lastZ !== null) {
      const deltaX = Math.abs(lastX - acc.x);
      const deltaY = Math.abs(lastY - acc.y);
      const deltaZ = Math.abs(lastZ - acc.z);

      if (
        (deltaX > threshold && deltaY > threshold) ||
        (deltaX > threshold && deltaZ > threshold) ||
        (deltaY > threshold && deltaZ > threshold)
      ) {
        callback();
      }
    }

    lastX = acc.x;
    lastY = acc.y;
    lastZ = acc.z;
  });
}

export function onTilt(callback: (beta: number, gamma: number) => void) {
  window.addEventListener("deviceorientation", (event) => {
    if (event.beta !== null && event.gamma !== null) {
      callback(event.beta, event.gamma);
    }
  });
}
