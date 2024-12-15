// vite.config.js
import { defineConfig } from "file:///D:/Programming%20Projects/PHP/archival-alchemist-main/archival-alchemist-main/node_modules/vite/dist/node/index.js";
import laravel from "file:///D:/Programming%20Projects/PHP/archival-alchemist-main/archival-alchemist-main/node_modules/laravel-vite-plugin/dist/index.js";
import react from "file:///D:/Programming%20Projects/PHP/archival-alchemist-main/archival-alchemist-main/node_modules/@vitejs/plugin-react/dist/index.mjs";
import commonjs from "file:///D:/Programming%20Projects/PHP/archival-alchemist-main/archival-alchemist-main/node_modules/@rollup/plugin-commonjs/dist/es/index.js";
import { NodeGlobalsPolyfillPlugin } from "file:///D:/Programming%20Projects/PHP/archival-alchemist-main/archival-alchemist-main/node_modules/@esbuild-plugins/node-globals-polyfill/dist/index.js";
import { NodeModulesPolyfillPlugin } from "file:///D:/Programming%20Projects/PHP/archival-alchemist-main/archival-alchemist-main/node_modules/@esbuild-plugins/node-modules-polyfill/dist/index.js";
var vite_config_default = defineConfig({
  server: {
    host: "localhost",
    cors: true,
    // Enable CORS
    fs: {
      strict: true
      // Strict file serving
    }
    // hmr: {
    //     timeout: 3000,
    //     overlay: false, // Disable error overlay
    // },
  },
  build: {
    target: "esnext"
    // Target modern browsers
  },
  plugins: [
    laravel({
      input: "resources/js/app.jsx",
      refresh: true
      // Enable hot module replacement
    }),
    react(),
    commonjs()
    // Add CommonJS plugin for compatibility
  ],
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true
        }),
        NodeModulesPolyfillPlugin()
      ]
    }
  },
  define: {
    global: "globalThis"
    // Polyfill the global object to `globalThis`
  },
  resolve: {
    alias: {
      stream: "stream-browserify",
      // Polyfill stream
      util: "util",
      // Polyfill Node.js util
      process: "process/browser"
      // Polyfill process
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxQcm9ncmFtbWluZyBQcm9qZWN0c1xcXFxQSFBcXFxcYXJjaGl2YWwtYWxjaGVtaXN0LW1haW5cXFxcYXJjaGl2YWwtYWxjaGVtaXN0LW1haW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFByb2dyYW1taW5nIFByb2plY3RzXFxcXFBIUFxcXFxhcmNoaXZhbC1hbGNoZW1pc3QtbWFpblxcXFxhcmNoaXZhbC1hbGNoZW1pc3QtbWFpblxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovUHJvZ3JhbW1pbmclMjBQcm9qZWN0cy9QSFAvYXJjaGl2YWwtYWxjaGVtaXN0LW1haW4vYXJjaGl2YWwtYWxjaGVtaXN0LW1haW4vdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCBsYXJhdmVsIGZyb20gJ2xhcmF2ZWwtdml0ZS1wbHVnaW4nO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcbmltcG9ydCBjb21tb25qcyBmcm9tICdAcm9sbHVwL3BsdWdpbi1jb21tb25qcyc7IC8vIENvbW1vbkpTIHBsdWdpbiBmb3IgY29tcGF0aWJpbGl0eVxuaW1wb3J0IHsgTm9kZUdsb2JhbHNQb2x5ZmlsbFBsdWdpbiB9IGZyb20gJ0Blc2J1aWxkLXBsdWdpbnMvbm9kZS1nbG9iYWxzLXBvbHlmaWxsJzsgLy8gUG9seWZpbGwgZm9yIE5vZGUuanMgZ2xvYmFsc1xuaW1wb3J0IHsgTm9kZU1vZHVsZXNQb2x5ZmlsbFBsdWdpbiB9IGZyb20gJ0Blc2J1aWxkLXBsdWdpbnMvbm9kZS1tb2R1bGVzLXBvbHlmaWxsJzsgLy8gUG9seWZpbGwgZm9yIE5vZGUuanMgbW9kdWxlc1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAgIHNlcnZlcjoge1xuICAgICAgICBob3N0OiAnbG9jYWxob3N0JyxcbiAgICAgICAgY29yczogdHJ1ZSwgLy8gRW5hYmxlIENPUlNcbiAgICAgICAgZnM6IHtcbiAgICAgICAgICAgIHN0cmljdDogdHJ1ZSwgLy8gU3RyaWN0IGZpbGUgc2VydmluZ1xuICAgICAgICB9LFxuICAgICAgICAvLyBobXI6IHtcbiAgICAgICAgLy8gICAgIHRpbWVvdXQ6IDMwMDAsXG4gICAgICAgIC8vICAgICBvdmVybGF5OiBmYWxzZSwgLy8gRGlzYWJsZSBlcnJvciBvdmVybGF5XG4gICAgICAgIC8vIH0sXG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgICB0YXJnZXQ6ICdlc25leHQnLCAvLyBUYXJnZXQgbW9kZXJuIGJyb3dzZXJzXG4gICAgfSxcbiAgICBwbHVnaW5zOiBbXG4gICAgICAgIGxhcmF2ZWwoe1xuICAgICAgICAgICAgaW5wdXQ6ICdyZXNvdXJjZXMvanMvYXBwLmpzeCcsXG4gICAgICAgICAgICByZWZyZXNoOiB0cnVlLCAvLyBFbmFibGUgaG90IG1vZHVsZSByZXBsYWNlbWVudFxuICAgICAgICB9KSxcbiAgICAgICAgcmVhY3QoKSxcbiAgICAgICAgY29tbW9uanMoKSwgLy8gQWRkIENvbW1vbkpTIHBsdWdpbiBmb3IgY29tcGF0aWJpbGl0eVxuICAgIF0sXG4gICAgb3B0aW1pemVEZXBzOiB7XG4gICAgICAgIGVzYnVpbGRPcHRpb25zOiB7XG4gICAgICAgICAgICBwbHVnaW5zOiBbXG4gICAgICAgICAgICAgICAgTm9kZUdsb2JhbHNQb2x5ZmlsbFBsdWdpbih7XG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3M6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBOb2RlTW9kdWxlc1BvbHlmaWxsUGx1Z2luKCksXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgIH0sXG4gICAgZGVmaW5lOiB7XG4gICAgICAgIGdsb2JhbDogJ2dsb2JhbFRoaXMnLCAvLyBQb2x5ZmlsbCB0aGUgZ2xvYmFsIG9iamVjdCB0byBgZ2xvYmFsVGhpc2BcbiAgICB9LFxuICAgIHJlc29sdmU6IHtcbiAgICAgICAgYWxpYXM6IHtcbiAgICAgICAgICAgIHN0cmVhbTogJ3N0cmVhbS1icm93c2VyaWZ5JywgLy8gUG9seWZpbGwgc3RyZWFtXG4gICAgICAgICAgICB1dGlsOiAndXRpbCcsIC8vIFBvbHlmaWxsIE5vZGUuanMgdXRpbFxuICAgICAgICAgICAgcHJvY2VzczogJ3Byb2Nlc3MvYnJvd3NlcicsIC8vIFBvbHlmaWxsIHByb2Nlc3NcbiAgICAgICAgfSxcbiAgICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQStaLFNBQVMsb0JBQW9CO0FBQzViLE9BQU8sYUFBYTtBQUNwQixPQUFPLFdBQVc7QUFDbEIsT0FBTyxjQUFjO0FBQ3JCLFNBQVMsaUNBQWlDO0FBQzFDLFNBQVMsaUNBQWlDO0FBRTFDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQ3hCLFFBQVE7QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQTtBQUFBLElBQ04sSUFBSTtBQUFBLE1BQ0EsUUFBUTtBQUFBO0FBQUEsSUFDWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLSjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0gsUUFBUTtBQUFBO0FBQUEsRUFDWjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ0wsUUFBUTtBQUFBLE1BQ0osT0FBTztBQUFBLE1BQ1AsU0FBUztBQUFBO0FBQUEsSUFDYixDQUFDO0FBQUEsSUFDRCxNQUFNO0FBQUEsSUFDTixTQUFTO0FBQUE7QUFBQSxFQUNiO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDVixnQkFBZ0I7QUFBQSxNQUNaLFNBQVM7QUFBQSxRQUNMLDBCQUEwQjtBQUFBLFVBQ3RCLFNBQVM7QUFBQSxVQUNULFFBQVE7QUFBQSxRQUNaLENBQUM7QUFBQSxRQUNELDBCQUEwQjtBQUFBLE1BQzlCO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNKLFFBQVE7QUFBQTtBQUFBLEVBQ1o7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNMLE9BQU87QUFBQSxNQUNILFFBQVE7QUFBQTtBQUFBLE1BQ1IsTUFBTTtBQUFBO0FBQUEsTUFDTixTQUFTO0FBQUE7QUFBQSxJQUNiO0FBQUEsRUFDSjtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
