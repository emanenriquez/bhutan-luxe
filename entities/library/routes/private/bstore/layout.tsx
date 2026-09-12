import type { Metadata } from "next";
import { cookies } from "next/headers";
import PrivateUnlockForm from "@/entities/library/routes/workflows/private/PrivateUnlockForm";
import { gateCookieName, verifyGate } from "@/kernel/identity/access-gate";
import { BSTORE_SCOPE } from "./scope";
import { unlockBstore } from "./actions";

export const metadata: Metadata = {
  title: "Bstore - Project Scope Summary",
  robots: { index: false, follow: false },
};

// Gate the whole /private/bstore subtree in one server component.
//
// The scope summary and the backlog each used to check a hardcoded password in
// the browser, which meant every word of both documents was already in the page
// payload before anyone typed anything. Checking here means an unauthorised
// visitor gets the unlock form and none of the content.
//
// Reading cookies() makes these routes dynamic, which is what a private
// document wants anyway. The `export const dynamic = 'force-dynamic'` that
// enforces it sits in the app/ mount instead of here: Next reads a segment's
// config by static analysis of the file under app/, and would not see it
// through a re-export.
export default async function BstorePrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get(gateCookieName(BSTORE_SCOPE))?.value;
  if (!(await verifyGate(token, BSTORE_SCOPE))) {
    return (
      <PrivateUnlockForm
        action={unlockBstore}
        variant="card"
        title="Bstore - Project Scope"
        description="Enter the access code to view this document."
      />
    );
  }

  return <>{children}</>;
}
