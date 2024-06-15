import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { readFileSync } from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      cert: readFileSync("../websocket-server/cert.pem"),
      key: readFileSync("../websocket-server/privkey.pem"),
    },
  },
});
