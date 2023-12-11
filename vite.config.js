import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        sucess: resolve(__dirname, 'succes.html'),
        register: resolve(__dirname, 'newRegistration.html'),
        oldRegister: resolve(__dirname, 'oldRegistration.html'),


      },
    },
  },
})

