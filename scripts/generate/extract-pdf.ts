import fs from "node:fs";
import path from "node:path";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { joinTextItems, splitTextIntoPages } from "../../core/generate/ingest";
import type { Material } from "../../core/generate/types";

export async function extractPdf(file: string): Promise<Material> {
  const data = new Uint8Array(fs.readFileSync(file));
  const document = await getDocument({ data, disableFontFace: true, useSystemFonts: false, verbosity: 0 }).promise;
  const pages = [];
  try {
    for (let n = 1; n <= document.numPages; n += 1) {
      const page = await document.getPage(n);
      const content = await page.getTextContent();
      pages.push({ n, text: joinTextItems(content.items) });
      page.cleanup();
    }
  } finally {
    await document.destroy();
  }
  return { name: path.basename(file), pages };
}

/** Every .pdf, .txt and .md file in a folder, sorted by name. */
export async function readMaterials(folder: string): Promise<Material[]> {
  const files = fs
    .readdirSync(folder, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(pdf|txt|md)$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort();
  const materials: Material[] = [];
  for (const name of files) {
    const full = path.join(folder, name);
    materials.push(/\.pdf$/i.test(name) ? await extractPdf(full) : { name, pages: splitTextIntoPages(fs.readFileSync(full, "utf8")) });
  }
  return materials;
}
