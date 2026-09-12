"use server";

import { cookies } from "next/headers";
import {
  gateCookieName,
  gateCookieOptions,
  safeCompareCode,
  signGate,
} from "@/kernel/identity/access-gate";
import { BSTORE_SCOPE } from "./scope";

type Result = { ok: true } | { ok: false; error: string };

// The Bstore scope documents used to hold their access code as a literal in a
// "use client" file, which meant the code shipped to every visitor and the
// whole check ran in the browser. The comparison now happens here and the
// result is an HMAC-signed cookie the layout verifies server-side.
export async function unlockBstore(code: string): Promise<Result> {
  const expected = process.env.BSTORE_ACCESS_CODE;

  // Fail closed: an unset env var must lock the page, not open it.
  if (!expected) return { ok: false, error: "Access not configured." };

  if (!safeCompareCode((code || "").trim(), expected)) {
    return { ok: false, error: "Incorrect code. Try again." };
  }

  const { token, maxAgeSeconds } = await signGate(BSTORE_SCOPE);
  (await cookies()).set(gateCookieName(BSTORE_SCOPE), token, gateCookieOptions(maxAgeSeconds));
  return { ok: true };
}
