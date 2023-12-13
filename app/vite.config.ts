import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api": {
                changeOrigin: true,
                target: "http://localhost:8080"
            }
        },
        port: 8081
    },
    build: {
        target: "esnext"
    }
})
