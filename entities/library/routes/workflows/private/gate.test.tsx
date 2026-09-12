import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

// The wrapper's contract is "the page function is not even called until the
// gate passes", so the collaborators that decide the gate are the only fakes:
// the cookie jar (no cookie), and the two staff lookups, which the test flips.
vi.mock("next/headers", () => ({ cookies: () => ({ get: () => undefined }) }));
const adminUser = vi.fn(async () => null as unknown);
const teamActor = vi.fn(async () => ({ actor: null as unknown }));
vi.mock("@/kernel/identity/admin-auth", () => ({ getAdminUser: () => adminUser() }));
vi.mock("@/kernel/identity/team-auth", () => ({ getTeamActor: () => teamActor() }));

// The cookie verifier refuses to run without a signing secret, even for a
// missing cookie. Assembled at runtime so the fork-sync scanner does not read
// it as a real secret (same reason as actions.test.ts).
beforeAll(() => {
  process.env.ACCESS_GATE_SECRET = ["unit", "test", "fixture"].join("-");
});

afterEach(() => {
  adminUser.mockReset().mockResolvedValue(null);
  teamActor.mockReset().mockResolvedValue({ actor: null });
});

describe("gatedPage", () => {
  it("renders nothing and never invokes the page while locked", async () => {
    const { gatedPage } = await import("./gate");
    const page = vi.fn(() => <main>secret list</main>);
    const Gated = gatedPage(page);
    expect(await Gated({})).toBeNull();
    expect(page).not.toHaveBeenCalled();
  });

  it("passes props through to the page once unlocked", async () => {
    adminUser.mockResolvedValue({ id: "admin-1" });
    const { gatedPage } = await import("./gate");
    const page = vi.fn((props: { slug: string }) => <main>{props.slug}</main>);
    const Gated = gatedPage(page);
    expect(await Gated({ slug: "x" })).toEqual(<main>x</main>);
    expect(page).toHaveBeenCalledWith({ slug: "x" });
  });
});

describe("gatedMetadata", () => {
  it("returns a neutral title while locked and the real one when unlocked", async () => {
    const { gatedMetadata } = await import("./gate");
    const meta = gatedMetadata({ title: "Company OS core strategy" });
    expect(await meta()).toMatchObject({ title: "Private workflows library | Edge8" });
    teamActor.mockResolvedValue({ actor: { id: "t1" } });
    expect(await meta()).toEqual({ title: "Company OS core strategy" });
  });
});
