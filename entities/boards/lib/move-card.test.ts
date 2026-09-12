import { companyOs } from "@/kernel/data/supabase";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DENIED } from "./card-helpers";
import { SUBJECT_COMMITMENT } from "./types";

// moveCardColumn chains several Supabase writes with no transaction between
// them (FS-01 split it out of team's moveCardColumn, keeping the fake client the
// board actions test uses). What the tests pin down is the contract that E8-09
// introduced: every write's `error` is read, a failure after an earlier success
// says so in the message, and a failed lookup is never reported as "not found".
// The commitment half of the old moveCardColumn is team's, and is tested there.
//
// The fake client is deliberately minimal. Each `companyOs.from(table)` call
// hands back a chainable builder that, when awaited, resolves to the next
// scripted `{ data, error }` for that table, in call order. Filter and modifier
// methods are all no-ops that return the builder, so the production query shape
// can change without breaking the fixtures.

type Response = { data?: unknown; error?: { message: string } | null };
const scripts = new Map<string, Response[]>();
const calls: { table: string; ops: string[] }[] = [];

function script(table: string, ...responses: Response[]) {
  scripts.set(table, [...(scripts.get(table) ?? []), ...responses]);
}

function builderFor(table: string) {
  const record = { table, ops: [] as string[] };
  calls.push(record);
  const respond = () => {
    const queue = scripts.get(table) ?? [];
    const next = queue.shift();
    if (!next) throw new Error(`unscripted query against ${table}`);
    return { data: next.data ?? null, error: next.error ?? null };
  };
  const builder: Record<string, unknown> = {
    then: (resolve: (v: unknown) => unknown, reject: (e: unknown) => unknown) =>
      Promise.resolve().then(respond).then(resolve, reject),
  };
  for (const op of ["select", "insert", "update", "upsert", "delete", "eq", "neq", "in", "is", "order", "limit", "single", "maybeSingle"]) {
    builder[op] = () => {
      record.ops.push(op);
      return builder;
    };
  }
  return builder;
}

vi.mock("@/kernel/data/supabase", () => ({
  companyOs: { from: (table: string) => builderFor(table) },
}));
vi.mock("@/entities/boards/lib/access", () => ({
  boardActorFor: vi.fn(async () => ({ label: "tester", personId: "person-1", isAdmin: true })),
}));
vi.mock("@/entities/boards/lib/notify", () => ({ notifyBoardAssignee: vi.fn(async () => undefined) }));
vi.mock("@/kernel/audit/audit", () => ({ recordAudit: vi.fn(async () => undefined) }));
const published: [string, unknown][] = [];
vi.mock("@/kernel/events", () => ({ publish: async (n: string, p: unknown) => { published.push([n, p]); } }));
vi.mock("@/kernel/identity/admin-auth", () => ({ requireAdmin: vi.fn(async () => ({ email: "admin@example.com" })) }));
// The company-os door move-card reaches for (Q2) leads, through the barrel, to
// a module built on unstable_cache at load and to the kernel auth guards, whose
// session readers are wrapped in React's `cache` (which the React vitest
// resolves lacks); identity keeps both inert.
vi.mock("next/cache", () => ({ revalidatePath: vi.fn(), unstable_cache: <T,>(fn: T) => fn }));
vi.mock("react", async (original) => ({
  ...(await original<typeof import("react")>()),
  cache: <T,>(fn: T) => fn,
}));

const opsFor = (table: string) => calls.filter((c) => c.table === table).map((c) => c.ops);

beforeEach(() => {
  scripts.clear();
  calls.length = 0;
  published.length = 0;
});
afterEach(() => vi.clearAllMocks());

const TASK = { id: "task-1", board_id: "board-1", board_column_id: "col-a", subject_type: null, subject_id: null };

