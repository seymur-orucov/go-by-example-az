// Markdown for lesson text and quiz strings. Content is our own (reviewed in PRs), not user input.
// A blockquote becomes a note box: `> **Diqqət:** ...` (amber) or `> **Bilgi:** ...` (accent).
import { Marked, type Tokens } from "marked";

const md = new Marked({
  gfm: true,
  renderer: {
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
