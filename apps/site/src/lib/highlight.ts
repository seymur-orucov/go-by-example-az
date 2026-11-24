// Build-time Go highlighting with Shiki. Shiki tokenizes; colors come from the theme's
// --tok-* CSS variables (so palettes and light/dark keep working), not from a Shiki theme.
import { createHighlighterCore, type HighlighterCore, type ThemeRegistrationRaw } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { escapeHtml } from "@platform/theme/scripts/text";

/** Shiki needs a theme to tokenize; its colors are ignored. */
const PLAIN: ThemeRegistrationRaw = { name: "plain", type: "dark", settings: [] };

let highlighter: Promise<HighlighterCore> | undefined;
const getHighlighter = () =>
  (highlighter ??= createHighlighterCore({
    themes: [PLAIN],
    langs: [import("shiki/langs/go.mjs")],
    engine: createJavaScriptRegexEngine(),
  }));

/** TextMate scope (innermost first) -> token class suffix. Order matters. */
const RULES: [RegExp, string][] = [
  [/^comment\./, "com"],
  [/^(string\.|constant\.other\.rune)/, "str"],
  [/^constant\.numeric/, "num"],
  [/^(entity\.name\.function\.support\.builtin|constant\.language)/, "builtin"],
  [/^(storage\.type|entity\.name\.type\.(?!package))|^entity\.name\.type\.go$/, "type"],
  [/^entity\.name\.function/, "fn"],
  [/^keyword\.(?!operator)/, "kw"],
];

function classFor(scopes: string[]): string | undefined {
  for (let i = scopes.length - 1; i >= 0; i--) {
    for (const [re, cls] of RULES) if (re.test(scopes[i]!)) return cls;
  }
  return undefined;
}

/** Highlighted HTML for each line of `code` (no trailing newline handling needed by callers). */
export async function highlightLines(code: string): Promise<string[]> {
  const hl = await getHighlighter();
  const src = code.replace(/\n$/, "");
  const lines = hl.codeToTokens(src, {
    lang: "go",
    theme: "plain",
    includeExplanation: "scopeName",
  }).tokens;
  return lines.map((line) => {
    // Merge neighbours with the same class ("fmt" with its quotes becomes one string token).
    const runs: { cls: string | undefined; text: string }[] = [];
    for (const e of line.flatMap((t) => t.explanation ?? [{ content: t.content, scopes: [] }])) {
      const cls = classFor(e.scopes.map((s) => s.scopeName));
      const last = runs.at(-1);
      if (last && last.cls === cls) last.text += e.content;
      else runs.push({ cls, text: e.content });
    }
    return runs
      .map(({ cls, text }) =>
        cls ? `<span class="tok-${cls}">${escapeHtml(text)}</span>` : escapeHtml(text),
      )
      .join("");
  });
}

/**
 * Lines as `<span class="line" data-n>` with a gutter number, the markup the lesson
 * script and the theme CSS expect. `from`/`to` are 1-based and inclusive.
 */
export function renderLines(html: string[], range: { from?: number; to?: number } = {}): string {
  const from = range.from ?? 1;
  const to = range.to ?? html.length;
  let out = "";
  for (let n = from; n <= to; n++) {
    out += `<span class="line" data-n="${n}"><span class="ln">${n}</span>${html[n - 1] || " "}</span>`;
  }
  return out;
}

/** Convenience: highlight and render a whole snippet (quiz code). */
export async function highlightGo(code: string): Promise<string> {
  return renderLines(await highlightLines(code));
}
