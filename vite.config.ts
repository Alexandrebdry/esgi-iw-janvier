import { defineConfig } from "vite";

export default defineConfig({
    root: "src/client",
    server: {
        port: 3000,
        proxy: {
            "/api": "http://localhost:4000"
        },
        watch: {
            // Regarde les fichiers même sur certains systèmes de fichiers réseau
            usePolling: true,
        },
        hmr: {
            // Force la reconnexion automatique du client HMR
            protocol: "ws",
            host: "localhost",
            port: 3000,
            overlay: true, // Affiche une superposition d’erreurs dans le navigateur
        }
    }
});