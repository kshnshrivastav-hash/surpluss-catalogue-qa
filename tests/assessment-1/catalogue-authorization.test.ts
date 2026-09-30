import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockCurrentActor, mockDelete } = vi.hoisted(() => ({
  mockCurrentActor: vi.fn(),
  mockDelete: vi.fn(),
}));

vi.mock("@/auth-guards", () => ({
  currentActor: mockCurrentActor,
  isAdmin: vi.fn((actor) => actor?.role === "admin"),
}));

vi.mock("@/auth", () => ({
  signOut: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  getPrisma: () => ({
    catalogue: {
      delete: mockDelete,
    },
  }),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/incomplete", () => ({
  findIncompleteProducts: vi.fn(),
  incompleteMessage: vi.fn(),
}));

import { deleteCatalogue } from "../../src/app/admin/actions";

describe("Catalogue deletion authorization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should reject catalogue deletion by a staff user", async () => {
    mockCurrentActor.mockResolvedValue({
      id: "staff-user-id",
      email: "staff@catalogue.test",
      role: "staff",
    });

    mockDelete.mockResolvedValue({
      slug: "test-catalogue",
      name: "Test catalogue",
    });

    const result = await deleteCatalogue(
      "550e8400-e29b-41d4-a716-446655440000",
    );

    expect(result).toEqual({
      error: "Only an admin can delete a catalogue.",
    });

    expect(mockDelete).not.toHaveBeenCalled();
  });
});