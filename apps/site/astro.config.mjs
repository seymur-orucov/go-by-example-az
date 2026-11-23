import { defineConfig } from "astro/config";

// Static site. Cloudflare Pages deployment is configured in Phase 4; `site` is set then.
export default defineConfig({
  output: "static",
  trailingSlash: "always",
  build: { format: "directory" },
});
