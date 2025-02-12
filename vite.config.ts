import { defineConfig } from 'vite'
import { resolve } from 'path'
import handlebars from 'vite-plugin-handlebars'

interface IPageData {
  [key: string]: PageInfo
}

interface PageInfo {
  title?: string // Заголовок страницы (необязательный)
  error?: string // Код ошибки (необязательный)
  message?: string // Сообщение об ошибке (необязательное)
}

const pageData: IPageData = {
  '/': {
    title: 'Main Page'
  },
  '/pages/signs/signIn.html': {
    title: 'Sign In'
  },
  '/pages/signs/signUp.html': {
    title: 'Sign Up'
  },
  '/pages/errors/404.html': {
    error: '404',
    message: 'Page Not Found'
  },
  '/pages/errors/5xx.html': {
    error: '500',
    message: 'We are already fixing it'
  }
}

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
      partialDirectory: resolve(__dirname, 'src'),
      context(pagePath: string) {
        return pageData[pagePath]
      }
    })
  ]
})
