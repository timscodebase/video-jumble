// src/motion.ts

export async function requestMotionPermission(): Promise<boolean> {
  // 1. Try Requesting DeviceOrientation (Tilt)
  if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
    try {
      const permission = await (
        DeviceOrientationEvent as any
      ).requestPermission();
      if (permission !== "granted") return false;
    } catch (e) {
      console.error("Orientation permission failed", e);
      return false;
    }
  }

  // 2. Try Requesting DeviceMotion (Shake)
  if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
    try {
      const permission = await (DeviceMotionEvent as any).requestPermission();
      if (permission !== "granted") return false;
    } catch (e) {
      console.error("Motion permission failed", e);
      return false;
    }
  }

  return true;
}

export function onShake(callback: () => void) {
  let lastX: number | null = null;
  let lastY: number | null = null;
  let lastZ: number | null = null;
  const threshold = 15;

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
  window.addEventListener(
    "deviceorientation",
    (event) => {
      // Check if values are available (they can be null on some devices)
      if (event.beta !== null && event.gamma !== null) {
        callback(event.beta, event.gamma);
      }
    },
    true
  ); // Use capture phase to ensure we catch it
}
