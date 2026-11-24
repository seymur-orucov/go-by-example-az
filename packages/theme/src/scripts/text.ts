// Search that ignores Azerbaijani letters: "dovr" matches "Dövr".
export function normalize(s: string): string {
  return s
    .toLocaleLowerCase("az")
    .replace(/ə/g, "e")
    .replace(/ı/g, "i")
    .replace(/i̇/g, "i")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u");
}

const ENTITIES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
export const escapeHtml = (s: string): string => s.replace(/[&<>"]/g, (c) => ENTITIES[c]!);
