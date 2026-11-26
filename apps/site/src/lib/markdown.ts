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
