"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createContact } from "@/entities/crm/lib/contacts-actions";

// Quick-add for the Contacts screen. One form adds a person to the Company
// Database and, with the role toggles, makes them an employee and/or an admin
// in a single step. Admin implies employee (an admin must be linked to an
// active team_members row), so ticking Admin auto-ticks and locks Employee.
export function AddContactButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [makeEmployee, setMakeEmployee] = useState(false);
  const [makeAdmin, setMakeAdmin] = useState(false);
  const [superAdmin, setSuperAdmin] = useState(false);

  function reset() {
    setFullName("");
    setEmail("");
    setPhone("");
    setMakeEmployee(false);
    setMakeAdmin(false);
    setSuperAdmin(false);
    setError(null);
  }

  function close() {
    if (pending) return;
    setOpen(false);
    reset();
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await createContact({
        full_name: fullName,
        email,
        phone,
        makeEmployee,
        makeAdmin,
        superAdmin,
      });
      if (res.ok) {
        setOpen(false);
        reset();
        router.refresh();
      } else {
        setError(res.error);
      }
    });
  }

  // Admin implies employee — reflect it in the UI so the rule is visible.
  const employeeChecked = makeEmployee || makeAdmin;

  return (
    <>
      <button type="button" className="admin-btn admin-btn--primary" onClick={() => setOpen(true)}>
        Add contact
      </button>

      {open && (
        <div className="admin-modal-backdrop" onClick={close}>
          <div
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Add contact"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-title">Add contact</div>
            <form className="admin-form" onSubmit={submit}>
              <div className="admin-field">
                <label className="admin-label" htmlFor="ac-name">Full name</label>
                <input
                  id="ac-name"
                  className="admin-input"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={pending}
                  autoFocus
                />
              </div>
              <div className="admin-field">
                <label className="admin-label" htmlFor="ac-email">Email</label>
                <input
                  id="ac-email"
                  className="admin-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={pending}
                />
              </div>
              <div className="admin-field">
                <label className="admin-label" htmlFor="ac-phone">Phone</label>
                <input
                  id="ac-phone"
                  className="admin-input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={pending}
                />
              </div>

              <label className="u-row u-gap-2">
                <input
                  type="checkbox"
                  checked={employeeChecked}
                  disabled={pending || makeAdmin}
                  onChange={(e) => setMakeEmployee(e.target.checked)}
                />
                <span className="admin-label u-m-0">Employee</span>
              </label>

              <label className="u-row u-gap-2">
                <input
                  type="checkbox"
                  checked={makeAdmin}
                  disabled={pending}
                  onChange={(e) => {
                    setMakeAdmin(e.target.checked);
                    if (!e.target.checked) setSuperAdmin(false);
                  }}
                />
                <span className="admin-label u-m-0">Admin (can sign in to this console)</span>
              </label>

              {makeAdmin && (
                <div className="admin-field">
                  <label className="admin-label" htmlFor="ac-level">Admin level</label>
                  <select
                    id="ac-level"
                    className="admin-select"
                    value={superAdmin ? "super" : "admin"}
                    onChange={(e) => setSuperAdmin(e.target.value === "super")}
                    disabled={pending}
                  >
                    <option value="admin">Admin</option>
                    <option value="super">Super Admin</option>
                  </select>
                  <p className="admin-cell-muted u-m-0 u-mt-2 u-sm">
                    Ticking Admin also adds an employee record and emails {email || "them"} a link to
                    set a password. Super Admins can view wages and PII.
                  </p>
                </div>
              )}

              {error && <div className="admin-alert admin-alert--err">{error}</div>}

              <div className="admin-modal-actions">
                <button type="button" className="admin-btn" onClick={close} disabled={pending}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn--primary" disabled={pending || !email.trim()}>
                  {pending ? "Working…" : makeAdmin ? "Add & send invite" : "Add contact"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
