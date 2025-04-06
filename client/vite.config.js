import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { resolve } from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite({ autoCodeSplitting: true }), viteReact()],
  test: {
    globals: true,
    environment: "jsdom",
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React dependencies
          'react-vendor': ['react', 'react-dom'],
          
          // UI framework
          'mui': ['@mui/material', '@mui/icons-material'],
          
          // Animation libraries
          'animation': ['motion/react'],
          
          // WebGL/3D libraries (React Bits components use these)
          'webgl': ['ogl'],
          
          // Split React Bits components into their own chunks
          'reactbits-aurora': ['./src/components/ui/Backgrounds/Aurora/Aurora.tsx'],
          'reactbits-threads': ['./src/components/ui/Backgrounds/Threads/Threads.tsx'],
          'reactbits-particles': ['./src/components/ui/Backgrounds/Particles/Particles.tsx'],
          'reactbits-circular': ['./src/components/ui/Components/CircularGallery/CircularGallery.tsx'],
        }
      }
    }
  }
});
