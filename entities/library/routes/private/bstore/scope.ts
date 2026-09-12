// The access-gate scope for this private library instance. Its own module
// because actions.ts is a `'use server'` file and may only export async
// functions, and because a typo in a scope string is a silent gate bypass.
export const BSTORE_SCOPE = "bstore";
