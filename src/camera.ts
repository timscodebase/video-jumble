//
import { IDEAL_HEIGHT, IDEAL_WIDTH } from "./constants";

export async function getCameraStream(): Promise<MediaStream> {
  const constraints = {
    audio: false,
    video: {
      facingMode: "user",
      width: { ideal: IDEAL_WIDTH },
      height: { ideal: IDEAL_HEIGHT },
    },
  };

  return await navigator.mediaDevices.getUserMedia(constraints);
}

export function stopMediaStream(stream: MediaStream | null) {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
}
