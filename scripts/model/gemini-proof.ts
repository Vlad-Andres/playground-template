import fs from "node:fs";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";
import { lectureFileSchema } from "../../src/content/schema";

const pdfPath =
  process.argv[2] ?? "materials/Lecture_01-Introduction-2026-2.pdf";
const outputPath = process.argv[3] ?? path.resolve(".model-output/gemini-lecture.json");
const model = process.env.GEMINI_MODEL ?? "gemini-3.8-flash";
const maxPdfBytes = Number(process.env.GEMINI_MAX_PDF_BYTES ?? 25 * 1024 * 1024);
const maxOutputBytes = Number(process.env.GEMINI_MAX_OUTPUT_BYTES ?? 250 * 1024);
type UploadedFile = { name?: string; uri?: string; mimeType?: string };

function loadApiKey(): string {
  const direct = process.env.GEMINI_API_KEY;
  if (direct) return direct;
  const envPath = path.resolve(".env.local");
  if (!fs.existsSync(envPath)) throw new Error("GEMINI_API_KEY is not set and .env.local is missing.");
  const line = fs
    .readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .find((entry) => entry.trim().startsWith("GEMINI_API_KEY="));
  const value = line?.slice(line.indexOf("=") + 1).trim().replace(/^['"]|['"]$/g, "");
  if (!value) throw new Error("GEMINI_API_KEY is missing from .env.local.");
  return value;
}

function toGeminiSchema(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(toGeminiSchema);
  if (!value || typeof value !== "object") return value;
  const source = value as Record<string, unknown>;
  const result: Record<string, unknown> = {};
  for (const [key, nested] of Object.entries(source)) {
    if (
      key === "$schema" ||
      key === "exclusiveMinimum" ||
      key === "additionalProperties" ||
      key === "propertyNames"
    )
      continue;
    if (key === "const") {
      if (typeof nested === "boolean") result.type = "boolean";
      else result.enum = [nested];
      continue;
    }
    result[key] = toGeminiSchema(nested);
  }
  return result;
}

function responseSchema(): object {
  return toGeminiSchema(JSON.parse(fs.readFileSync(path.resolve("schema/lecture.schema.json"), "utf8"))) as object;
}

async function main(): Promise<void> {
  if (!fs.existsSync(pdfPath)) throw new Error(`PDF not found: ${pdfPath}`);
  const pdfBytes = fs.statSync(pdfPath).size;
  if (pdfBytes > maxPdfBytes) {
    throw new Error(`PDF is too large (${pdfBytes} bytes); limit is ${maxPdfBytes} bytes.`);
  }
  const ai = new GoogleGenAI({ apiKey: loadApiKey() });
  let uploaded: UploadedFile | undefined;
  try {
    uploaded = (await ai.files.upload({
      file: pdfPath,
      config: { mimeType: "application/pdf", displayName: path.basename(pdfPath) },
    })) as unknown as { name?: string; uri?: string; mimeType?: string };
    if (!uploaded.name || !uploaded.uri || !uploaded.mimeType) {
      throw new Error("Gemini did not return complete uploaded file metadata.");
    }

    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          role: "user",
          parts: [
            { fileData: { fileUri: uploaded.uri, mimeType: uploaded.mimeType } },
            {
              text: `Create one source-grounded lecture JSON object from this PDF.
Use only facts present in the PDF. Include page references in the source detail or nearby Markdown.
Choose sections and blocks that fit the material; omit widgets, figures, exam content, and expected-topic
content unless the PDF clearly supports them. Return only the lecture JSON matching the supplied schema.
Every block MUST have a "kind" property whose value is exactly one of:
prose, info, concepts, formula, code, table, figure, steps, timeline, list, exercises, recall, practice, widget.
For prose use {"kind":"prose","md":"..."}. For info use {"kind":"info","variant":"note","title":"...","md":"..."}.
For a table use {"kind":"table","headers":["..."],"rows":[["..."]]}. For a list use
{"kind":"list","variant":"objectives","items":["..."]}. Do not use "type", "content", "markdown",
"text", or "callout" as block fields. For this first probe, use only prose blocks with the exact
shape {"kind":"prose","md":"..."}. Do not include concepts, lists, quizzes, tables, formulas,
figures, widgets, raw HTML, executable code, or invented facts.`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema(),
        temperature: 0.2,
      },
    });
    if (!response.text) throw new Error("Gemini returned an empty response.");
    if (Buffer.byteLength(response.text, "utf8") > maxOutputBytes) {
      throw new Error(`Gemini output is too large; limit is ${maxOutputBytes} bytes.`);
    }
    const parsed: unknown = JSON.parse(response.text);
    const validation = lectureFileSchema.safeParse(parsed);
    if (!validation.success) {
      throw new Error(`Gemini output failed lecture schema validation: ${validation.error.issues[0]?.message}`);
    }
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, `${JSON.stringify(validation.data, null, 2)}\n`);
    console.log(`Generated ${outputPath} with ${model}.`);
  } finally {
    if (uploaded?.name) {
      try {
        await ai.files.delete({ name: uploaded.name });
      } catch (error: unknown) {
        console.error(
          `Warning: Gemini uploaded file cleanup failed: ${error instanceof Error ? error.message : "unknown error"}`,
        );
      }
    }
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Gemini generation failed.");
  process.exitCode = 1;
});
