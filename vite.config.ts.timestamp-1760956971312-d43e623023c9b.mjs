// vite.config.ts
import { defineConfig } from "file:///C:/Users/USER/Desktop/personal_project/eduAssign/dark-luxe-theme-2/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/USER/Desktop/personal_project/eduAssign/dark-luxe-theme-2/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
var __vite_injected_original_dirname = "C:\\Users\\USER\\Desktop\\personal_project\\eduAssign\\dark-luxe-theme-2";
var logErrorsPlugin = () => ({
  name: "log-errors-plugin",
  transformIndexHtml(html) {
    return {
      html,
      tags: [
        {
          tag: "script",
          injectTo: "head",
          children: `(() => {
            try {
              const logOverlay = () => {
                const el = document.querySelector('vite-error-overlay');
                if (!el) return;
                const root = (el.shadowRoot || el);
                let text = '';
                try { text = root.textContent || ''; } catch (_) {}
                if (text && text.trim()) {
                  const msg = text.trim();
                  console.error('[Vite Overlay]', msg);
                  try {
                    if (window.parent && window.parent !== window) {
                      window.parent.postMessage({
                        type: 'ERROR_CAPTURED',
                        error: {
                          message: msg,
                          stack: undefined,
                          filename: undefined,
                          lineno: undefined,
                          colno: undefined,
                          source: 'vite.overlay',
                        },
                        timestamp: Date.now(),
                      }, '*');
                    }
                  } catch (_) {}
                }
              };

              const obs = new MutationObserver(() => logOverlay());
              obs.observe(document.documentElement, { childList: true, subtree: true });

              window.addEventListener('DOMContentLoaded', logOverlay);
              logOverlay();
            } catch (e) {
              console.warn('[Vite Overlay logger failed]', e);
            }
          })();`
        }
      ]
    };
  }
});
var vite_config_default = defineConfig({
  server: {
    host: "::",
    port: 3e3,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true
      }
    }
  },
  plugins: [react(), logErrorsPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    outDir: "dist"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxVU0VSXFxcXERlc2t0b3BcXFxccGVyc29uYWxfcHJvamVjdFxcXFxlZHVBc3NpZ25cXFxcZGFyay1sdXhlLXRoZW1lLTJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXFVTRVJcXFxcRGVza3RvcFxcXFxwZXJzb25hbF9wcm9qZWN0XFxcXGVkdUFzc2lnblxcXFxkYXJrLWx1eGUtdGhlbWUtMlxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvVVNFUi9EZXNrdG9wL3BlcnNvbmFsX3Byb2plY3QvZWR1QXNzaWduL2RhcmstbHV4ZS10aGVtZS0yL3ZpdGUuY29uZmlnLnRzXCI7Ly8gdml0ZS5jb25maWcudHNcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3Yyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuLy8gTWluaW1hbCBwbHVnaW4gdG8gbG9nIGJ1aWxkLXRpbWUgYW5kIGRldi10aW1lIGVycm9ycyB0byBjb25zb2xlXG5jb25zdCBsb2dFcnJvcnNQbHVnaW4gPSAoKSA9PiAoe1xuICBuYW1lOiAnbG9nLWVycm9ycy1wbHVnaW4nLFxuICB0cmFuc2Zvcm1JbmRleEh0bWwoaHRtbDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGh0bWwsXG4gICAgICB0YWdzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0YWc6ICdzY3JpcHQnLFxuICAgICAgICAgIGluamVjdFRvOiAnaGVhZCcgYXMgY29uc3QsXG4gICAgICAgICAgY2hpbGRyZW46IGAoKCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgY29uc3QgbG9nT3ZlcmxheSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3ZpdGUtZXJyb3Itb3ZlcmxheScpO1xuICAgICAgICAgICAgICAgIGlmICghZWwpIHJldHVybjtcbiAgICAgICAgICAgICAgICBjb25zdCByb290ID0gKGVsLnNoYWRvd1Jvb3QgfHwgZWwpO1xuICAgICAgICAgICAgICAgIGxldCB0ZXh0ID0gJyc7XG4gICAgICAgICAgICAgICAgdHJ5IHsgdGV4dCA9IHJvb3QudGV4dENvbnRlbnQgfHwgJyc7IH0gY2F0Y2ggKF8pIHt9XG4gICAgICAgICAgICAgICAgaWYgKHRleHQgJiYgdGV4dC50cmltKCkpIHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IG1zZyA9IHRleHQudHJpbSgpO1xuICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignW1ZpdGUgT3ZlcmxheV0nLCBtc2cpO1xuICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5wYXJlbnQgJiYgd2luZG93LnBhcmVudCAhPT0gd2luZG93KSB7XG4gICAgICAgICAgICAgICAgICAgICAgd2luZG93LnBhcmVudC5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnRVJST1JfQ0FQVFVSRUQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogbXNnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFjazogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lbm86IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29sbm86IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiAndml0ZS5vdmVybGF5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgICAgICAgICAgICAgICAgICAgfSwgJyonKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoXykge31cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgY29uc3Qgb2JzID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4gbG9nT3ZlcmxheSgpKTtcbiAgICAgICAgICAgICAgb2JzLm9ic2VydmUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCB7IGNoaWxkTGlzdDogdHJ1ZSwgc3VidHJlZTogdHJ1ZSB9KTtcblxuICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGxvZ092ZXJsYXkpO1xuICAgICAgICAgICAgICBsb2dPdmVybGF5KCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUud2FybignW1ZpdGUgT3ZlcmxheSBsb2dnZXIgZmFpbGVkXScsIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pKCk7YCxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfTtcbiAgfSxcbn0pO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogJzo6JyxcbiAgICBwb3J0OiAzMDAwLFxuICAgIHByb3h5OiB7XG4gICAgICAnL2FwaSc6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDo0MDAwJyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBwbHVnaW5zOiBbcmVhY3QoKSwgbG9nRXJyb3JzUGx1Z2luKCldLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6ICdkaXN0JyxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFIakIsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTSxrQkFBa0IsT0FBTztBQUFBLEVBQzdCLE1BQU07QUFBQSxFQUNOLG1CQUFtQixNQUFjO0FBQy9CLFdBQU87QUFBQSxNQUNMO0FBQUEsTUFDQSxNQUFNO0FBQUEsUUFDSjtBQUFBLFVBQ0UsS0FBSztBQUFBLFVBQ0wsVUFBVTtBQUFBLFVBQ1YsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQXVDWjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGO0FBR0EsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLE1BQ2hCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVMsQ0FBQyxNQUFNLEdBQUcsZ0JBQWdCLENBQUM7QUFBQSxFQUNwQyxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsRUFDVjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
