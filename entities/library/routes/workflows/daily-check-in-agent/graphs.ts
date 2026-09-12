import type { WorkflowGraphDef } from '../graph'

/**
 * The real control flow of the daily check-in agent and the state a person
 * moves through on any one day. Coordinates are explicit: every branch,
 * converge point and failure path is placed by hand so the diagram stays
 * legible.
 */

export const DAILY_AGENT: WorkflowGraphDef = {
  id: 'daily',
  width: 840,
  height: 1000,
  nodes: [
    { id: 't0', kind: 'trigger', label: '09:00 (+07) the reminder fires', sub: 'every weekday, both teams', x: 330, y: 46, w: 270, h: 58 },
    { id: 'h0', kind: 'human', label: 'post to both chats:\ntime to update your cards', x: 330, y: 138, w: 300, h: 70 },
    { id: 't1', kind: 'trigger', label: '09:30 (+07) the check-in fires', sub: 'thirty minutes later, or Run now', x: 330, y: 236, w: 270, h: 58 },
    { id: 'd0', kind: 'decision', label: 'weekend, or already\nposted today?', x: 330, y: 334, w: 260, h: 72 },
    { id: 'r0', kind: 'terminal', label: 'skipped, logged:\nnothing sent', x: 655, y: 334, w: 200, h: 60 },
    { id: 'a1', kind: 'action', label: 'load the active directory', sub: 'mark anyone on booked leave', x: 330, y: 436, w: 290, h: 62 },
    { id: 'f1', kind: 'flag', label: 'read fails: abort,\npost nothing', x: 95, y: 436, w: 180, h: 62 },
    { id: 'a2', kind: 'action', label: 'read the Workboard', sub: 'every board, card, comment and blocker', x: 330, y: 530, w: 290, h: 62 },
    { id: 'f2', kind: 'flag', label: 'no boards: abort,\npost nothing', x: 95, y: 530, w: 180, h: 62 },
    { id: 'd1', kind: 'decision', label: 'card moved or\ncommented in 24h?', x: 330, y: 632, w: 260, h: 72 },
    { id: 'd2', kind: 'decision', label: 'leave booked today?', x: 655, y: 632, w: 200, h: 60 },
    { id: 'r1', kind: 'terminal', label: 'listed as off, never chased', x: 655, y: 726, w: 200, h: 48 },
    { id: 'h2', kind: 'flag', label: 'tagged quiet:\nlisted as pending', sub: 'in the post, not a DM', x: 655, y: 816, w: 200, h: 70 },
    { id: 'a3', kind: 'action', label: 'compose one line per person', sub: 'done, doing, blockers, off the cards', x: 330, y: 742, w: 300, h: 62 },
    { id: 'h1', kind: 'human', label: 'post to the roster’s Lark chat', sub: 'Product Team, then EO; unset webhook: skipped', x: 330, y: 842, w: 280, h: 64 },
    { id: 'w1', kind: 'write', label: 'log the run: routine_runs', sub: 'date, rosters posted, card count', x: 330, y: 944, w: 280, h: 62 },
  ],
  edges: [
    { from: 't0', to: 'h0' },
    { from: 'h0', to: 't1', label: 'thirty minutes to update cards', labelAt: [455, 195] },
    { from: 't1', to: 'd0' },
    { from: 'd0', to: 'r0', fromSide: 'right', toSide: 'left', label: 'yes', labelAt: [507, 322] },
    { from: 'd0', to: 'a1', label: 'no', labelAt: [345, 392] },
    { from: 'a1', to: 'f1', kind: 'fail', fromSide: 'left', toSide: 'right' },
    { from: 'a1', to: 'a2' },
    { from: 'a2', to: 'f2', kind: 'fail', fromSide: 'left', toSide: 'right' },
    { from: 'a2', to: 'd1' },
    { from: 'd1', to: 'a3', label: 'yes', labelAt: [345, 700] },
    { from: 'd1', to: 'd2', fromSide: 'right', toSide: 'left', label: 'no', labelAt: [507, 620] },
    { from: 'd2', to: 'r1', label: 'yes', labelAt: [670, 684] },
    { from: 'd2', to: 'h2', fromSide: 'right', points: [[775, 632], [775, 816]], toSide: 'right', label: 'no', labelAt: [790, 730] },
    { from: 'h2', to: 'a3', kind: 'agent', fromSide: 'left', points: [[520, 816], [520, 742]], toSide: 'right', label: 'pending', labelAt: [545, 790] },
    { from: 'a3', to: 'h1' },
    { from: 'h1', to: 'w1' },
  ],
}

export const PERSON_DAY: WorkflowGraphDef = {
  id: 'person-day',
  width: 900,
  height: 310,
  nodes: [
    { id: 'stale', kind: 'state', label: 'stale', x: 95, y: 100, w: 110, h: 44 },
    { id: 'fresh', kind: 'state', label: 'fresh', x: 330, y: 100, w: 120, h: 44 },
    { id: 'posted', kind: 'state', label: 'posted', x: 560, y: 100, w: 140, h: 44 },
    { id: 'off', kind: 'state', label: 'off', x: 200, y: 230, w: 110, h: 44 },
    { id: 'pending', kind: 'state', label: 'pending', x: 420, y: 230, w: 130, h: 44 },
  ],
  edges: [
    { from: 'stale', to: 'fresh', kind: 'muted', label: 'moves or comments on a card', labelAt: [212, 92] },
    { from: 'fresh', to: 'posted', kind: 'agent', label: 'in the post', labelAt: [445, 92] },
    { from: 'stale', to: 'off', kind: 'agent', fromSide: 'bottom', points: [[95, 230]], toSide: 'left', label: 'leave booked', labelAt: [95, 175] },
    { from: 'stale', to: 'pending', kind: 'agent', fromSide: 'bottom', fromOffset: [20, 0], points: [[115, 180], [420, 180]], toSide: 'top', label: 'no leave, no move in 24h', labelAt: [270, 172] },
    { from: 'pending', to: 'posted', kind: 'agent', fromSide: 'right', points: [[540, 230]], toSide: 'bottom', toOffset: [-20, 0], label: 'tagged, at the foot', labelAt: [520, 205] },
    { from: 'off', to: 'posted', kind: 'agent', fromSide: 'bottom', points: [[200, 282], [580, 282]], toSide: 'bottom', toOffset: [20, 0], label: 'listed as off', labelAt: [390, 296] },
  ],
}
