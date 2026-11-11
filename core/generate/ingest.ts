import { LIMITS, type Material } from "./types";

export type MaterialCheck =
  | { ok: true }
  | { ok: false; code: "empty" | "too-many-files" | "too-many-pages" | "too-long" | "scanned"; message: string };

const MIN_CHARACTERS_PER_PAGE = 40;

export function checkMaterials(materials: Material[]): MaterialCheck {
  const pages = materials.flatMap((material) => material.pages);
  const characters = pages.reduce((total, page) => total + page.text.length, 0);
  if (materials.length === 0 || pages.length === 0 || characters === 0) {
    return { ok: false, code: "empty", message: "Add at least one file with readable text." };
  }
  if (materials.length > LIMITS.files) {
    return { ok: false, code: "too-many-files", message: `Use at most ${LIMITS.files} files.` };
  }
  if (pages.length > LIMITS.pages) {
    return { ok: false, code: "too-many-pages", message: `Use at most ${LIMITS.pages} pages in total (you have ${pages.length}).` };
  }
  if (characters > LIMITS.characters) {
    return {
      ok: false,
      code: "too-long",
      message: `The text is too long: ${characters.toLocaleString("en")} characters, at most ${LIMITS.characters.toLocaleString("en")}.`,
    };
  }
  if (characters / pages.length < MIN_CHARACTERS_PER_PAGE) {
    return { ok: false, code: "scanned", message: "This material looks scanned — it has almost no readable text." };
  }
  return { ok: true };
}

export interface PageRange {
  file: string;
  from: number;
  to: number;
}

/** "=== slides.pdf — page 3 ===\n<text>" blocks; with ranges, only those pages. */
export function renderMaterials(materials: Material[], ranges?: PageRange[]): string {
  const included = (file: string, n: number) =>
    !ranges || ranges.some((range) => range.file === file && n >= range.from && n <= range.to);
  return materials
    .flatMap((material) =>
      material.pages
        .filter((page) => included(material.name, page.n))
        .map((page) => `=== ${material.name} — page ${page.n} ===\n${page.text.trim()}`),
    )
    .join("\n\n");
}
