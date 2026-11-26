// The code editor of the lesson page (CodeMirror 6). Loaded with a dynamic import only when
// "Redaktə" is clicked, so lesson pages stay light. Colors come from the theme's --tok-* and
// surface variables, so palettes and the light/dark themes keep working.
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { go } from "@codemirror/lang-go";
import {
  bracketMatching,
  HighlightStyle,
  indentOnInput,
  indentUnit,
  syntaxHighlighting,
} from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import {
  drawSelection,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
} from "@codemirror/view";
import { tags as t } from "@lezer/highlight";

const style = HighlightStyle.define([
  {
    tag: [t.keyword, t.controlKeyword, t.definitionKeyword, t.moduleKeyword],
    color: "var(--tok-kw)",
  },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: "var(--tok-fn)" },
  { tag: [t.string, t.special(t.string), t.character], color: "var(--tok-str)" },
  { tag: [t.number, t.bool, t.null], color: "var(--tok-num)" },
  { tag: [t.typeName, t.definition(t.typeName)], color: "var(--tok-type)" },
  { tag: [t.standard(t.variableName), t.standard(t.typeName)], color: "var(--tok-builtin)" },
  { tag: [t.comment, t.lineComment, t.blockComment], color: "var(--tok-com)", fontStyle: "italic" },
]);

const theme = EditorView.theme({
  "&": { color: "var(--code-text)", backgroundColor: "transparent", height: "100%" },
  "&.cm-focused": { outline: "none" },
  ".cm-scroller": {
    fontFamily: "var(--font-mono)",
    fontSize: "inherit",
    lineHeight: "inherit",
    fontVariantLigatures: "none",
  },
  ".cm-content": { caretColor: "var(--accent)", padding: "12px 0" },
  ".cm-cursor": { borderLeftColor: "var(--accent)" },
  ".cm-gutters": { backgroundColor: "transparent", color: "var(--text-subtle)", border: "none" },
  ".cm-activeLine": { backgroundColor: "color-mix(in srgb, var(--accent) 7%, transparent)" },
  ".cm-activeLineGutter": { backgroundColor: "transparent", color: "var(--text-muted)" },
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection": {
    backgroundColor: "color-mix(in srgb, var(--accent) 28%, transparent) !important",
  },
  ".cm-matchingBracket": { backgroundColor: "color-mix(in srgb, var(--cyan) 22%, transparent)" },
});

export interface CodeEditor {
  getCode(): string;
  setCode(code: string): void;
  focus(): void;
  destroy(): void;
}

/** Mounts an editor in `parent`; `onChange` fires after every edit. */
export function createEditor(parent: HTMLElement, code: string, onChange: () => void): CodeEditor {
  const view = new EditorView({
    parent,
    state: EditorState.create({
      doc: code,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightActiveLine(),
        history(),
        drawSelection(),
        indentOnInput(),
        bracketMatching(),
        EditorState.tabSize.of(4),
        indentUnit.of("\t"),
        go(),
        syntaxHighlighting(style),
        theme,
        // Tab indents inside the editor; Esc then Tab leaves it (CodeMirror's escape hatch).
        keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
        EditorView.updateListener.of((u) => {
          if (u.docChanged) onChange();
        }),
        EditorView.contentAttributes.of({ "aria-label": "Go kodu redaktoru" }),
      ],
    }),
  });
  return {
    getCode: () => view.state.doc.toString(),
    setCode: (next) =>
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: next } }),
    focus: () => view.focus(),
    destroy: () => view.destroy(),
  };
}
