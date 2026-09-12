'use server'

import { cookies } from 'next/headers'
import {
  gateCookieName,
  gateCookieOptions,
  LEGACY_PRIVATE_COOKIE,
  PRIVATE_LIBRARY_SCOPE,
  safeCompareCode,
  signGate,
} from '@/kernel/identity/access-gate'

type Result = { ok: true } | { ok: false; error: string }

// The only place the private-library access code is ever compared. It stays on
// the server: the browser sends what was typed and gets back a signed cookie or
// an error, so the code itself is never in a bundle anyone can read.
export async function unlockPrivateLibrary(code: string): Promise<Result> {
  const expected = process.env.PRIVATE_LIBRARY_ACCESS_CODE

  // Fail closed. Without this, an unset env var would leave `expected`
  // undefined and the comparison below would be trivially satisfiable.
  if (!expected) return { ok: false, error: 'Access not configured.' }

  if (!safeCompareCode((code || '').trim(), expected)) {
    return { ok: false, error: "That code isn't right. Try again." }
  }

  const { token, maxAgeSeconds } = await signGate(PRIVATE_LIBRARY_SCOPE)
  const jar = (await cookies())
  jar.set(gateCookieName(PRIVATE_LIBRARY_SCOPE), token, gateCookieOptions(maxAgeSeconds))
  jar.set(LEGACY_PRIVATE_COOKIE, '', { path: '/workflows/private', maxAge: 0 })
  return { ok: true }
}
