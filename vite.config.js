import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    // Set the base path for GitHub Pages: replace with '/' if deploying to a user/organization site
    base: '/FE_Basics_Project/',
    server: {
        port: 62402,
    },
})