import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { snapshotText } from "../scripts/snapshot-text";

const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

describe("snapshotText", () => {
  it("keeps visible text only", () => {
    const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "snapshot-text-"));
    temporaryDirectories.push(temporaryDirectory);
    fs.mkdirSync(path.join(temporaryDirectory, "a"));
    fs.writeFileSync(
      path.join(temporaryDirectory, "a", "index.html"),
      "<html><head><style>x{}</style><script>var s=1</script></head><body><h1>Hi</h1>\n  <p>two   words</p></body></html>",
    );

    expect(snapshotText(temporaryDirectory)).toEqual({ "a/index.html": "Hi two words" });
  });
});
