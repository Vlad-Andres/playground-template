import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { courseSchema, expectedFileSchema, lectureFileSchema } from "../../src/content/schema";

export function schemaDocuments(): Record<string, object> {
  return {
    "course.schema.json": z.toJSONSchema(courseSchema),
    "lecture.schema.json": z.toJSONSchema(lectureFileSchema),
    "expected.schema.json": z.toJSONSchema(expectedFileSchema),
  };
}

const schemaDirectory = path.resolve("schema");
export function writeSchemas(): void {
  fs.mkdirSync(schemaDirectory, { recursive: true });
  for (const [file, schema] of Object.entries(schemaDocuments())) {
    fs.writeFileSync(path.join(schemaDirectory, file), `${JSON.stringify(schema, null, 2)}\n`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  writeSchemas();
}
