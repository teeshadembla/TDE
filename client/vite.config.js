import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import glsl from 'vite-plugin-glsl';

// https://vite.dev/config/
export default defineConfig({
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [react(), tailwindcss(), glsl({
      include: '**/*.glsl',
    })],
})
