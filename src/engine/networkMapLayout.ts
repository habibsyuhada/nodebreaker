import type { LevelNodeDef } from "../levels/types";

export interface MapNodePosition {
  nodeId: string;
  col: number;
  depth: number;
  x: number;
  y: number;
}

export interface MapEdge {
  a: string;
  b: string;
}

export interface NetworkMapLayout {
  nodes: MapNodePosition[];
  edges: MapEdge[];
  viewBoxW: number;
  viewBoxH: number;
}

const VIEWBOX_W = 380;
const VIEWBOX_H = 320;
const HUB_X = VIEWBOX_W / 2;
const HUB_Y = 40;
const ROW_H = 110;
const COL_W = VIEWBOX_W / 3;
const COLLISION_X_OFFSET = 42;

/**
 * Lays out a boss level's node graph as a hub + 3-column tree, purely from its `pivots` — no
 * DOM measurement, fixed viewBox, safe to consume directly as percentage-based positions. Only
 * meaningful for boss-shaped networks (one hub with exactly a handful of branches, depth ≤ ~3);
 * it isn't a general graph-layout algorithm, just enough to place the specific shape every boss
 * level in this game uses (see `isBossLevel` in `../levels/chapters`).
 */
export function computeNetworkMapLayout(nodes: LevelNodeDef[], entryNodeId: string): NetworkMapLayout {
  const adjacency = new Map<string, Set<string>>();
  const addEdge = (a: string, b: string) => {
    if (!adjacency.has(a)) adjacency.set(a, new Set());
    if (!adjacency.has(b)) adjacency.set(b, new Set());
    adjacency.get(a)!.add(b);
    adjacency.get(b)!.add(a);
  };
  for (const node of nodes) {
    for (const pivot of node.pivots ?? []) addEdge(node.id, pivot.targetNodeId);
  }

  const depth = new Map<string, number>([[entryNodeId, 0]]);
  const col = new Map<string, number>();
  const treeEdges: MapEdge[] = [];
  const queue: string[] = [entryNodeId];

  // Hub's own pivots (in their authored order) fix which column each branch gets — this is what
  // pins Ghost/Breach/Analyst to columns 0/1/2 deterministically, rather than relying on Set
  // iteration order (which isn't guaranteed to match authoring order).
  const hub = nodes.find((n) => n.id === entryNodeId);
  (hub?.pivots ?? []).forEach((p, i) => {
    if (!depth.has(p.targetNodeId)) {
      depth.set(p.targetNodeId, 1);
      col.set(p.targetNodeId, i);
      treeEdges.push({ a: entryNodeId, b: p.targetNodeId });
      queue.push(p.targetNodeId);
    }
  });

  while (queue.length > 0) {
    const id = queue.shift()!;
    const neighbors = adjacency.get(id) ?? new Set();
    for (const neighborId of neighbors) {
      if (depth.has(neighborId)) continue;
      depth.set(neighborId, (depth.get(id) ?? 0) + 1);
      col.set(neighborId, col.get(id) ?? 0);
      treeEdges.push({ a: id, b: neighborId });
      queue.push(neighborId);
    }
  }

  // Group by (col, depth) to resolve same-cell collisions (e.g. a bonus leaf sharing a branch's
  // second row with that branch's main continuation) with a symmetric horizontal nudge.
  const cellGroups = new Map<string, string[]>();
  for (const nodeId of depth.keys()) {
    if (nodeId === entryNodeId) continue;
    const key = `${col.get(nodeId)}:${depth.get(nodeId)}`;
    if (!cellGroups.has(key)) cellGroups.set(key, []);
    cellGroups.get(key)!.push(nodeId);
  }

  const positions: MapNodePosition[] = [{ nodeId: entryNodeId, col: -1, depth: 0, x: HUB_X, y: HUB_Y }];
  for (const [key, ids] of cellGroups) {
    const [colStr, depthStr] = key.split(":");
    const c = Number(colStr);
    const d = Number(depthStr);
    const baseX = COL_W * c + COL_W / 2;
    const baseY = HUB_Y + d * ROW_H;
    ids.forEach((nodeId, i) => {
      const x = baseX + (i - (ids.length - 1) / 2) * COLLISION_X_OFFSET;
      positions.push({ nodeId, col: c, depth: d, x, y: baseY });
    });
  }

  return { nodes: positions, edges: treeEdges, viewBoxW: VIEWBOX_W, viewBoxH: VIEWBOX_H };
}

export const NETWORK_MAP_NODE_W = 96;
export const NETWORK_MAP_NODE_H = 44;
