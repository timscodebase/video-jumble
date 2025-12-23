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

  // Debounce logic
  let lastShakeTime = 0;
  const shakeCooldown = 1000; // 1 second wait between shuffles
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
        // Check cooldown
        const now = Date.now();
        if (now - lastShakeTime > shakeCooldown) {
          lastShakeTime = now;
          callback();
        }
      }
    }

    lastX = acc.x;
    lastY = acc.y;
    lastZ = acc.z;
  });
}

export function onTilt(callback: (beta: number, gamma: number) => void) {
  // Use requestAnimationFrame to smooth out the tilt updates (optional but recommended)
  let ticking = false;

  window.addEventListener(
    "deviceorientation",
    (event) => {
      if (!ticking && event.beta !== null && event.gamma !== null) {
        window.requestAnimationFrame(() => {
          callback(event.beta!, event.gamma!); // Non-null assertion since we checked
          ticking = false;
        });
        ticking = true;
      }
    },
    true
  );
}
