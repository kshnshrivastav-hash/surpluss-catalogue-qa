import { describe, expect, it } from "vitest";
import { effectiveStatus } from "../../src/lib/catalogue-status";

describe("effectiveStatus", () => {
  it("keeps a published catalogue published when its expiry date is in the future", () => {
    const futureExpiry = new Date("2099-01-01T00:00:00Z");

    expect(effectiveStatus("published", futureExpiry)).toBe("published");
  });
});