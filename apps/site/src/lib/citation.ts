// Preview of a lesson's CITATION.cff: the "Cite this repository" box GitHub shows next to a
// repository that has one. GitHub turns the file into APA and BibTeX with the ruby-cff gem; this is a
// port of its formatters (lib/cff/formatters/{formatter,apalike,bibtex}.rb) for the root keys a
// lesson uses: authors (persons and entities), title, version, date-released, doi, repository-code,
// url, license and `type` (software / dataset). `preferred-citation` (ruby-cff cites that reference
// instead) is not ported and is refused. The APA output matches the example in GitHub Docs ("About
// CITATION files"); BibTeX writes the month as a macro (`month = dec`) like current ruby-cff.
import { parse as parseYaml } from "yaml";

interface Author {
  "family-names"?: string;
  "given-names"?: string;
  "name-particle"?: string;
  "name-suffix"?: string;
  alias?: string;
  name?: string;
}

interface Model {
  message?: string;
  title?: string;
  authors?: Author[];
  version?: string | number;
  "date-released"?: string | Date;
  doi?: string;
  "repository-code"?: string;
  url?: string;
  license?: string | string[];
  type?: string;
  "preferred-citation"?: unknown;
}

const escapeHtml = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const str = (v: unknown): string => (v == null ? "" : String(v));
const isEntity = (a: Author): boolean => a.name != null;

const MONTHS = [
  "",
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

function monthAndYear(m: Model): [string, string] {
  const d = m["date-released"];
  if (d instanceof Date) return [String(d.getUTCMonth() + 1), String(d.getUTCFullYear())];
  const r = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str(d));
  return r ? [String(Number(r[2])), r[1]!] : ["", ""];
}

const initialOf = (part: string): string =>
  part.includes("-")
    ? part
        .split("-")
        .filter(Boolean)
        .map((s) => s[0]!.toUpperCase())
        .join(".-")
    : part[0]!.toUpperCase();
const initials = (names: string): string =>
  names.split(/\s+/).filter(Boolean).map(initialOf).join(". ");

// ---- APA (apalike.rb)
function apaAuthor(a: Author): string {
  if (isEntity(a)) return str(a.name);
  const fam = str(a["family-names"]);
  const giv = str(a["given-names"]);
  const name = !fam ? giv || str(a.alias) : !giv ? fam : `${fam}, ${initials(giv)}.`;
  const particle = a["name-particle"] ? `${a["name-particle"]} ` : "";
  const suffix = a["name-suffix"] ? `, ${a["name-suffix"]}` : "";
  return `${particle}${name}${suffix}`;
}

const chompDot = (s: string): string => (s.endsWith(".") ? s.slice(0, -1) : s);

function apa(m: Model): string {
  const authors = m.authors!.map(apaAuthor);
  const combined =
    authors.length === 1
      ? chompDot(authors[0]!)
      : chompDot(`${authors.slice(0, -1).join(", ")}, & ${authors[authors.length - 1]}`);
  const year = monthAndYear(m)[1];
  const version = str(m.version) ? ` (Version ${m.version})` : "";
  const type = str(m.type);
  const label = type.includes("data") ? " [Data set]" : " [Computer software]";
  const url = m.doi ? `https://doi.org/${m.doi}` : str(m["repository-code"]) || str(m.url);
  return [combined, year ? `(${year})` : "", `${m.title}${version}${label}`, url]
    .filter(Boolean)
    .join(". ");
}

// ---- BibTeX (bibtex.rb)
const latex = (s: string): string => s.replace(/([&%$#_{}])/g, "\\$1");

function bibAuthor(a: Author): string {
  if (isEntity(a)) return `{${latex(str(a.name))}}`;
  const fam = str(a["family-names"]);
  const giv = str(a["given-names"]);
  if (!fam && !giv) return latex(str(a.alias));
  const particle = a["name-particle"] ? `${a["name-particle"]} ` : "";
  return [`${particle}${fam}`, str(a["name-suffix"]), giv].filter(Boolean).join(", ");
}

/** ruby-cff Util.parameterize: ASCII letters, digits, `-` and `_`; other runs become one `_`. */
const parameterize = (s: string): string =>
  s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9\-_]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");

function bibtex(m: Model): string {
  const type = str(m.type);
  const entry = !type || type.includes("software") ? "software" : "misc";
  const values: Record<string, string> = {
    author: m.authors!.map(bibAuthor).join(" and "),
    title: `{${latex(str(m.title))}}`,
    doi: latex(str(m.doi)),
  };
  if (entry === "software") {
    values.license = latex(Array.isArray(m.license) ? m.license.join(", ") : str(m.license));
    values.version = latex(str(m.version));
  }
  const [month, year] = monthAndYear(m);
  if (month) values.month = MONTHS[Number(month)]!;
  values.year = year;
  values.url = str(m["repository-code"]) || str(m.url);
  const key = parameterize(
    [values.author!.split(",", 1)[0], ...values.title!.split(/\s+/).slice(0, 3), year]
      .filter(Boolean)
      .join("_"),
  );
  const fields = Object.entries(values)
    .filter(([, v]) => v !== "")
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${k} = ${k === "month" ? v : `{${v}}`}`);
  return `@${entry}{${[key, ...fields].join(",\n")}\n}`;
}

/** The citation GitHub would offer for a CFF document, or null when it has no title or authors. */
export function formatCitation(src: string): { apa: string; bibtex: string } | null {
  let root: Model;
  try {
    root = (parseYaml(src) ?? {}) as Model;
  } catch {
    return null;
  }
  if (!root || typeof root !== "object") return null;
  // ruby-cff would cite the preferred-citation reference instead (articles, books, ...): not ported.
  if (root["preferred-citation"])
    throw new Error("preferred-citation is not supported by the preview");
  const m = root;
  if (!Array.isArray(m.authors) || !m.authors.length || !str(m.title)) return null;
  return { apa: apa(m), bibtex: bibtex(m) };
}

/** HTML of the "Cite this repository" box (or a note saying what is still missing). */
export function renderCitation(src: string): string {
  const c = formatCitation(src);
  if (!c) {
    return `<p class="cite-missing">GitHub sitat göstərmir: faylda <code>title</code> və <code>authors</code> olmalıdır.</p>`;
  }
  return (
    `<div class="cite-box"><p class="cite-title">Cite this repository</p>` +
    `<p class="cite-label">APA</p><pre class="cite-out">${escapeHtml(c.apa)}</pre>` +
    `<p class="cite-label">BibTeX</p><pre class="cite-out">${escapeHtml(c.bibtex)}</pre></div>`
  );
}
