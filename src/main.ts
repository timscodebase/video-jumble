import "./style.css";
// Put variables in global scope to make them available to the browser console.
const videoContainer = document.querySelector(
	".video-container",
) as HTMLDivElement;
const shuffleBtn = document.querySelector(".shuffle") as HTMLButtonElement;
const resetBtn = document.querySelector(".reset") as HTMLButtonElement;

const constraints = {
	audio: false,
	video: true,
};

navigator.mediaDevices
	.getUserMedia(constraints)
	.then((stream) => {
		const videoTracks = stream.getVideoTracks();
		stream.onremovetrack = () => {
			console.log("Stream ended");
		};

		videoContainer.innerHTML = "";
		const settings = videoTracks[0].getSettings();
		const width = settings.width || 640;
		const height = settings.height || 480;
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
			videoEl.className = `video-${i}`;
			videoEl.playsInline = true;
			videoEl.style.width = "400%";
			videoEl.style.height = "400%";
			videoEl.style.position = "absolute";
			videoEl.style.top = `${-Math.floor(i / 4) * 100}%`;
			videoEl.style.left = `${-(i % 4) * 100}%`;
			chunk.appendChild(videoEl);
			videoContainer.appendChild(chunk);
		}
	})
	.catch((error) => {
		if (error.name === "OverconstrainedError") {
			console.error(
				`The resolution ${constraints.video.width.exact}x${constraints.video.height.exact} px is not supported by your device.`,
			);
		} else if (error.name === "NotAllowedError") {
			console.error(
				"You need to grant this page permission to access your camera and microphone.",
			);
		} else {
			console.error(`getUserMedia error: ${error.name}`, error);
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
			const nameA = a.style.getPropertyValue("view-transition-name");
			const nameB = b.style.getPropertyValue("view-transition-name");
			return parseInt(nameA.split("-")[1]) - parseInt(nameB.split("-")[1]);
		});
		videoContainer.append(...chunks);
	};

	if ("startViewTransition" in document) {
		(document as any).startViewTransition(reset);
	}
}
