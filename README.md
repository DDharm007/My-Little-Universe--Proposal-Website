# The Little Universe

A seven-chapter, full-screen proposal storybook built with React, TypeScript, and Vite. The supplied background, music, and favicon live in `public/` so Vite includes them in production builds.

## Run locally

```sh
npm install
npm run dev
```

Use the bottom controls, chapter markers, arrow keys, or a horizontal touch swipe to turn pages. The sound toggle plays `public/bg music.aac`.

To personalize the memories, letter, and final note, edit the `memories` array and chapter copy in `src/App.tsx`.

## Deploy to Vercel

Import this project/repository in Vercel. The included `vercel.json` configures `npm run build` and the `dist` output directory. No environment variables are required.
