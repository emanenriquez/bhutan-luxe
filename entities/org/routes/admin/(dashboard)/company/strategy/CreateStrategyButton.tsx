"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createStrategy } from "../actions";

// Empty-state action: seeds this year's strategy row from the template so the
// editor has something to open. One click, then edit in place.
export function CreateStrategyButton() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="u-stack u-items-start u-gap-2">
      <button
        type="button"
        className="admin-btn admin-btn--primary"
        disabled={pending}
        onClick={() =>
          start(async () => {
            setError(null);
            const res = await createStrategy();
            if (!res.ok) setError(res.error);
            else router.refresh();
          })
        }
      >
        {pending ? "Creating…" : `Create ${new Date().getFullYear()} strategy`}
      </button>
      {error && <div className="admin-alert admin-alert--err">{error}</div>}
    </div>
  );
}
