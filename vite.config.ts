import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({

  plugins: [
    tailwindcss(),
  ],

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        article: resolve(__dirname, 'article.html'),
        dashboard: resolve(__dirname, 'deshboard.html'),
        edit: resolve(__dirname, 'edit.html'),
        user: resolve(__dirname, 'user.html'),
        author:resolve(__dirname, 'author-from.html'),
        authorSection: resolve(__dirname, 'author-section.html'),
        articleSection: resolve(__dirname, 'article-store.html')
      }
    }
  },

  server: {
    watch: {
      ignored: ['**/db.json']
    }
  }

})