// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "/home/project";
var vite_config_default = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      assert: path.resolve(__vite_injected_original_dirname, "node_modules/assert/build/assert.js"),
      util: path.resolve(__vite_injected_original_dirname, "node_modules/util/util.js"),
      buffer: "buffer"
    }
  },
  optimizeDeps: {
    include: ["buffer"],
    esbuildOptions: {
      define: {
        global: "globalThis"
      }
    }
  },
  define: {
    "global": "globalThis",
    "Buffer": ["buffer", "Buffer"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBhc3NlcnQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdub2RlX21vZHVsZXMvYXNzZXJ0L2J1aWxkL2Fzc2VydC5qcycpLFxuICAgICAgdXRpbDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ25vZGVfbW9kdWxlcy91dGlsL3V0aWwuanMnKSxcbiAgICAgIGJ1ZmZlcjogJ2J1ZmZlcicsXG4gICAgfSxcbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogWydidWZmZXInXSxcbiAgICBlc2J1aWxkT3B0aW9uczoge1xuICAgICAgZGVmaW5lOiB7XG4gICAgICAgIGdsb2JhbDogJ2dsb2JhbFRoaXMnLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBkZWZpbmU6IHtcbiAgICAnZ2xvYmFsJzogJ2dsb2JhbFRoaXMnLFxuICAgICdCdWZmZXInOiBbJ2J1ZmZlcicsICdCdWZmZXInXSxcbiAgfSxcbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBeU4sU0FBUyxvQkFBb0I7QUFDdFAsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUZqQixJQUFNLG1DQUFtQztBQUt6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsUUFBUSxLQUFLLFFBQVEsa0NBQVcscUNBQXFDO0FBQUEsTUFDckUsTUFBTSxLQUFLLFFBQVEsa0NBQVcsMkJBQTJCO0FBQUEsTUFDekQsUUFBUTtBQUFBLElBQ1Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsUUFBUTtBQUFBLElBQ2xCLGdCQUFnQjtBQUFBLE1BQ2QsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLE1BQ1Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sVUFBVTtBQUFBLElBQ1YsVUFBVSxDQUFDLFVBQVUsUUFBUTtBQUFBLEVBQy9CO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
