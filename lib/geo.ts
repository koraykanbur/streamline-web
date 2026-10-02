// Map projection + the places and routes drawn on the journey map.
// Projection constants must match scripts/generate-map.mjs.

const LON0 = 34;
const LAT1 = 44;
const KX = 1000 / (124 - 34);
const KY = KX / Math.cos((22 * Math.PI) / 180);

export type Pt = [number, number];

export function project(lon: number, lat: number): Pt {
  return [(lon - LON0) * KX, (LAT1 - lat) * KY];
}

export type Place = { id: string; name: string; lon: number; lat: number; label?: boolean };

export const HUB = { id: "szx", name: "Shenzhen", lon: 114.06, lat: 22.54 };
export const PORT_CN = { id: "yantian", name: "Yantian port", lon: 114.27, lat: 22.58 };

// Supplier cities. Shenzhen is the hub; suppliers are anywhere in China.
export const SUPPLIERS: Place[] = [
  { id: "gz", name: "Guangzhou", lon: 113.26, lat: 23.13 },
  { id: "zs", name: "Zhongshan", lon: 113.0, lat: 22.2 },
  { id: "st", name: "Shantou", lon: 116.68, lat: 23.35 },
  { id: "xm", name: "Xiamen", lon: 118.09, lat: 24.48, label: true },
  { id: "yw", name: "Yiwu", lon: 120.07, lat: 29.31, label: true },
  { id: "nb", name: "Ningbo", lon: 121.55, lat: 29.87 },
  { id: "sh", name: "Shanghai", lon: 121.47, lat: 31.23, label: true },
  { id: "sz2", name: "Suzhou", lon: 120.58, lat: 31.3 },
  { id: "wh", name: "Wuhan", lon: 114.3, lat: 30.59, label: true },
  { id: "cd", name: "Chengdu", lon: 104.07, lat: 30.67, label: true },
];

export const DXB = { id: "dxb", name: "Dubai airport", lon: 55.36, lat: 25.25 };
export const RUH = { id: "ruh", name: "Riyadh airport", lon: 46.7, lat: 24.96 };
export const JEA = { id: "jea", name: "Jebel Ali", lon: 55.03, lat: 25.01 };
export const DMM = { id: "dmm", name: "Dammam", lon: 50.1, lat: 26.43 };

export const DOORS: Place[] = [
  { id: "d-dxb", name: "Dubai", lon: 55.62, lat: 25.02, label: true },
  { id: "d-auh", name: "Abu Dhabi", lon: 54.45, lat: 24.42, label: true },
  { id: "d-ruh", name: "Riyadh", lon: 46.95, lat: 24.5, label: true },
];

// ── path helpers ───────────────────────────────────────────────

const f = (n: number) => n.toFixed(1);

/** Smooth path through points (Catmull-Rom → cubic Bézier). */
export function smoothPath(pts: Pt[], tension = 0.5): string {
  if (pts.length < 2) return "";
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const t = tension / 3;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t];
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}

/** Arc between two places; `lift` bends the curve north (in map units). */
export function arcPath(a: Pt, b: Pt, lift: number): string {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2 - lift;
  return `M${f(a[0])} ${f(a[1])}Q${f(mx)} ${f(my)} ${f(b[0])} ${f(b[1])}`;
}

const P = (p: { lon: number; lat: number }) => project(p.lon, p.lat);

export const hubPt = P(HUB);

export const supplierPaths = SUPPLIERS.map((s) => {
  const a = P(s);
  const dist = Math.hypot(a[0] - hubPt[0], a[1] - hubPt[1]);
  return { ...s, pt: a, d: arcPath(a, hubPt, Math.min(dist * 0.18, 14)) };
});

// Sea lane: Yantian → South China Sea → Malacca → Indian Ocean → Hormuz → Jebel Ali
const seaMain: [number, number][] = [
  [114.27, 22.58], [114.6, 21.4], [112.6, 17.2], [109.9, 12.2], [106.6, 6.6],
  [104.4, 1.9], [101.6, 2.9], [98.6, 5.3], [95.2, 6.3], [88, 6.1], [81.6, 5.5],
  [76.2, 8.4], [68.2, 14.4], [61.6, 20.9], [58.9, 23.6], [57.2, 25.8], [56.3, 26.45],
  [55.6, 25.75], [55.03, 25.01],
];
const seaToDammam: [number, number][] = [
  [56.3, 26.45], [54.6, 26.6], [52.6, 26.9], [51.2, 26.9], [50.1, 26.43],
];

export const ROUTES = {
  sea: smoothPath(seaMain.map(([lo, la]) => project(lo, la))),
  seaKsa: smoothPath(seaToDammam.map(([lo, la]) => project(lo, la))),
  air: arcPath(P(HUB), P(DXB), 120),
  airKsa: arcPath(P(HUB), P(RUH), 150),
  // The customer's request travels from their door to China
  request: arcPath(P(DOORS[0]), hubPt, 95),
  lastMile: [
    { from: P(JEA), to: P(DOORS[0]), d: arcPath(P(JEA), P(DOORS[0]), 2) },
    { from: P(JEA), to: P(DOORS[1]), d: arcPath(P(JEA), P(DOORS[1]), 4) },
    { from: P(DMM), to: P(DOORS[2]), d: arcPath(P(DMM), P(DOORS[2]), 10) },
    { from: P(DXB), to: P(DOORS[0]), d: arcPath(P(DXB), P(DOORS[0]), 1) },
    { from: P(RUH), to: P(DOORS[2]), d: arcPath(P(RUH), P(DOORS[2]), 1) },
  ],
};

export const pts = {
  hub: hubPt,
  port: P(PORT_CN),
  dxb: P(DXB),
  ruh: P(RUH),
  jea: P(JEA),
  dmm: P(DMM),
  doors: DOORS.map((d) => ({ ...d, pt: P(d) })),
};

// Camera focus boxes (x, y, w, h). The renderer expands each box to the
// container's aspect ratio, so the focus area always fills the frame.
export type Cam = [number, number, number, number];
export const CAM = {
  world: [55, 30, 930, 520] as Cam,
  china: [762, 130, 232, 150] as Cam,
  gcc: [122, 186, 140, 76] as Cam,
};
