import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
        },
    },
    plugins: [react()],
    base: '/',
    publicDir: 'public',
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                },
            },
            external: '/envConfig.js',
        },
    },
    optimizeDeps: {
        include: ['react/jsx-runtime'],
    },
});
