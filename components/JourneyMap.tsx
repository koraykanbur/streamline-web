"use client";

import { useEffect, useRef, useState } from "react";
import { MotionValue, useMotionValueEvent } from "framer-motion";
import { LAND_DOTS, MAP_H, MAP_W } from "@/lib/map-dots";
import { CAM, Cam, ROUTES, supplierPaths, pts } from "@/lib/geo";
import { MAP_PLANE, MAP_SHIP, MAP_TRUCK } from "./glyphs";

/* ───────────────── timing helpers ───────────────── */
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpCam = (a: Cam, b: Cam, t: number): Cam => [
  lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t), lerp(a[3], b[3], t),
];

function cameraAt(p: number): Cam {
  if (p < 0.07) return CAM.world;
  if (p < 0.13) return lerpCam(CAM.world, CAM.china, ease(seg(p, 0.07, 0.13)));
  if (p < 0.44) return CAM.china;
  if (p < 0.5) return lerpCam(CAM.china, CAM.world, ease(seg(p, 0.44, 0.5)));
  if (p < 0.65) return CAM.world;
  if (p < 0.71) return lerpCam(CAM.world, CAM.gcc, ease(seg(p, 0.65, 0.71)));
  return CAM.gcc;
}

/* ───────────────── scene description ───────────────── */
type Node = { key: string; x: number; y: number; kind: "supplier" | "hub" | "port" | "air" | "customs" | "door"; label?: string; labelSide?: "l" | "r" | "t" | "b" };

const NODES: Node[] = [
  ...supplierPaths.map((s) => ({ key: s.id, x: s.pt[0], y: s.pt[1], kind: "supplier" as const, label: s.label ? s.name : undefined, labelSide: (s.id === "cd" || s.id === "wh" ? "t" : "r") as Node["labelSide"] })),
  { key: "hub", x: pts.hub[0], y: pts.hub[1], kind: "hub", label: "Shenzhen", labelSide: "b" },
  { key: "jea", x: pts.jea[0], y: pts.jea[1], kind: "customs", label: "Jebel Ali", labelSide: "l" },
  { key: "dxb", x: pts.dxb[0], y: pts.dxb[1], kind: "customs", label: "DXB", labelSide: "t" },
  { key: "dmm", x: pts.dmm[0], y: pts.dmm[1], kind: "customs", label: "Dammam", labelSide: "t" },
  { key: "ruh", x: pts.ruh[0], y: pts.ruh[1], kind: "customs", label: "RUH", labelSide: "t" },
  ...pts.doors.map((d) => ({ key: d.id, x: d.pt[0], y: d.pt[1], kind: "door" as const, label: d.name, labelSide: (d.id === "d-auh" ? "b" : d.id === "d-ruh" ? "b" : "r") as Node["labelSide"] })),
];

type Lit = { key: string; d: string; strong?: boolean };
const LIT: Lit[] = [
  { key: "request", d: ROUTES.request },
  ...supplierPaths.map((s) => ({ key: `sup-${s.id}`, d: s.d })),
  { key: "air", d: ROUTES.air, strong: true },
  { key: "airKsa", d: ROUTES.airKsa, strong: true },
  { key: "sea", d: ROUTES.sea, strong: true },
  { key: "seaKsa", d: ROUTES.seaKsa, strong: true },
  ...ROUTES.lastMile.map((l, i) => ({ key: `lm-${i}`, d: l.d })),
];

type Vehicle = { key: string; path: string; glyph: string; size: number };
const VEHICLES: Vehicle[] = [
  ...supplierPaths.map((s) => ({ key: `tr-${s.id}`, path: `sup-${s.id}`, glyph: MAP_TRUCK, size: 1.15 })),
  { key: "plane", path: "air", glyph: MAP_PLANE, size: 1.5 },
  { key: "plane2", path: "airKsa", glyph: MAP_PLANE, size: 1.5 },
  { key: "ship", path: "sea", glyph: MAP_SHIP, size: 1.4 },
  { key: "ship2", path: "seaKsa", glyph: MAP_SHIP, size: 1.4 },
  ...ROUTES.lastMile.map((_, i) => ({ key: `lmt-${i}`, path: `lm-${i}`, glyph: MAP_TRUCK, size: 1.15 })),
];

