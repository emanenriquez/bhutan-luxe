import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { gateCookieName, PRIVATE_LIBRARY_SCOPE, verifyGate } from '@/kernel/identity/access-gate'
import { getAdminUser } from '@/kernel/identity/admin-auth'
import { getTeamActor } from '@/kernel/identity/team-auth'

// The one answer to "may this request see the private library?", shared by the
// layout that renders the index pages and by the two route handlers that serve
// documents from disk.
//
// It used to live in two shapes: the layout accepted the signed cookie OR a
// staff session, the document routes accepted only the cookie. A signed-in
// admin who followed a document link was therefore bounced to the index, which
// recognised them as staff and showed the list, never the unlock form and never
// the document they asked for. One helper, one rule.
//
// A signed-in team member or admin is more strongly identified than the shared
// code proves, so the code is not asked of them. This is also what lets the
// team and admin shells embed library pages in an iframe (#992). Both lookups
// are request-cached and return null for anonymous visitors.
export async function isPrivateLibraryUnlocked(): Promise<boolean> {
  const token = (await cookies()).get(gateCookieName(PRIVATE_LIBRARY_SCOPE))?.value
  if (await verifyGate(token, PRIVATE_LIBRARY_SCOPE)) return true

  // Fail closed. If the session client cannot even be built (a machine without
  // the public Supabase vars, which is every local checkout today), the answer
  // is "not staff", not a 500 across the whole library. The cookie path above
  // has already had its say.
  try {
    const [team, admin] = await Promise.all([getTeamActor(), getAdminUser()])
    return team.actor !== null || admin !== null
  } catch {
    return false
  }
}

// Title shown in the tab while the unlock form is up. Deliberately says nothing
// about which document sits behind it.
const LOCKED_METADATA: Metadata = {
  title: 'Private workflows library | Edge8',
  robots: { index: false, follow: false },
}

// Every page.tsx under this entity's routes/workflows/private exports its component through this
// wrapper, and scripts/check-private-pages.mjs fails the build when one does not.
//
// The layout renders the unlock form instead of `children` when the visitor is
// locked out, but that is not enough on its own: the App Router renders a
// layout and its page in parallel, so the page's output still reaches the RSC
// payload even when the layout never places it in the tree. Before this wrapper
// an anonymous curl of /workflows/private/e8/ came back with the unlock form
// AND every document slug, title and description in the flight data behind it.
//
// Rendering null here means the page produces nothing until the gate passes: no
// Storage listing, no serialised props, no client-chunk reference. The gate
// lookups are request-cached, so the layout and page asking the same question
// costs one check.
export function gatedPage<P>(
  Page: (props: P) => React.ReactNode | Promise<React.ReactNode>,
): (props: P) => Promise<React.ReactNode> {
  return async function GatedPrivatePage(props: P) {
    if (!(await isPrivateLibraryUnlocked())) return null
    return Page(props)
  }
}

// The same rule for <head>. A static `metadata` export is resolved regardless of
// what the page renders, so a locked visitor would still see the document's
// title in the tab and in the HTML. Pages export `generateMetadata` through this
// instead.
export function gatedMetadata(unlocked: Metadata): () => Promise<Metadata> {
  return async function generatePrivateMetadata() {
    return (await isPrivateLibraryUnlocked()) ? unlocked : LOCKED_METADATA
  }
}
