import { describe, expect, it } from "vitest";
import { slugify } from "@/lib/slugify";

describe("slugify", () => {
  it("lowercases and replaces spaces with hyphens", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("strips accented characters", () => {
    expect(slugify("Recette préférée à la crème")).toBe("recette-preferee-a-la-creme");
  });

  it("collapses repeated separators", () => {
    expect(slugify("Un   super---plat!!")).toBe("un-super-plat");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("  --Le Tagine--  ")).toBe("le-tagine");
  });

  it("returns an empty string for input with no latin characters", () => {
    expect(slugify("مرحبا")).toBe("");
  });
});