describe("moveCardColumn", () => {
  it("AC2: reports the DB message, not 'Card not found', when the lookup errors", async () => {
    script("tasks", { error: { message: "connection reset" } });
    const { moveCardColumn } = await import("./move-card");
    const r = await moveCardColumn("task-1", "col-b", "board");
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.error).toContain("connection reset");
    expect(r.error).not.toContain("Card not found");
  });

  // AR-26 moved the lookup behind `boardMutation`, which decides deny-before-
  // disclose once for every board mutation: a card that is gone and a card the
  // caller may not touch now read the same, so a task id no longer probes for
  // existence. A failed lookup (above) stays distinct.
  it("gives a genuine miss the same answer a denied actor gets", async () => {
    script("tasks", { data: null });
    const { moveCardColumn } = await import("./move-card");
    const missing = await moveCardColumn("task-1", "col-b", "board");

    calls.length = 0;
    scripts.clear();
    script("tasks", { data: TASK });
    const { boardActorFor } = await import("./access");
    vi.mocked(boardActorFor).mockResolvedValue(null);
    const denied = await moveCardColumn("task-1", "col-b", "board");
    // `vi.clearAllMocks()` clears calls, not implementations, so the permitted
    // actor the factory set up has to be put back for the rest of the file.
    vi.mocked(boardActorFor).mockResolvedValue({ label: "tester", personId: "person-1", isAdmin: true });

    expect(denied).toEqual(missing);
    expect(denied).toEqual({ ok: false, error: DENIED });
    // Nothing was written down either path.
    expect(calls.every((c) => !c.ops.includes("update"))).toBe(true);
  });

  it("AC1: returns ok:false with the DB message when the stage-log insert fails", async () => {
    script("tasks", { data: TASK }, { data: null }, { error: null }); // lookup, endPosition, update
    script("board_columns", { data: { id: "col-b", is_done: false } });
    script("task_stage_log", { error: { message: "stage_log insert exploded" } });
    const { moveCardColumn } = await import("./move-card");
    const r = await moveCardColumn("task-1", "col-b", "board");
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.error).toContain("stage_log insert exploded");
    // The message has to admit that the move itself persisted.
    expect(r.error).toMatch(/Card moved/);
  });

  it("returns ok:true when every write succeeds", async () => {
    script("tasks", { data: TASK }, { data: null }, { error: null });
    script("board_columns", { data: { id: "col-b", is_done: false } });
    script("task_stage_log", { error: null });
    const { moveCardColumn } = await import("./move-card");
    expect(await moveCardColumn("task-1", "col-b", "board")).toEqual({ ok: true });
  });

  // The board half states the fact and writes nothing outside its own tables:
  // whoever cares that a commitment-linked card is done subscribes (RS-13).
  it("publishes the completion and touches no other entity's table", async () => {
    script("tasks", { data: { ...TASK, subject_type: SUBJECT_COMMITMENT, subject_id: "commit-1" } }, { data: null }, { error: null });
    script("board_columns", { data: { id: "col-done", is_done: true } });
    script("task_stage_log", { error: null });
    const { moveCardColumn } = await import("./move-card");
    expect(await moveCardColumn("task-1", "col-done", "board")).toEqual({ ok: true });
    expect(published).toEqual([
      ["board.card.completed", { taskId: "task-1", boardSlug: "board", subjectType: SUBJECT_COMMITMENT, subjectId: "commit-1" }],
    ]);
    expect(calls.some((c) => c.table === "coaching_commitments")).toBe(false);
  });

  it("publishes nothing when the target column is not done", async () => {
    script("tasks", { data: { ...TASK, subject_type: SUBJECT_COMMITMENT, subject_id: "commit-1" } }, { data: null }, { error: null });
    script("board_columns", { data: { id: "col-b", is_done: false } });
    script("task_stage_log", { error: null });
    const { moveCardColumn } = await import("./move-card");
    expect(await moveCardColumn("task-1", "col-b", "board")).toEqual({ ok: true });
    expect(published).toEqual([]);
  });
});

