import type { Diagram, DiagramNode, Layer } from "@/content/projects";
import { cn } from "@/lib/utils";

/**
 * A project's architecture drawn as a mimic-panel schematic: nodes on a small
 * grid, orthogonal wires between them. Pure SVG with no hooks, so it renders on
 * the server and inside client components alike.
 *
 * Two layouts render from the same data: a wide one (flow left → right, with a
 * detail line and wire labels) for sm+ screens, and a tall one (flow top →
 * bottom, labels only) for phones, so text never shrinks below legibility.
 */

const LAYER_STROKE: Record<Layer, string> = {
  client: "var(--wire-client)",
  service: "var(--wire-service)",
  data: "var(--wire-data)",
  external: "var(--wire-external)",
};

export const LAYER_LABEL: Record<Layer, string> = {
  client: "Interface",
  service: "Service",
  data: "Data",
  external: "Outside service",
};

interface Geometry {
  nodeW: number;
  nodeH: number;
  /** Distance between columns along the flow. */
  stepFlow: number;
  /** Distance between rows across the flow. */
  stepCross: number;
  pad: number;
  detailed: boolean;
}

type Orientation = "wide" | "tall";

const GEOMETRY: Record<Orientation, Geometry> = {
  wide: { nodeW: 136, nodeH: 46, stepFlow: 180, stepCross: 66, pad: 14, detailed: true },
  tall: { nodeW: 100, nodeH: 32, stepFlow: 60, stepCross: 108, pad: 10, detailed: false },
};

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
  node: DiagramNode;
}

interface Point {
  x: number;
  y: number;
}

function layout(diagram: Diagram, g: Geometry, o: Orientation) {
  const boxes = new Map<string, Box>();
  let width = 0;
  let height = 0;
  for (const node of diagram.nodes) {
    const flow = node.col * g.stepFlow;
    const cross = node.row * g.stepCross;
    const x = g.pad + (o === "wide" ? flow : cross);
    const y = g.pad + (o === "wide" ? cross : flow);
    boxes.set(node.id, { x, y, w: g.nodeW, h: g.nodeH, node });
    width = Math.max(width, x + g.nodeW);
    height = Math.max(height, y + g.nodeH);
  }
  return { boxes, width: width + g.pad, height: height + g.pad };
}

const cx = (b: Box) => b.x + b.w / 2;
const cy = (b: Box) => b.y + b.h / 2;

/** Orthogonal route from a to b. Flow edges leave along the flow and share a trunk just past the source. */
function route(a: Box, b: Box, g: Geometry, o: Orientation): Point[] {
  if (a.node.col === b.node.col) {
    // Neighbours across the flow: one straight segment between facing edges.
    if (o === "wide") {
      const down = b.y > a.y;
      return [
        { x: cx(a), y: down ? a.y + a.h : a.y },
        { x: cx(b), y: down ? b.y : b.y + b.h },
      ];
    }
    const right = b.x > a.x;
    return [
      { x: right ? a.x + a.w : a.x, y: cy(a) },
      { x: right ? b.x : b.x + b.w, y: cy(b) },
    ];
  }

  const forward = b.node.col > a.node.col;
  const [p, q] = forward ? [a, b] : [b, a];
  let points: Point[];
  if (o === "wide") {
    const s = { x: p.x + p.w, y: cy(p) };
    const e = { x: q.x, y: cy(q) };
    const trunk = s.x + (g.stepFlow - g.nodeW) / 2;
    points = s.y === e.y ? [s, e] : [s, { x: trunk, y: s.y }, { x: trunk, y: e.y }, e];
  } else {
    const s = { x: cx(p), y: p.y + p.h };
    const e = { x: cx(q), y: q.y };
    const trunk = s.y + (g.stepFlow - g.nodeH) / 2;
    points = s.x === e.x ? [s, e] : [s, { x: s.x, y: trunk }, { x: e.x, y: trunk }, e];
  }
  return forward ? points : points.reverse();
}

function arrowhead(tip: Point, from: Point) {
  const dx = Math.sign(tip.x - from.x);
  const dy = Math.sign(tip.y - from.y);
  const len = 6;
  const half = 3.25;
  const bx = tip.x - dx * len;
  const by = tip.y - dy * len;
  return `${tip.x},${tip.y} ${bx - dy * half},${by + dx * half} ${bx + dy * half},${by - dx * half}`;
}

function describe(diagram: Diagram, title: string) {
  const name = (id: string) => diagram.nodes.find((n) => n.id === id)?.label ?? id;
  const parts = diagram.nodes.map((n) => (n.detail ? `${n.label} (${n.detail})` : n.label)).join(", ");
  const links = diagram.edges
    .map((e) => (e.both ? `${name(e.from)} and ${name(e.to)} talk both ways` : `${name(e.from)} to ${name(e.to)}`))
    .join("; ");
  return `Architecture of ${title}. Parts: ${parts}. Connections: ${links}.`;
}

