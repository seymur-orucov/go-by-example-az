// Terminal-session lessons (Git and other CLI tools): the lesson's "code" is `session.sh`, a list
// of shell commands with step markers; `pnpm content:run` runs it in a sandbox and records the
// output and, after every step, the state of the repository (`session.json`, generated).
// Format: docs/DECISIONS.md, "Content pipeline"; authoring rules: the write-content skill.
import { z } from "astro/zod";

const ID = /^[a-z0-9][a-z0-9-]*$/;

/** `#@step <id>` starts a step, `#@end` closes it, `#@hide` hides the next command (it still runs). */
const STEP = /^#@step\s+(\S+)\s*$/;
const END = /^#@end\s*$/;
const HIDE = /^#@hide\s*$/;
/** A command that is expected to fail ends with `#@fail`; the marker is not shown. */
const FAIL = /\s+#@fail\s*$/;

export interface SessionCommand {
  cmd: string;
  step: string | null;
  hidden: boolean;
  /** The command is shown failing on purpose (a non-zero exit code is expected). */
  fail: boolean;
}

export interface SessionStep {
  id: string;
  /** 1-based, inclusive, in the displayed script. */
  from: number;
  to: number;
}

/** Parses `session.sh`: the displayed script (markers and hidden commands removed), step ranges and commands. */
export function parseSession(src: string): {
  code: string;
  steps: SessionStep[];
  commands: SessionCommand[];
} {
  const lines: string[] = [];
  const steps: SessionStep[] = [];
  const commands: SessionCommand[] = [];
  let open: SessionStep | null = null;
  let hideNext = false;
  const close = () => {
    if (!open) return;
    open.to = lines.length;
    while (open.to > open.from && lines[open.to - 1]!.trim() === "") open.to--;
    if (open.to < open.from) throw new Error(`step "${open.id}" has no commands`);
    steps.push(open);
    open = null;
  };
  for (const raw of src.replace(/\r\n/g, "\n").replace(/\n+$/, "").split("\n")) {
    const line = raw.trimEnd();
    const step = STEP.exec(line);
    if (step) {
      if (!ID.test(step[1]!)) throw new Error(`invalid step id "${step[1]}"`);
      close();
      open = { id: step[1]!, from: lines.length + 1, to: 0 };
      continue;
    }
    if (END.test(line)) {
      close();
      continue;
    }
    if (HIDE.test(line)) {
      hideNext = true;
      continue;
    }
    const isCommand = line.trim() !== "" && !line.trimStart().startsWith("#");
    if (isCommand) {
      const fail = FAIL.test(line);
      const cmd = line.replace(FAIL, "").trim();
      commands.push({ cmd, step: open?.id ?? null, hidden: hideNext, fail });
      if (hideNext) {
        hideNext = false;
        continue;
      }
      lines.push(line.replace(FAIL, ""));
    } else {
      if (hideNext && line.trim() !== "") throw new Error(`#@hide must be followed by a command`);
      // Blank lines left at the top by hidden setup commands are not shown.
      if (line.trim() === "" && lines.length === 0) continue;
      lines.push(line);
    }
  }
  close();
  const ids = steps.map((s) => s.id);
  const dup = ids.find((id, i) => ids.indexOf(id) !== i);
  if (dup) throw new Error(`duplicate step id "${dup}"`);
  return { code: lines.join("\n") + "\n", steps, commands };
}

// ---- The three areas of a Git repository, recorded after each step -------------------------

const workFile = z
  .object({
    name: z.string(),
    state: z.enum(["clean", "untracked", "modified", "deleted", "ignored"]),
  })
  .strict();
const indexFile = z
  .object({ name: z.string(), state: z.enum(["clean", "added", "modified", "deleted"]) })
  .strict();

export const areasFrameSchema = z
  .object({
    work: z.array(workFile),
    index: z.array(indexFile),
    repo: z
      .object({
        commit: z.object({ hash: z.string(), message: z.string() }).strict().nullable(),
        count: z.number().int().nonnegative(),
        files: z.array(z.string()),
      })
      .strict(),
  })
  .strict();
export type AreasFrame = z.infer<typeof areasFrameSchema>;

export const sessionFileSchema = z
  .object({
    generatedBy: z.string(),
    git: z.string(),
    commands: z.array(
      z
        .object({
          cmd: z.string(),
          step: z.string().nullable(),
          hidden: z.boolean(),
          fail: z.boolean(),
          out: z.string(),
          exit: z.number().int(),
        })
        .strict(),
    ),
    /** Per step id: the repository state after the step, or null outside a repository. */
    frames: z.record(z.string(), z.object({ areas: areasFrameSchema.nullable() }).strict()),
  })
  .strict();
export type SessionFile = z.infer<typeof sessionFileSchema>;

/** The transcript of some recorded commands, as shown in the terminal pane: `$ cmd` and its output. */
export function transcript(commands: { cmd: string; hidden: boolean; out: string }[]): string {
  return commands
    .filter((c) => !c.hidden)
    .flatMap((c) => [`$ ${c.cmd}`, ...(c.out === "" ? [] : [c.out.replace(/\n$/, "")])])
    .join("\n");
}
