import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import commonjs from '@rollup/plugin-commonjs'; // CommonJS plugin for compatibility
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'; // Polyfill for Node.js globals
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'; // Polyfill for Node.js modules

export default defineConfig({
    server: {
        host: 'localhost',
        cors: true, // Enable CORS
        fs: {
            strict: true, // Strict file serving
        },
        hmr: {
            timeout: 3000,
            overlay: false, // Disable error overlay
        },
    },
    build: {
        target: 'esnext', // Target modern browsers
    },
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true, // Enable hot module replacement
        }),
        react(),
        commonjs(), // Add CommonJS plugin for compatibility
    ],
    optimizeDeps: {
        esbuildOptions: {
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    process: true,
                    buffer: true,
                }),
                NodeModulesPolyfillPlugin(),
            ],
        },
    },
    define: {
        global: 'globalThis', // Polyfill the global object to `globalThis`
    },
    resolve: {
        alias: {
            stream: 'stream-browserify', // Polyfill stream
            util: 'util', // Polyfill Node.js util
            process: 'process/browser', // Polyfill process
        },
    },
});
