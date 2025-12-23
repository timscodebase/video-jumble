# Video Jumble

Video Jumble is a web-based interactive experiment that takes a live feed from your device's camera, splits it into a 4x4 grid of "chunks," and allows you to shuffle or reset their order. It leverages modern web APIs like `getUserMedia` for camera access and the View Transition API for smooth, animated reordering.

![No Color](https://res.cloudinary.com/tithos/image/upload/q_auto:good/v1766477168/IMG_9489_yjes2f.avif)

![Random Colors](https://res.cloudinary.com/tithos/image/upload/q_auto:good/v1766477168/IMG_9490_brukkg.avif)

![Primary Colors](https://res.cloudinary.com/tithos/image/upload/q_auto:good/v1766477168/IMG_9488_kjb635.avif)

![Rainbow Gradient](https://res.cloudinary.com/tithos/image/upload/q_auto:good/v1766477168/IMG_9487_mnqtmb.avif)

## Features

- **Live Camera Integration**: Automatically requests access to the user's front-facing camera.
- **4x4 Interactive Grid**: Dynamically generates 16 video elements, each displaying a different section of the live stream.
- **Animated Shuffling**: Randomly reorders the grid chunks with smooth animations using the View Transition API.
- **One-Click Reset**: Restores the video chunks to their original positions.
- **Responsive Orientation Support**: Automatically updates the aspect ratio and restarts the stream when switching between portrait and landscape modes on mobile.
- **Dark Mode Support**: Styled for both light and dark system preferences.

## Tech Stack

- **HTML5**: For structuring the web page.
- **CSS3**: For styling and animations.
- **Build Tool**: [Vite](https://vitejs.dev/) (using [rolldown-vite](https://github.com/rolldown/rolldown)).
- **Language**: [TypeScript](https://www.typescriptlang.org/).
- **Tooling**: [Biome](https://biomejs.dev/) for linting and formatting.
- **Package Manager**: [pnpm](https://pnpm.io/).

## Prerequisites

- **Node.js**: (Version compatible with your environment).
- **pnpm**: Recommended for dependency management.

## Getting Started

1.  Installation
    Clone the repository and install the dependencies:

        ```bash
        pnpm install
        ```

2.  Development
    Run the development server locally:

    ````bash
     pnpm run dev
     ```

    ````

3.  Testing on Mobile (iPhone/Safari)
    To access the camera on mobile devices, the application must be served over HTTPS. If you are using ngrok, start your local server and then run:

    ```bash
     ngrok http 5173
    ```

    Ensure your vite.config.ts includes your ngrok URL in the allowedHosts list to prevent connection errors.
