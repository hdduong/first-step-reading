import { describe, expect, it } from "vitest";
import { C } from "../theme.js";
import { familyForWord, familyRimeColor } from "./familyColors.js";

describe("family colors", () => {
  it("keeps -an and normal -at rimes in their original color", () => {
    expect(familyRimeColor("an")).toBe(C.red);
    expect(familyRimeColor("at", "at")).toBe(C.red);
  });

  it("uses green for -at when it appears inside the -an or -am lessons", () => {
    expect(familyRimeColor("at", "an")).toBe(C.green);
    expect(familyRimeColor("at", "am")).toBe(C.green);
  });

  it("falls back to -at when a word appears inside the -an or -am lessons", () => {
    expect(familyForWord("rat", "an")).toBe("at");
    expect(familyForWord("Mat", "am")).toBe("at");
    expect(familyForWord("Pat", "am")).toBe("at");
  });

  it("does not fall back to -at outside the explicit cross-family color lessons", () => {
    expect(familyForWord("Mat", "ed")).toBeUndefined();
  });

  it("colors -ad and -ag red while keeping earlier -at words green", () => {
    expect(familyForWord("Dad", "ad")).toBe("ad");
    expect(familyForWord("bag", "ad")).toBe("ag");
    expect(familyForWord("wags", "ad")).toBe("ag");
    expect(familyForWord("Mat", "ad")).toBe("at");
    expect(familyRimeColor("ad", "ad")).toBe(C.red);
    expect(familyRimeColor("ag", "ad")).toBe(C.red);
    expect(familyRimeColor("at", "ad")).toBe(C.green);
  });

  it("colors -ap and -ab red while keeping earlier -at words green", () => {
    expect(familyForWord("Map", "ap")).toBe("ap");
    expect(familyForWord("Dab", "ap")).toBe("ab");
    expect(familyForWord("Pat", "ap")).toBe("at");
    expect(familyRimeColor("ap", "ap")).toBe(C.red);
    expect(familyRimeColor("ab", "ap")).toBe(C.red);
    expect(familyRimeColor("at", "ap")).toBe(C.green);
  });
});
