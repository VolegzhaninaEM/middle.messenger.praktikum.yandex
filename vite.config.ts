import { defineConfig } from 'vite'
import { resolve } from 'path'
import handlebars from 'vite-plugin-handlebars'

export default defineConfig({
  assetsInclude: ['**/*.hbs'],
  root: resolve(__dirname, 'src'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    assetsDir: 'partials',
    emptyOutDir: true
  },
  preview: { port: 3000 },
  server: {
    port: 3000
  },
  publicDir: resolve(__dirname, 'static'),
  css: {
    preprocessorOptions: {
      less: {
        math: 'always',
        paths: ['src/pages']
      }
    }
  },
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, 'src')
    })
  ]
})
