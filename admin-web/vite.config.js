import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // Đây là chìa khóa để hết lỗi

export default defineConfig({
  plugins: [
    tailwindcss(), // Phải đặt cái này lên trên
    react(),
  ],
});
