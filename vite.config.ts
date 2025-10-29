import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    // Pre-bundle these heavy editor deps so Vite doesn't time out optimizing them in dev
    optimizeDeps: {
        include: ["react-simplemde-editor", "easymde", "codemirror"],
    },
});
