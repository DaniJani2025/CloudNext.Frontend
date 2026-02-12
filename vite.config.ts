import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import type { ConfigEnv } from "vite";

export default ({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    base: "/", // change if deploying under subpath
    plugins: [react()],
    server: {
      host: true,
      https: {
        key: fs.readFileSync(env.VITE_HTTPS_KEY_PATH),
        cert: fs.readFileSync(env.VITE_HTTPS_CERT_PATH),
      },
    },
    build: {
      outDir: "E:/Projects/CloudNext/CloudNext.Frontend",
      emptyOutDir: true
    },
  });
};
