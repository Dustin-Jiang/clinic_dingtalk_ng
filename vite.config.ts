import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    Components({
      resolvers: [NaiveUiResolver()]
    }),
    visualizer()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5174,
    proxy: {
      '/proxy': {
        target: 'https://clinic-bitnp.info.bit.edu.cn',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.setHeader("origin", "https://clinic-bitnp.info.bit.edu.cn")
          })
        }
      },
      '/user': {
        target: 'https://clinic-bitnp.info.bit.edu.cn',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.setHeader("origin", "https://clinic-bitnp.info.bit.edu.cn")
          })
        }
      },
      // '/proxy': {
      //   target: 'http://127.0.0.1:25000',
      //   changeOrigin: true,
      //   configure: (proxy) => {
      //     proxy.on("proxyReq", (proxyReq) => {
      //       proxyReq.setHeader("origin", "http://127.0.0.1:25000")
      //     })
      //   }
      // },
      // '/user': {
      //   target: 'http://127.0.0.1:25000',
      //   changeOrigin: true,
      //   configure: (proxy) => {
      //     proxy.on("proxyReq", (proxyReq) => {
      //       proxyReq.setHeader("origin", "http://127.0.0.1:25000")
      //     })
      //   }
      // }
    }
  }
})