/** Everything that changes with scroll, as a pure function of progress p. */
function stateAt(p: number) {
  const draw: Record<string, number> = {};
  const lineOpacity: Record<string, number> = {};
  const node: Record<string, number> = {};
  const veh: Record<string, { t: number; o: number }> = {};

  // idea: the request travels from the customer's door to China
  draw.request = ease(seg(p, 0.015, 0.075));
  lineOpacity.request = 1 - seg(p, 0.1, 0.16) * 0.85;

  // source + collect
  supplierPaths.forEach((s, i) => {
    const k = `sup-${s.id}`;
    const o = 0.11 + i * 0.008;
    node[s.id] = seg(p, o, o + 0.02);
    draw[k] = ease(seg(p, o + 0.02, o + 0.06));
    lineOpacity[k] = 0.55 + 0.45 * seg(p, 0.23, 0.26) - 0.6 * seg(p, 0.42, 0.48);
    const to = 0.24 + i * 0.004;
    const t = ease(seg(p, to, to + 0.075));
    veh[`tr-${s.id}`] = { t, o: seg(p, to - 0.005, to) * (1 - seg(p, to + 0.075, to + 0.085)) };
  });
  node.hub = seg(p, 0.1, 0.12);

  // split: air + sea at the same time
  draw.air = ease(seg(p, 0.48, 0.57));
  draw.airKsa = ease(seg(p, 0.49, 0.585));
  draw.sea = seg(p, 0.48, 0.63);
  draw.seaKsa = seg(p, 0.6, 0.655);
  for (const k of ["air", "airKsa", "sea", "seaKsa"]) lineOpacity[k] = 1;
  veh.plane = { t: draw.air, o: seg(p, 0.48, 0.485) * (1 - seg(p, 0.575, 0.585)) };
  veh.plane2 = { t: draw.airKsa, o: seg(p, 0.49, 0.495) * (1 - seg(p, 0.59, 0.6)) };
  veh.ship = { t: draw.sea, o: seg(p, 0.48, 0.485) * (1 - seg(p, 0.635, 0.645)) };
  veh.ship2 = { t: draw.seaKsa, o: seg(p, 0.6, 0.605) * (1 - seg(p, 0.66, 0.67)) };

  // customs checkpoints
  ["jea", "dxb", "dmm", "ruh"].forEach((k, i) => {
    node[k] = seg(p, 0.52 + i * 0.02, 0.56 + i * 0.02);
    node[`${k}-check`] = seg(p, 0.72 + i * 0.015, 0.75 + i * 0.015);
  });

  // last mile
  ROUTES.lastMile.forEach((_, i) => {
    const o = 0.82 + i * 0.012;
    draw[`lm-${i}`] = ease(seg(p, o, o + 0.07));
    lineOpacity[`lm-${i}`] = 1;
    veh[`lmt-${i}`] = { t: draw[`lm-${i}`], o: seg(p, o, o + 0.005) * (1 - seg(p, o + 0.07, o + 0.08)) };
  });

  // doors: Dubai is visible from the start (that's the customer), others arrive at the end
  node["d-dxb"] = 1;
  node["d-dxb-done"] = seg(p, 0.9, 0.93);
  node["d-auh"] = seg(p, 0.72, 0.75);
  node["d-auh-done"] = seg(p, 0.91, 0.94);
  node["d-ruh"] = seg(p, 0.72, 0.75);
  node["d-ruh-done"] = seg(p, 0.92, 0.95);

  // label visibility depends on the camera
  const labels = {
    china: seg(p, 0.11, 0.14) * (1 - seg(p, 0.44, 0.47)),
    gcc: seg(p, 0.68, 0.72),
    world: seg(p, 0.5, 0.53) * (1 - seg(p, 0.64, 0.67)),
    hubAlways: 1 - seg(p, 0.66, 0.7),
  };
  return { draw, lineOpacity, node, veh, labels };
}

/* ───────────────── component ───────────────── */

