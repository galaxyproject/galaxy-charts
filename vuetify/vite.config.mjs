// Plugins
import Components from 'unplugin-vue-components/vite'
import Vue from '@vitejs/plugin-vue'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import ViteFonts from 'unplugin-fonts/vite'
import VueRouter from 'unplugin-vue-router/vite'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// Custom plugin to inline CSS
const inlineCSSPlugin = () => {
    return {
        name: 'inline-css',
        enforce: 'post',
        apply: 'build',
        generateBundle(_, bundle) {
            for (const file in bundle) {
                if (bundle[file].type === 'asset' && bundle[file].fileName.endsWith('.css')) {
                    const css = bundle[file].source;
                    delete bundle[file];
                    for (const jsFile in bundle) {
                        if (bundle[jsFile].type === 'chunk') {
                            const js = bundle[jsFile].code;
                            bundle[jsFile].code = `${js}\n(function() { const style = document.createElement('style'); style.innerHTML = ${JSON.stringify(css)}; document.head.appendChild(style); })();`;
                        }
                    }
                }
            }
        },
    };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    //inlineCSSPlugin(),
    VueRouter(),
    Vue({
      template: { transformAssetUrls }
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    }),
    Components(),
    ViteFonts({
      google: {
        families: [{
          name: 'Roboto',
          styles: 'wght@100;300;400;500;700;900',
        }],
      },
    }),
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: () => 'app.js',
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]',
      }
    }
  }
})
