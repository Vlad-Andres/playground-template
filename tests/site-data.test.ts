import { describe, expect, it } from "vitest";
import { buildSiteData, siteDataSchema } from "@core/site";
import { makeStorageKey } from "@/lib/storageKey";
import { sitePaths } from "@/site/paths";
import { loadCourse } from "../scripts/content/load";
import { minimalCourse, minimalLecture } from "./fixtures/minimal";

const loaded = loadCourse("examples/showcase");

function showcase() {
  if (!loaded.course) throw new Error("The showcase course did not load.");
  return buildSiteData({
    key: loaded.course.id,
    course: loaded.course,
    lectures: loaded.lectures.map((entry) => entry.data),
    exam: loaded.exam,
    expected: loaded.expected,
  });
}

describe("buildSiteData", () => {
  it("loads the showcase without problems", () => {
    expect(loaded.problems).toEqual([]);
  });

  it("produces data that matches siteDataSchema", () => {
    expect(siteDataSchema.safeParse(showcase()).success).toBe(true);
  });

  it("keeps one index entry per lecture, in lecture order", () => {
    const data = showcase();
    expect(data.index).toHaveLength(data.lectures.length);
    expect(data.index.map((entry) => entry.meta.slug)).toEqual(
      data.lectures.map((lecture) => lecture.meta.slug),
    );
    expect(data.index.map((entry) => entry.meta.number)).toEqual(
      [...data.index.map((entry) => entry.meta.number)].sort((a, b) => a - b),
    );
  });

  it("sorts lectures by number even when the files arrive out of order", () => {
    const first = { ...minimalLecture, meta: { ...minimalLecture.meta, slug: "first", number: 1 } };
    const second = { ...minimalLecture, meta: { ...minimalLecture.meta, slug: "second", number: 2 } };
    const data = buildSiteData({
      key: minimalCourse.id,
      course: minimalCourse,
      lectures: [second, first],
      exam: null,
      expected: [],
    });

    expect(data.lectures.map((lecture) => lecture.meta.slug)).toEqual(["first", "second"]);
    expect(data.index.map((entry) => entry.meta.slug)).toEqual(["first", "second"]);
  });
});

describe("sitePaths", () => {
  it("serves from the root when the base is empty", () => {
    const paths = sitePaths("");
    expect(paths.home).toBe("/");
    expect(paths.lecture("x")).toBe("/lectures/x/");
    expect(paths.exam).toBe("/exam/");
    expect(paths.expected).toBe("/expected/");
    expect(paths.difficult).toBe("/difficult/");
  });

  it("mounts a course under its base", () => {
    const paths = sitePaths("/courses/k");
    expect(paths.home).toBe("/courses/k/");
    expect(paths.lecture("x")).toBe("/courses/k/lectures/x/");
    expect(paths.exam).toBe("/courses/k/exam/");
    expect(paths.expected).toBe("/courses/k/expected/");
    expect(paths.difficult).toBe("/courses/k/difficult/");
  });

  it("does not double the slash when the base ends with one", () => {
    expect(sitePaths("/courses/k/").lecture("x")).toBe("/courses/k/lectures/x/");
  });
});

describe("site storage keys", () => {
  it("uses the site key, not the course id, so two sites never share progress", () => {
    const one = buildSiteData({
      key: "one",
      course: minimalCourse,
      lectures: [minimalLecture],
      exam: null,
      expected: [],
    });
    const two = buildSiteData({
      key: "two",
      course: minimalCourse,
      lectures: [minimalLecture],
      exam: null,
      expected: [],
    });

    expect(one.course.id).toBe(two.course.id);
    expect(makeStorageKey(one.key)("theme")).not.toBe(makeStorageKey(two.key)("theme"));
    expect(makeStorageKey(one.key)("progress:v1")).toBe("one:progress:v1");
  });
});
