import { describe, expect, it } from "vitest";
import { makeStorageKey } from "@/lib/storageKey";

describe("storage keys", () => {
  it("namespaces by course", () => {
    expect(makeStorageKey("dis")("progress")).toBe("dis:progress");
    expect(makeStorageKey("bio")("progress")).not.toBe(makeStorageKey("dis")("progress"));
  });
});
