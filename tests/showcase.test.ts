import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { validateCourse } from "../scripts/content/validate";
import { blockSchema, type LectureFile } from "@core/schema";
import { generatorWidgetTypes } from "@core/widgets";

const dir = "examples/showcase";

describe("showcase course", () => {
  it("validates with no errors and no warnings", () => expect(validateCourse(dir)).toEqual([]));

  const lecture = JSON.parse(fs.readFileSync(`${dir}/lectures/01-everything.json`, "utf8")) as LectureFile;
  const blocks = lecture.sections.flatMap((section) => section.blocks);

  it("uses every block kind except figure", () => {
    const kinds = new Set(blocks.map((block) => block.kind));
    const all = blockSchema.options.map((option) => option.shape.kind.value);
    expect([...all].filter((kind) => kind !== "figure" && !kinds.has(kind))).toEqual([]);
  });
  it("uses every non-DIS widget", () => {
    const used = new Set(blocks.flatMap((block) => (block.kind === "widget" ? [block.type] : [])));
    expect(generatorWidgetTypes.filter((type) => !used.has(type))).toEqual([]);
  });
  it("gives every block a source", () => expect(blocks.filter((block) => !block.source)).toEqual([]));
});
