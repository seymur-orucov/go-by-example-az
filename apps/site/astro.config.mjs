import { Readable } from "node:stream";
import { defineConfig } from "astro/config";
import { handleRun } from "./src/lib/go-run.ts";

/**
 * Serves POST /api/run in `astro dev` with the handler of the Cloudflare Pages Function
 * (functions/api/run.ts), so "İşə sal" works locally too. `astro preview` has no endpoint.
 * @returns {import("vite").Plugin}
 */
function devRunEndpoint() {
  return {
    name: "dev-api-run",
    enforce: "post",
    configureServer(server) {
      // Astro puts its own middlewares (trailing slash, route guard) in front of the stack in a
      // post hook; ours runs after that and goes in front of them, as /api/run has no slash.
      return () => server.middlewares.stack.unshift({ route: "/api/run", handle: serve });
    },
  };
}

/** Adapts a Node request to the Web-standard handler. */
async function serve(req, res) {
  const url = `http://${req.headers.host ?? "localhost"}${req.originalUrl ?? "/api/run"}`;
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (typeof v === "string") headers.set(k, v);
  }
  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const request = new Request(url, {
    method: req.method,
    headers,
    body: hasBody ? Readable.toWeb(req) : undefined,
    duplex: "half",
  });
  const response = await handleRun(request);
  res.statusCode = response.status;
  response.headers.forEach((v, k) => res.setHeader(k, v));
  res.end(Buffer.from(await response.arrayBuffer()));
}

// Static site, served at https://stackrise.dev (Cloudflare Pages deployment is configured in Phase 4).
export default defineConfig({
  site: "https://stackrise.dev",
  output: "static",
  trailingSlash: "always",
  build: { format: "directory" },
  vite: { plugins: [devRunEndpoint()] },
});