export default function JourneyMap({ progress }: { progress: MotionValue<number> }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const size = useRef({ w: 1, h: 1 });
  const lens = useRef<Record<string, number>>({});
  const last = useRef(-1);
  const [fine, setFine] = useState<{ china: string; gcc: string } | null>(null);

  useEffect(() => {
    let alive = true;
    import("@/lib/map-fine").then((m) => alive && setFine({ china: m.FINE_CHINA, gcc: m.FINE_GCC }));
    return () => { alive = false; };
  }, []);
  useEffect(() => {
    if (fine) render(progress.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fine]);

  const render = (p: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const focus = cameraAt(p);
    // expand the focus box to the container's aspect ratio
    const A = size.current.w / size.current.h;
    let [cx, cy, cw, ch] = focus;
    if (cw / ch < A) { const nw = ch * A; cx -= (nw - cw) / 2; cw = nw; }
    else { const nh = cw / A; cy -= (nh - ch) / 2; ch = nh; }
    svg.setAttribute("viewBox", `${cx.toFixed(2)} ${cy.toFixed(2)} ${cw.toFixed(2)} ${ch.toFixed(2)}`);
    // user units per screen pixel
    const u = cw / size.current.w;
    const st = stateAt(p);

    // swap coarse dots for fine dots as we zoom in
    const zoom = CAM.world[2] / focus[2];
    const fine = clamp((zoom - 1.8) / 1.2);
    const dots = svg.querySelector<SVGPathElement>("[data-dots]")!;
    dots.style.opacity = String(1 - fine);
    svg.querySelectorAll<SVGPathElement>("[data-fine]").forEach((el) => {
      el.style.opacity = String(fine);
      el.setAttribute("stroke-width", String(2.1 * u));
    });

    svg.style.setProperty("--u", String(u));
    dots.setAttribute("stroke-width", String(2 * u));
    svg.querySelectorAll<SVGGElement>("[data-sw]").forEach((g) => g.setAttribute("stroke-width", String(Number(g.dataset.sw) * u)));

    for (const l of LIT) {
      const t = st.draw[l.key] ?? 0;
      const op = clamp(st.lineOpacity[l.key] ?? 1);
      svg.querySelectorAll<SVGPathElement>(`[data-lit="${l.key}"]`).forEach((el) => {
        el.setAttribute("stroke-dashoffset", String(100 * (1 - t)));
        el.style.opacity = String(t > 0 ? op : 0);
      });
    }

    for (const n of NODES) {
      const g = svg.querySelector<SVGGElement>(`[data-node="${n.key}"]`);
      if (!g) continue;
      const v = st.node[n.key] ?? 0;
      g.setAttribute("transform", `translate(${n.x} ${n.y}) scale(${u})`);
      g.style.opacity = String(v);
      const c = g.querySelector<SVGElement>("[data-check]");
      if (c) c.style.setProperty("--t", String(st.node[`${n.key}-check`] ?? st.node[`${n.key}-done`] ?? 0));
      const lab = g.querySelector<SVGTextElement>("text");
      if (lab) {
        const grp = n.kind === "supplier" || n.key === "hub" ? st.labels.china : st.labels.gcc;
        lab.style.opacity = String(n.key === "d-dxb" ? Math.max(grp, 1 - seg(p, 0.06, 0.1)) : grp);
      }
    }
    svg.querySelectorAll<SVGGElement>("[data-worldlabel]").forEach((g) => {
      g.setAttribute("transform", `translate(${g.dataset.x} ${g.dataset.y}) scale(${u})`);
      g.style.opacity = String(st.labels.world);
    });

    for (const v of VEHICLES) {
      const el = svg.querySelector<SVGGElement>(`[data-veh="${v.key}"]`);
      const path = svg.querySelector<SVGPathElement>(`[data-geom="${v.path}"]`);
      if (!el || !path) continue;
      const s = st.veh[v.key] ?? { t: 0, o: 0 };
      if (s.o <= 0.001) {
        el.style.opacity = "0";
        continue;
      }
      const L = (lens.current[v.path] ??= path.getTotalLength());
      const at = clamp(s.t) * L;
      const a = path.getPointAtLength(at);
      const b = path.getPointAtLength(Math.min(L, at + 0.5));
      const b0 = at + 0.5 > L ? path.getPointAtLength(at - 0.5) : a;
      const ang = (Math.atan2(b.y - b0.y, b.x - b0.x) * 180) / Math.PI;
      el.setAttribute("transform", `translate(${a.x} ${a.y}) rotate(${ang}) scale(${u * v.size})`);
      el.style.opacity = String(s.o);
    }
  };

  useMotionValueEvent(progress, "change", (p) => {
    if (Math.abs(p - last.current) < 0.0001) return;
    last.current = p;
    render(p);
  });

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const ro = new ResizeObserver(([e]) => {
      size.current = { w: e.contentRect.width, h: e.contentRect.height };
      render(progress.get());
    });
    ro.observe(svg);
    render(progress.get());
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <svg
      ref={svgRef}
      className="journey-map h-full w-full"
      viewBox={CAM.world.join(" ")}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Map of the shipment route from suppliers across China to Shenzhen, then by air or sea to the UAE and Saudi Arabia, through customs, and on to the customer's door."
    >
      <rect x={-500} y={-500} width={MAP_W + 1000} height={MAP_H + 1000} fill="transparent" />
      <path data-dots d={LAND_DOTS} stroke="#8A9BB0" strokeOpacity={0.5} strokeLinecap="round" fill="none" />
      {fine && (
        <g stroke="#8A9BB0" strokeOpacity={0.55} strokeLinecap="round" fill="none">
          <path data-fine d={fine.china} style={{ opacity: 0 }} />
          <path data-fine d={fine.gcc} style={{ opacity: 0 }} />
        </g>
      )}

      {/* geometry for measuring vehicle positions */}
      <g fill="none" stroke="none">
        {LIT.map((l) => (
          <path key={l.key} data-geom={l.key} d={l.d} />
        ))}
      </g>

      {/* unlit route ghosts so the full network is faintly visible */}
      <g data-sw="1" fill="none" stroke="#8A9BB0" strokeOpacity={0.22}>
        {LIT.filter((l) => l.key !== "request").map((l) => (
          <path key={l.key} d={l.d} />
        ))}
      </g>

      {/* glow */}
      <g data-sw="7" fill="none" stroke="#C9DAF2" strokeOpacity={0.16} strokeLinecap="round">
        {LIT.filter((l) => l.strong).map((l) => (
          <path key={l.key} data-lit={l.key} d={l.d} pathLength={100} strokeDasharray="100 100" strokeDashoffset={100} style={{ opacity: 0 }} />
        ))}
      </g>
      {/* lit routes */}
      <g data-sw="1.6" fill="none" stroke="#FFFFFF" strokeLinecap="round">
        {LIT.map((l) => (
          <path key={l.key} data-lit={l.key} d={l.d} pathLength={100} strokeDasharray="100 100" strokeDashoffset={100} style={{ opacity: 0 }} />
        ))}
      </g>

      {/* nodes (drawn in screen pixels, scaled by 1/zoom) */}
      {NODES.map((n) => (
        <g key={n.key} data-node={n.key} style={{ opacity: 0 }}>
          <NodeMark n={n} />
        </g>
      ))}

      {/* region labels in the wide view */}
      {[
        { t: "China", x: pts.hub[0], y: pts.hub[1], dx: 14, dy: 26, a: "start" as const },
        { t: "UAE", x: pts.doors[0].pt[0], y: pts.doors[0].pt[1], dx: 0, dy: 30, a: "middle" as const },
        { t: "Saudi Arabia", x: pts.doors[2].pt[0], y: pts.doors[2].pt[1], dx: 0, dy: 30, a: "middle" as const },
      ].map((l) => (
        <g key={l.t} data-worldlabel data-x={l.x} data-y={l.y} style={{ opacity: 0 }}>
          <text x={l.dx} y={l.dy} textAnchor={l.a} className="map-label">{l.t}</text>
        </g>
      ))}

      {/* vehicles */}
      {VEHICLES.map((v) => (
        <g key={v.key} data-veh={v.key} style={{ opacity: 0 }}>
          <circle r={10} fill="#0A1628" opacity={0.9} />
          <path d={v.glyph} fill="#FFFFFF" />
        </g>
      ))}
    </svg>
  );
}

