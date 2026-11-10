import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { blockSchema, courseSchema, lectureFileSchema } from "@/content/schema";
import { schemaDocuments } from "../scripts/content/schema-export";
import { minimalCourse, minimalLecture } from "./fixtures/minimal";

describe("content schemas", () => {
  it("accepts the minimal course and lecture", () => {
    expect(courseSchema.safeParse(minimalCourse).success).toBe(true);
    expect(lectureFileSchema.safeParse(minimalLecture).success).toBe(true);
  });

  it("rejects an unknown block kind", () => {
    expect(blockSchema.safeParse({ kind: "video", url: "x" }).success).toBe(false);
  });

  it("rejects an extra key", () => {
    expect(blockSchema.safeParse({ kind: "prose", md: "x", html: "<b>" }).success).toBe(false);
  });

  it("rejects the old interactive kind", () => {
    expect(blockSchema.safeParse({ kind: "interactive", title: "x" }).success).toBe(false);
  });

  it("accepts a widget block without props", () => {
    expect(blockSchema.safeParse({ kind: "widget", type: "quorum-lab", title: "Quorum" }).success).toBe(true);
  });

  it("rejects a quiz question with one option", () => {
    const invalid = {
      ...minimalLecture,
      quiz: [{ ...minimalLecture.quiz[0], options: [{ id: "a", text: "A" }] }],
    };
    expect(lectureFileSchema.safeParse(invalid).success).toBe(false);
  });

  it("rejects language 'English'", () => {
    expect(courseSchema.safeParse({ ...minimalCourse, language: "English" }).success).toBe(false);
  });

  it("schema files are up to date", () => {
    for (const [file, schema] of Object.entries(schemaDocuments())) {
      const onDisk = JSON.parse(fs.readFileSync(path.resolve("schema", file), "utf8")) as object;
      expect(onDisk).toEqual(schema);
    }
  });
});
