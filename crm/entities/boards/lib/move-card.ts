"use server";

// The board half of a card move: validate the target column, reposition the
// card, set its done state, log the stage change and audit it. Every write here
// is to a table this entity owns (tasks, board_columns, task_stage_log), which
// is why the mechanics live in the boards module rather than in the caller.
//
// What this function deliberately does NOT do is close a linked coaching
// commitment. `coaching_commitments` is coaching's table, and an entity that
// creates board cards cannot also be one the board imports, or neither installs
// without the other. So a move into a done column publishes
// `board.card.completed` and whoever cares subscribes (RS-13, docs/adr/0003).
// A deployment without coaching has no subscriber and the move is unaffected.
import { companyOs } from "@/kernel/data/supabase";
import { recordAudit } from "@/kernel/audit/audit";
import { boardMutation } from "./mutation";
import { endPosition, refresh } from "./card-helpers";
import { insertTaskStageLog, updateTasks } from "./writes";
import { publish } from "@/kernel/events";

export type CardMoveOutcome = { ok: false; error: string } | { ok: true };

export async function moveCardColumn(taskId: string, toColumnId: string, boardSlug: string): Promise<CardMoveOutcome> {
  const gate = await boardMutation({
    table: "tasks",
    id: taskId,
    select: "id, board_id, board_column_id, subject_type, subject_id",
    label: "card",
  });
  if (!gate.ok) return gate;
  const { actor } = gate;
  const t = gate.row as {
    id: string;
    board_id: string;
    board_column_id: string | null;
    subject_type: string | null;
    subject_id: string | null;
  };

  const { data: col, error: columnError } = await companyOs
    .from("board_columns")
    .select("id, is_done")
    .eq("id", toColumnId)
    .eq("board_id", t.board_id)
    .maybeSingle();
  if (columnError) console.error("[boards/move-card] board_columns", columnError);
  if (!col) return { ok: false, error: "That column is not on this board." };
  const isDone = (col as { is_done: boolean }).is_done;
  if (t.board_column_id === toColumnId) return { ok: true };

  const updates = {
    board_column_id: toColumnId,
    position: await endPosition(t.board_id, toColumnId),
    status: isDone ? "done" : "open",
    completed_at: isDone ? new Date().toISOString() : null,
  };
  const { error } = await updateTasks(updates).eq("id", taskId);
  if (error) return { ok: false, error: error.message };

  // From here on the move itself has persisted. There is no transaction (that
  // needs an RPC and a migration, deferred), so each follow-up write reports
  // its own failure and the message says what did land, so the user does not
  // retry the move and does know the history needs a look.
  const { error: logErr } = await insertTaskStageLog({
    task_id: taskId,
    from_column_id: t.board_column_id,
    to_column_id: toColumnId,
    kind: "move",
    moved_by: actor.personId,
    note: null,
  });
  if (logErr) {
    refresh(boardSlug);
    return { ok: false, error: `Card moved, but the stage history could not be written: ${logErr.message}` };
  }

  // The move has persisted and been logged, so it is audited here even when the
  // caller's follow-up fails: the card really did move and the trail should say
  // so. Only then is the caller told which commitment the move implies.
  await recordAudit({ table: "tasks", recordId: taskId, operation: "update", actor: actor.label, newData: updates });
  refresh(boardSlug);

  // Published after the move has persisted and been audited, so a subscriber
  // never acts on a move that did not land. Handler failures are the bus's to
  // log and audit; they cannot fail this action.
  if (isDone) {
    await publish("board.card.completed", {
      taskId,
      boardSlug,
      subjectType: t.subject_type,
      subjectId: t.subject_id,
    });
  }
  return { ok: true };
}