function NodeMark({ n }: { n: Node }) {
  const label = n.label ? (
    <text
      className="map-label"
      x={n.labelSide === "l" ? -12 : n.labelSide === "r" ? 12 : 0}
      y={n.labelSide === "t" ? -14 : n.labelSide === "b" ? 22 : 4}
      textAnchor={n.labelSide === "l" ? "end" : n.labelSide === "r" ? "start" : "middle"}
    >
      {n.label}
    </text>
  ) : null;

  switch (n.kind) {
    case "supplier":
      return (
        <>
          <rect x={-4} y={-4} width={8} height={8} fill="#0A1628" stroke="#FFFFFF" strokeWidth={1.4} transform="rotate(45)" />
          {label}
        </>
      );
    case "hub":
      return (
        <>
          <circle r={18} fill="none" stroke="#FFFFFF" strokeOpacity={0.25} className="pulse-ring" />
          <circle r={9} fill="#0A1628" stroke="#FFFFFF" strokeWidth={1.6} />
          <circle r={3.5} fill="#FFFFFF" />
          {label}
        </>
      );
    case "customs":
      return (
        <>
          <circle r={9} fill="#0A1628" stroke="#FFFFFF" strokeWidth={1.4} />
          <g data-check className="map-check">
            <circle r={9} fill="#FFFFFF" />
            <path d="M-4 0.3 -1.2 3 4.2 -2.6" fill="none" stroke="#0A1628" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" pathLength={1} />
          </g>
          {label}
        </>
      );
    case "door":
      return (
        <>
          <circle r={16} fill="none" stroke="#FFFFFF" strokeOpacity={0.3} className="pulse-ring" />
          <rect x={-7} y={-7} width={14} height={14} rx={2} fill="#0A1628" stroke="#FFFFFF" strokeWidth={1.4} />
          <path d="M-3 4V-3.5h6V4" fill="none" stroke="#FFFFFF" strokeWidth={1.2} />
          <g data-check className="map-check">
            <rect x={-7} y={-7} width={14} height={14} rx={2} fill="#FFFFFF" />
            <path d="M-3.8 0.3 -1.2 3 4 -2.6" fill="none" stroke="#0A1628" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" pathLength={1} />
          </g>
          {label}
        </>
      );
    default:
      return null;
  }
}
