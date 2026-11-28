// Build-time Go, shell, Markdown and YAML highlighting with Shiki. Shiki tokenizes; colors come from the theme's
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
    langs: [
      import("shiki/langs/go.mjs"),
      import("shiki/langs/shellscript.mjs"),
      import("shiki/langs/markdown.mjs"),
      import("shiki/langs/yaml.mjs"),
    ],
    engine: createJavaScriptRegexEngine(),
  }));

export type Lang = "go" | "bash" | "markdown" | "yaml";

const SHIKI_LANG: Record<Lang, string> = {
  go: "go",
  bash: "shellscript",
  markdown: "markdown",
  yaml: "yaml",
};

/** TextMate scope (innermost first) -> token class suffix. Order matters. */
const GO_RULES: [RegExp, string][] = [
  [/^comment\./, "com"],
  [/^(string\.|constant\.other\.rune)/, "str"],
  [/^constant\.numeric/, "num"],
  [/^(entity\.name\.function\.support\.builtin|constant\.language)/, "builtin"],
  [/^(storage\.type|entity\.name\.type\.(?!package))|^entity\.name\.type\.go$/, "type"],
  [/^entity\.name\.function/, "fn"],
  [/^keyword\.(?!operator)/, "kw"],
];

/** Shell sessions: the command, its options and quoted text stand out; plain arguments stay plain. */
const BASH_RULES: [RegExp, string][] = [
  [/^comment\./, "com"],
  [/^string\.quoted/, "str"],
  [/^constant\.other\.option/, "type"],
  [/^(entity\.name\.command|support\.function\.builtin)/, "fn"],
  [/^keyword\.operator\.(redirect|pipe)/, "kw"],
];

/** Markdown: headings, code, links, emphasis and list or quote markers stand out from the prose. */
const MD_RULES: [RegExp, string][] = [
  [/^(markup\.heading|entity\.name\.section|punctuation\.definition\.heading)/, "kw"],
  [/^(markup\.inline\.raw|markup\.fenced_code|markup\.raw)/, "str"],
  [/^(markup\.underline\.link|string\.other\.link)/, "fn"],
  [/^(markup\.bold|markup\.italic|markup\.strikethrough)/, "type"],
  [/^(punctuation\.definition\.(list|quote)|meta\.separator)/, "num"],
  [/^markup\.quote/, "com"],
];

/** YAML (CITATION.cff): keys stand out from values; list dashes and comments are muted. */
const YAML_RULES: [RegExp, string][] = [
  [/^comment/, "com"],
  [/^entity\.name\.tag/, "kw"],
  [/^constant\.numeric/, "num"],
  [/^(string|constant\.other|constant\.language)/, "str"],
  [/^punctuation\.definition\.block\.sequence/, "num"],
];

const RULES: Record<Lang, [RegExp, string][]> = {
  go: GO_RULES,
  bash: BASH_RULES,
  markdown: MD_RULES,
  yaml: YAML_RULES,
};

function classFor(scopes: string[], rules: [RegExp, string][]): string | undefined {
  for (let i = scopes.length - 1; i >= 0; i--) {
    for (const [re, cls] of rules) if (re.test(scopes[i]!)) return cls;
  }
  return undefined;
}

/** Highlighted HTML for each line of `code` (no trailing newline handling needed by callers). */
export async function highlightLines(code: string, lang: Lang = "go"): Promise<string[]> {
  const hl = await getHighlighter();
  const src = code.replace(/\n$/, "");
  const lines = hl.codeToTokens(src, {
    lang: SHIKI_LANG[lang],
    theme: "plain",
    includeExplanation: "scopeName",
    // No per-line time limit: with explanations Shiki tokenizes each line twice, and if only one
    // pass hits the limit (a busy build machine) the two token lists disagree and it throws
    // "Cannot read properties of undefined (reading 'startIndex')". Build time has no deadline.
    tokenizeTimeLimit: 0,
  }).tokens;
  const rules = RULES[lang];
  return lines.map((line) => {
    // Merge neighbours with the same class ("fmt" with its quotes becomes one string token).
    const runs: { cls: string | undefined; text: string }[] = [];
    for (const e of line.flatMap((t) => t.explanation ?? [{ content: t.content, scopes: [] }])) {
      const cls = classFor(
        e.scopes.map((s) => s.scopeName),
        rules,
      );
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
 * Lines as `<span class="ln" data-n>` (the gutter number is drawn from `data-n` by the theme CSS).
 * `from`/`to` are 1-based and inclusive; `hl` marks every line as highlighted (step snippets).
 */
export function renderLines(
  html: string[],
  range: { from?: number; to?: number; hl?: boolean } = {},
): string {
  const from = range.from ?? 1;
  const to = range.to ?? html.length;
  let out = "";
  for (let n = from; n <= to; n++) {
    out += `<span class="ln${range.hl ? " hl" : ""}" data-n="${n}">${html[n - 1] || " "}</span>`;
  }
  return out;
}
