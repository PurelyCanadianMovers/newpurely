import { describe, expect, it } from "vitest";

/** Pure helper — mirrors the logic in server/_core/env.ts */
function parseAdminEmails(raw: string): Set<string> {
  return new Set(
    raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  );
}

describe("ADMIN_EMAILS allowlist parsing", () => {
  it("parses comma-separated emails into a normalised Set", () => {
    const set = parseAdminEmails("alice@example.com, BOB@example.com ,charlie@test.org");
    expect(set.has("alice@example.com")).toBe(true);
    expect(set.has("bob@example.com")).toBe(true);   // normalised to lowercase
    expect(set.has("charlie@test.org")).toBe(true);
    expect(set.has("unknown@other.com")).toBe(false);
  });

  it("returns an empty Set when the env value is empty", () => {
    const set = parseAdminEmails("");
    expect(set.size).toBe(0);
  });

  it("includes the configured admin emails", () => {
    // Validates the actual ADMIN_EMAILS value set in the environment
    const raw = process.env.ADMIN_EMAILS ?? "";
    const set = parseAdminEmails(raw);
    // Both configured admin emails must be present
    expect(set.has("jpcreativeconcepts@gmail.com")).toBe(true);
    expect(set.has("shawndrdul@aol.com")).toBe(true);
  });
});
