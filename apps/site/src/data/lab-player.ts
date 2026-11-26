// Shared types of the visual lesson pilots (/lab/...). A frame is one step of the stage player:
// text for the narration panel plus whatever the page's visual needs. Kept as plain data so the
// format can later move to YAML (DECISIONS.md: animations are declarative data).

export interface Ask {
  /** Prediction question shown before the frame is revealed (HTML). */
  q: string;
  options: string[];
  answer: number;
  explain: string;
}

export interface FrameText {
  chapter: number;
  title: string;
  /** Narration (trusted HTML written in this repo). */
  body: string;
  cmd?: string;
  out?: string;
  ask?: Ask;
}

/** Summary card; inline markdown, rendered by the shared Takeaways component. */
export interface Takeaways {
  rules: string[];
  practices: string[];
}