function SchematicSvg({ diagram, orientation, className }: { diagram: Diagram; orientation: Orientation; className?: string }) {
  const g = GEOMETRY[orientation];
  const { boxes, width, height } = layout(diagram, g, orientation);

  const edges = diagram.edges.flatMap((edge, i) => {
    const a = boxes.get(edge.from);
    const b = boxes.get(edge.to);
    if (!a || !b) return [];
    const points = route(a, b, g, orientation);
    const d = `M${points.map((p) => `${p.x} ${p.y}`).join("L")}`;
    const last = points.length - 1;
    // Label sits on the final segment: above it when horizontal, beside it when vertical.
    const segA = points[last - 1];
    const segB = points[last];
    const vertical = segA.x === segB.x;
    const label = g.detailed && edge.label ? { x: (segA.x + segB.x) / 2, y: (segA.y + segB.y) / 2, vertical, text: edge.label } : null;
    return [{ key: `${edge.from}-${edge.to}-${i}`, d, points, both: edge.both, label, delay: i * 0.12 }];
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      aria-hidden="true"
      className={cn("mx-auto h-auto w-full", className)}
      style={{ maxWidth: width }}
    >
      <g className="text-muted-foreground/70" fill="currentColor" stroke="currentColor">
        {edges.map((edge) => {
          const n = edge.points.length;
          return (
            <g key={edge.key}>
              <path d={edge.d} fill="none" strokeWidth={1.25} />
              <polygon points={arrowhead(edge.points[n - 1], edge.points[n - 2])} stroke="none" />
              {edge.both && <polygon points={arrowhead(edge.points[0], edge.points[1])} stroke="none" />}
            </g>
          );
        })}
      </g>

      {edges.map((edge) => (
        <path
          key={`pulse-${edge.key}`}
          d={edge.d}
          pathLength={1}
          className="wire-pulse"
          strokeWidth={2}
          strokeLinecap="round"
          style={{ animationDelay: `${edge.delay}s` }}
        />
      ))}

      {edges.map(
        (edge) =>
          edge.label && (
            <text
              key={`label-${edge.key}`}
              x={edge.label.vertical ? edge.label.x + 7 : edge.label.x}
              y={edge.label.vertical ? edge.label.y + 3 : edge.label.y - 5}
              textAnchor={edge.label.vertical ? "start" : "middle"}
              className="fill-muted-foreground font-mono"
              fontSize={9}
              letterSpacing="0.04em"
            >
              {edge.label.text}
            </text>
          ),
      )}

      {[...boxes.values()].map(({ x, y, w, h, node }) => {
        const external = node.layer === "external";
        return (
          <g key={node.id}>
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              rx={3}
              fill="var(--plate)"
              stroke={LAYER_STROKE[node.layer]}
              strokeWidth={1.25}
              strokeDasharray={external ? "4 3" : undefined}
            />
            {g.detailed ? (
              <>
                <text x={x + 10} y={y + 19} className="fill-foreground font-mono" fontSize={11} fontWeight={500}>
                  {node.label}
                </text>
                {node.detail && (
                  <text x={x + 10} y={y + 34} className="fill-muted-foreground font-mono" fontSize={9.5}>
                    {node.detail}
                  </text>
                )}
              </>
            ) : (
              <text x={x + w / 2} y={y + h / 2 + 3.5} textAnchor="middle" className="fill-foreground font-mono" fontSize={10.5} fontWeight={500}>
                {node.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

interface SchematicProps {
  diagram: Diagram;
  /** Project name, used in the text alternative. */
  title: string;
  className?: string;
}

export function Schematic({ diagram, title, className }: SchematicProps) {
  return (
    <figure role="img" aria-label={describe(diagram, title)} className={cn("m-0", className)}>
      <SchematicSvg diagram={diagram} orientation="wide" className="hidden sm:block" />
      <SchematicSvg diagram={diagram} orientation="tall" className="sm:hidden" />
    </figure>
  );
}

/** Key to the node colours, shared by the Projects intro and the write-ups. */
export function SchematicLegend({ className }: { className?: string }) {
  const layers: Layer[] = ["client", "service", "data", "external"];
  return (
    <ul className={cn("flex flex-wrap gap-x-5 gap-y-2", className)} aria-label="Diagram key">
      {layers.map((layer) => (
        <li key={layer} className="flex items-center gap-2 font-mono text-[0.6875rem] text-muted-foreground">
          <svg width="18" height="10" viewBox="0 0 18 10" aria-hidden="true">
            <rect
              x="0.75"
              y="0.75"
              width="16.5"
              height="8.5"
              rx="2"
              fill="var(--plate)"
              stroke={LAYER_STROKE[layer]}
              strokeWidth="1.5"
              strokeDasharray={layer === "external" ? "3 2" : undefined}
            />
          </svg>
          {LAYER_LABEL[layer]}
        </li>
      ))}
    </ul>
  );
}

export { LAYER_STROKE };
