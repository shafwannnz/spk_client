import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // paksa Vite menggunakan port 5173 dan strictPort=true agar
    // proses gagal jika port sudah dipakai (lebih deterministik)
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000", // arahkan ke backend kamu
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
