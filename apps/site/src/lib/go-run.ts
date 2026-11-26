// The `/api/run` endpoint: runs a Go program on the Go Playground (`go.dev/_/compile`), which
// sends no CORS header, so the browser cannot call it directly. The same handler serves the
// Cloudflare Pages Function (`functions/api/run.ts`) and the Astro dev server (astro.config.mjs).
// Web-standard Request/Response only, so it runs on Workers and on Node.

export const COMPILE_URL = "https://go.dev/_/compile";
/** Largest program accepted, in bytes (the longest lesson is under 4 KB). */
export const MAX_CODE_BYTES = 64 * 1024;
/** Runs allowed per client per minute (best effort: counted per server instance). */
export const RUNS_PER_MINUTE = 20;
const UPSTREAM_TIMEOUT_MS = 20_000;

export interface RunEvent {
  kind: "stdout" | "stderr";
  text: string;
}
/** What `/api/run` answers with on 200. */
export interface RunResult {
  /** Compile errors; when set, the program did not run. */
  errors: string;
  /** `go vet` findings; the program still ran. */
  vet: string;
  events: RunEvent[];
}
interface CompileResponse {
  Errors?: string;
  VetErrors?: string;
  Events?: { Message?: string; Kind?: string }[] | null;
}

const json = (body: unknown, status = 200, headers: Record<string, string> = {}): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...headers,
    },
  });
const fail = (status: number, error: string, headers?: Record<string, string>): Response =>
  json({ error }, status, headers);

const hits = new Map<string, number[]>();
/** Sliding one-minute window; returns the seconds to wait, or 0 when the run is allowed. */
function rateLimit(client: string, now = Date.now()): number {
  const recent = (hits.get(client) ?? []).filter((t) => now - t < 60_000);
  if (recent.length >= RUNS_PER_MINUTE) {
    hits.set(client, recent);
    return Math.ceil((60_000 - (now - recent[0]!)) / 1000);
  }
  recent.push(now);
  hits.set(client, recent);
  if (hits.size > 5000) hits.clear(); // keep memory bounded on a long-lived instance
  return 0;
}

/** Turns the Playground's answer into ours: adjacent events of one kind are merged. */
export function toResult(r: CompileResponse): RunResult {
  const events: RunEvent[] = [];
  for (const e of r.Events ?? []) {
    const kind = e.Kind === "stderr" ? "stderr" : "stdout";
    const text = e.Message ?? "";
    const last = events.at(-1);
    if (last?.kind === kind) last.text += text;
    else if (text) events.push({ kind, text });
  }
  return { errors: r.Errors ?? "", vet: r.VetErrors ?? "", events };
}

export async function handleRun(
  request: Request,
  fetchImpl: typeof fetch = fetch,
): Promise<Response> {
  if (request.method !== "POST") return fail(405, "POST gözlənilir", { allow: "POST" });

  // Only pages of this site may call the endpoint (browsers always send Origin on a POST).
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return fail(403, "İcazə yoxdur");

  const client =
    request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for") ?? "local";
  const wait = rateLimit(client);
  if (wait)
    return fail(429, `Çox tez-tez işə salınır, ${wait} saniyə sonra yenidən cəhd edin`, {
      "retry-after": String(wait),
    });

  let code: unknown;
  try {
    ({ code } = (await request.json()) as { code?: unknown });
  } catch {
    return fail(400, "Sorğu JSON deyil");
  }
  if (typeof code !== "string" || !code.trim()) return fail(400, "Kod boşdur");
  if (new TextEncoder().encode(code).length > MAX_CODE_BYTES) return fail(413, "Kod çox böyükdür");

  let upstream: Response;
  try {
    upstream = await fetchImpl(COMPILE_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ version: "2", body: code, withVet: "true" }),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
  } catch {
    return fail(502, "Go Playground cavab vermədi");
  }
  if (!upstream.ok) return fail(502, `Go Playground xətası (${upstream.status})`);
  try {
    return json(toResult((await upstream.json()) as CompileResponse));
  } catch {
    return fail(502, "Go Playground-un cavabı oxunmadı");
  }
}
