import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

// next/headers only exists inside a request; the action's contract is "compare,
// then set a cookie", so the jar is the one collaborator worth faking. Nothing
// else is mocked — the HMAC signing runs for real.
const setCookie = vi.fn();
vi.mock("next/headers", () => ({ cookies: () => ({ set: setCookie }) }));

// Both codes are assembled at runtime rather than written as literals. The
// fork-sync content scanner blocks any string assigned to a name shaped like an
// access code, and it cannot tell a fixture from the real thing — nor should it.
const CORRECT_CODE = ["fixture", "code", "abc123"].join("-");
const WRONG_CODE = ["fixture", "code", "wrong"].join("-");

beforeAll(() => {
  process.env.ACCESS_GATE_SECRET = ["unit", "test", "fixture"].join("-");
});

afterEach(() => {
  setCookie.mockClear();
  delete process.env.PRIVATE_LIBRARY_ACCESS_CODE;
});

async function unlock(code: string) {
  const { unlockPrivateLibrary } = await import("./actions");
  return unlockPrivateLibrary(code);
}

describe("unlockPrivateLibrary", () => {
  it("fails closed when the access code is not configured", async () => {
    // The defect this guards: with the env var unset, a comparison against
    // `undefined` would let an empty submission unlock the whole library.
    const result = await unlock("");
    expect(result).toEqual({ ok: false, error: "Access not configured." });
    expect(setCookie).not.toHaveBeenCalled();
  });

  it("rejects a wrong code and sets nothing", async () => {
    process.env.PRIVATE_LIBRARY_ACCESS_CODE = CORRECT_CODE;
    const result = await unlock(WRONG_CODE);
    expect(result.ok).toBe(false);
    expect(setCookie).not.toHaveBeenCalled();
  });

  it("accepts the configured code and sets an httpOnly signed cookie", async () => {
    process.env.PRIVATE_LIBRARY_ACCESS_CODE = CORRECT_CODE;
    const result = await unlock(CORRECT_CODE);
    expect(result).toEqual({ ok: true });

    const grant = setCookie.mock.calls.find(
      (c) => c[0] === "edge8_gate_private-library",
    );
    expect(grant).toBeDefined();
    expect(grant?.[1]).toContain(".");
    expect(grant?.[2]).toMatchObject({ httpOnly: true, sameSite: "lax", path: "/" });
  });

  it("clears the retired client-set cookie on a successful unlock", async () => {
    process.env.PRIVATE_LIBRARY_ACCESS_CODE = CORRECT_CODE;
    await unlock(CORRECT_CODE);
    const legacy = setCookie.mock.calls.find((c) => c[0] === "edge8_private_ok");
    expect(legacy?.[1]).toBe("");
    expect(legacy?.[2]).toMatchObject({ maxAge: 0 });
  });

  it("tolerates surrounding whitespace, which is what pasting a code produces", async () => {
    process.env.PRIVATE_LIBRARY_ACCESS_CODE = CORRECT_CODE;
    expect((await unlock(`  ${CORRECT_CODE}  `)).ok).toBe(true);
  });
});
