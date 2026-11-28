// Markdown for lesson text and quiz strings. Content is our own (reviewed in PRs), not user input.
// A blockquote becomes a note box: `> **Diqqət:** ...` (amber) or `> **Bilgi:** ...` (accent).
// Raw HTML is shown as text: Go output such as `4 <nil>` must not turn into an invisible tag.
import { Marked, type Tokens } from "marked";

const escapeHtml = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const md = new Marked({
  gfm: true,
  renderer: {
    html({ text }: Tokens.HTML | Tokens.Tag) {
      return escapeHtml(text);
    },
    blockquote({ tokens }: Tokens.Blockquote) {
      const inner = this.parser.parse(tokens);
      const info = /^<p><strong>Bilgi\b/.test(inner.trim());
      return `<div class="note${info ? " info" : ""}">${inner}</div>\n`;
    },
  },
});

/** Block Markdown (paragraphs, lists, notes) to HTML. */
export const renderMarkdown = (src: string): string => md.parse(src, { async: false });

/** Inline Markdown (code spans, emphasis) without a wrapping <p>. */
export const renderInline = (src: string): string => md.parseInline(src, { async: false });

// ---- Preview of a lesson's Markdown file (code lessons about Markdown): what GitHub would show.
// GitHub Flavored Markdown (tables, task lists, strikethrough), GitHub alerts (`> [!NOTE]`), links
// that open in a new tab, and images as a labelled placeholder (the lesson has no image files).
// Raw HTML stays text, as in the lesson text.
const ALERTS: Record<string, string> = {
  NOTE: "Note",
  TIP: "Tip",
  IMPORTANT: "Important",
  WARNING: "Warning",
  CAUTION: "Caution",
};
const preview = new Marked({
  gfm: true,
  renderer: {
    html({ text }: Tokens.HTML | Tokens.Tag) {
      return escapeHtml(text);
    },
    blockquote({ tokens }: Tokens.Blockquote) {
      const inner = this.parser.parse(tokens);
      const m = /^<p>\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/.exec(inner);
      if (!m) return `<blockquote>${inner}</blockquote>\n`;
      const kind = m[1]!;
      const rest = inner.slice(m[0].length).replace(/^<\/p>\s*/, "");
      const body = rest.startsWith("<") ? rest : `<p>${rest}`;
      return `<div class="md-alert a-${kind.toLowerCase()}"><p class="md-alert-title">${ALERTS[kind]}</p>${body}</div>\n`;
    },
    image({ text }: Tokens.Image) {
      return `<span class="md-img" role="img" aria-label="${escapeHtml(text)}">${escapeHtml(text || "image")}</span>`;
    },
    link({ href, title, tokens }: Tokens.Link) {
      const t = title ? ` title="${escapeHtml(title)}"` : "";
      return `<a href="${escapeHtml(href)}"${t} target="_blank" rel="noopener nofollow">${this.parser.parseInline(tokens)}</a>`;
    },
  },
});

/** Markdown rendered the way GitHub shows a `.md` file (see above). */
export const renderPreview = (src: string): string => preview.parse(src, { async: false });
