import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// MTIVE site — Vite + React. JSX is compiled ahead of time (no in-browser
// Babel). Static assets and fonts live in public/ and are served at /assets
// and /fonts. Build output goes to dist/ (Vercel: output directory = dist).
export default defineConfig({
  plugins: [react()],
});
