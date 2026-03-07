import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import type { ConfigEnv } from "vite";

export default ({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd());

  const https =
    env.VITE_USE_HTTPS === "true"
      ? {
          key: fs.readFileSync(env.VITE_HTTPS_KEY_PATH),
          cert: fs.readFileSync(env.VITE_HTTPS_CERT_PATH)
        }
      : undefined;

  return defineConfig({
    plugins: [react()],
    server: {
      host: mode === "lan" ? true : "localhost",
      https
    }
  });
};
