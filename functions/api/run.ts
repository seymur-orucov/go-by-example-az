// Cloudflare Pages Function: POST /api/run → Go Playground. The logic lives in the site so the
// Astro dev server serves the same endpoint (see apps/site/src/lib/go-run.ts).
import { handleRun } from "../../apps/site/src/lib/go-run.ts";

export const onRequest = ({ request }: { request: Request }): Promise<Response> =>
  handleRun(request);
