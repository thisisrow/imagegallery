# React + TypeScript + Vite Image Gallery

This project is a simple image gallery built with React, TypeScript, and Vite.

## Structure

- **src/App.tsx**: This is the root component of the application. It uses React's `useState` to manage which view is currently displayed: the welcome screen or the gallery. Initially, the welcome screen is shown. When the user completes the welcome interaction, a callback updates the state, causing the gallery to be rendered instead. The component conditionally renders either the `WellCome` or `Gallery` component based on this state.

- **src/components/WellCome.tsx**: This component is responsible for displaying a welcome message or introduction to the user. It receives an `onComplete` prop, which is a function called when the welcome process is finished (for example, after a button click or animation). This triggers the transition from the welcome screen to the gallery view in `App.tsx`.

- **src/components/Gallery.tsx**: This component displays the image gallery. It receives an `isVisible` prop from `App.tsx` to determine whether it should be shown. The gallery likely manages a collection of images and renders them, possibly using the `ImageItem` component for each image.

- **src/components/ImageItem.tsx**: This component is intended to render individual images within the gallery. It probably receives image data as props (such as the image URL and description) and displays them in a consistent format. This helps keep the gallery


## How It Works

- The app starts with a welcome screen (`WellCome` component).
- After the welcome is completed, the gallery (`Gallery` component) is shown.
- The gallery displays images, possibly using the `ImageItem` component.

## Getting Started

1. Install dependencies:  
   `npm install`
2. Start development server:  
   `npm run