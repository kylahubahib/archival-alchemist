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
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
});
