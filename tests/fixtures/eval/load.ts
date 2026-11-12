import fs from "node:fs";
import path from "node:path";
import type { Material } from "../../../core/generate/types";

/** One evaluation fixture as uploaded material: pages are separated by a line "---page---". */
export function loadEval(name: string): Material {
  const text = fs.readFileSync(path.join(__dirname, name), "utf8");
  const pages = text.split(/^---page---$/m).map((page, index) => ({ n: index + 1, text: page.trim() }));
  return { name, pages };
}
