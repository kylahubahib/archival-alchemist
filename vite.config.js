import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    server: {
        host: 'localhost',
        cors: true, // Enable CORS
        fs: {
            strict: true,
        },
        hmr: {
            timeout: 3000,
            overlay: false,
        },
    },
    build: {
        target: 'esnext',
    },
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',  // Entry point for your JS/React code
            refresh: true,                  // This will automatically refresh the page in the browser on changes
        }),
        react(), // React plugin to handle React JSX files
    ],
    optimizeDeps: {
        include: ['pdfjs-dist'] // Ensures pdfjs-dist is bundled correctly during development
    }
});
