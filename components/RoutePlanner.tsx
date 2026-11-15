"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LAND_DOTS } from "@/lib/map-dots";
import { ROUTES, pts, type Pt } from "@/lib/geo";
import { FREIGHT } from "@/lib/journey";
import { TIMELINES } from "@/lib/constants";
import { goToQuote, setBrief, type Destination, type Mode } from "@/lib/brief";
import { IconPlane, IconShip } from "./glyphs";

type RouteDef = {
  /** main leg(s), drawn in order */
  legs: string[];
  lastMile: string;
  entry: { pt: Pt; name: string; short: string };
  door: { pt: Pt; name: string };
  chain: string[];
};

// Entry points match the journey map: Dubai airport / Jebel Ali for the UAE,
// Riyadh airport / Dammam for Saudi Arabia.
const DEFS: Record<Destination, Record<Mode, RouteDef>> = {
  UAE: {
    air: {
      legs: [ROUTES.air],
      lastMile: ROUTES.lastMile[3].d,
      entry: { pt: pts.dxb, name: "Dubai airport", short: "Dubai" },
      door: { pt: pts.doors[0].pt, name: "Your door" },
      chain: ["Supplier", "Shenzhen warehouse", "Flight", "Dubai airport", "Customs", "Your door"],
    },
    sea: {
      legs: [ROUTES.sea],
      lastMile: ROUTES.lastMile[0].d,
      entry: { pt: pts.jea, name: "Jebel Ali", short: "Jebel Ali" },
      door: { pt: pts.doors[0].pt, name: "Your door" },
      chain: ["Supplier", "Shenzhen warehouse", "Container ship", "Jebel Ali", "Customs", "Your door"],
    },
  },
  "Saudi Arabia": {
    air: {
      legs: [ROUTES.airKsa],
      lastMile: ROUTES.lastMile[4].d,
      entry: { pt: pts.ruh, name: "Riyadh airport", short: "Riyadh" },
      door: { pt: pts.doors[2].pt, name: "Your door" },
      chain: ["Supplier", "Shenzhen warehouse", "Flight", "Riyadh airport", "Customs", "Your door"],
    },
    sea: {
      legs: [ROUTES.seaTrunk, ROUTES.seaKsa],
      lastMile: ROUTES.lastMile[2].d,
      entry: { pt: pts.dmm, name: "Dammam", short: "Dammam" },
      door: { pt: pts.doors[2].pt, name: "Your door" },
      chain: ["Supplier", "Shenzhen warehouse", "Container ship", "Dammam", "Customs", "Your door"],
    },
  },
};

const DESTS: Destination[] = ["UAE", "Saudi Arabia"];
const MODES: Mode[] = ["air", "sea"];
const ALL_ROUTES = [ROUTES.air, ROUTES.airKsa, ROUTES.sea, ROUTES.seaKsa];

export default function RoutePlanner() {
  const [dest, setDest] = useState<Destination>("UAE");
  const [mode, setMode] = useState<Mode>("air");
  const reduce = useReducedMotion();
  const def = DEFS[dest][mode];
  const f = FREIGHT[mode];
  const key = `${dest}-${mode}`;

  const quote = () => {
    setBrief({ destination: dest, mode });
    goToQuote();
  };

  return (
    <section id="route" className="scroll-mt-16 bg-navy px-6 py-28 text-white sm:px-10 lg:py-36" aria-labelledby="route-title">
      <div className="mx-auto max-w-page">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow text-slate">Your route</p>
            <h2 id="route-title" className="mt-4 font-display text-[clamp(2.4rem,5.5vw,4.6rem)] font-semibold leading-[0.95] tracking-[-0.03em]">
              Pick a destination.
              <br />
              Pick a speed.
            </h2>
          </div>
          <p className="max-w-md text-lg leading-relaxed text-white/70 lg:justify-self-end">
            Every shipment starts in China and ends at your door. Choose where it's going and how fast, and see the route it takes.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:grid-cols-[0.8fr_1.2fr]">
          {/* controls + result */}
          <div className="flex flex-col bg-navy-2 p-6 sm:p-10">
            <Segmented label="Destination" value={dest} options={DESTS.map((d) => ({ value: d, label: d }))} onChange={setDest} />
            <div className="mt-6">
              <Segmented
                label="Shipping"
                value={mode}
                options={MODES.map((m) => ({ value: m, label: FREIGHT[m].label, Icon: m === "air" ? IconPlane : IconShip }))}
                onChange={setMode}
              />
            </div>

            <div className="mt-10 border-t border-white/10 pt-8" aria-live="polite">
              <p className="text-sm text-white/55">About</p>
              <motion.p
                key={key}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-[clamp(3rem,6vw,4.75rem)] font-semibold leading-none tracking-[-0.03em]"
              >
                {f.time}
              </motion.p>
              <p className="mt-3 text-white/75">
                door to door, by {mode} to {dest === "UAE" ? "the UAE" : "Saudi Arabia"}.
              </p>
              <p className="mt-1 text-white/55">{f.line}</p>
            </div>

            <div className="mt-auto pt-10">
              <button type="button" onClick={quote} className="btn-light">Get a quote for this route</button>
              <p className="mt-4 text-xs leading-relaxed text-white/45">{TIMELINES.note}</p>
            </div>
          </div>

          {/* map + chain */}
          <div className="flex flex-col bg-navy-2">
            <div className="relative flex-1">
              <svg viewBox="20 125 965 410" className="block h-full min-h-[220px] w-full" role="img" aria-label={`Route from Shenzhen to ${def.entry.name} by ${mode}`}>
                <path d={LAND_DOTS} stroke="#8A9BB0" strokeOpacity={0.4} strokeWidth={1.9} strokeLinecap="round" fill="none" />
                {ALL_ROUTES.map((d) => (
                  <path key={d} d={d} fill="none" stroke="#FFFFFF" strokeOpacity={0.12} strokeWidth={1} />
                ))}
                <g key={key}>
                  {def.legs.map((d, n) => (
                    <motion.path
                      key={d}
                      d={d}
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth={2.2}
                      strokeLinecap="round"
                      initial={{ pathLength: reduce ? 1 : 0 }}
                      animate={{ pathLength: 1 }}
                      transition={reduce ? { duration: 0 } : { duration: n === 0 ? 1.1 : 0.4, delay: n === 0 ? 0 : 1.1, ease: [0.65, 0, 0.35, 1] }}
                    />
                  ))}
                  <motion.path
                    d={def.lastMile}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth={1.8}
                    strokeDasharray="2 3"
                    initial={{ opacity: reduce ? 1 : 0 }}
                    animate={{ opacity: 1 }}
                    transition={reduce ? { duration: 0 } : { delay: 1.4, duration: 0.4 }}
                  />
                  <Node pt={pts.hub} label="Shenzhen" anchor="start" dx={14} dy={4} delay={0} reduce={!!reduce} below />
                  <Node pt={def.entry.pt} label={def.entry.short} anchor="end" dx={-13} dy={-10} delay={1.3} reduce={!!reduce} />
                </g>
              </svg>
            </div>
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-white/10 px-6 py-6 text-sm sm:px-10">
              {def.chain.map((c, n) => (
                <li key={c} className="flex items-center gap-2">
                  {n > 0 && <span className="text-white/30" aria-hidden>→</span>}
                  <motion.span
                    key={`${key}-${c}`}
                    initial={reduce ? false : { opacity: 0.25 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: reduce ? 0 : 0.15 + n * 0.22, duration: 0.3 }}
                    className={`rounded-full border px-3 py-1 ${n === def.chain.length - 1 ? "border-white bg-white text-navy" : "border-white/20 text-white/85"}`}
                  >
                    {c}
                  </motion.span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <p className="mt-4 text-sm text-white/45">Going somewhere else in the UAE or Saudi Arabia? Tell us in the quote and we'll route it.</p>
      </div>
    </section>
  );
}

function Segmented<T extends string>({
  label, value, options, onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string; Icon?: typeof IconPlane }[];
  onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2.5 text-sm text-white/55">{label}</legend>
      <div className="grid grid-cols-2 gap-1 rounded-full bg-white/[0.07] p-1">
        {options.map((o) => {
          const on = o.value === value;
          return (
            <label
              key={o.value}
              className={`flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full text-[0.95rem] font-medium transition-colors duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-white ${
                on ? "bg-white text-navy" : "text-white/75 hover:text-white"
              }`}
            >
              <input type="radio" name={label} value={o.value} checked={on} onChange={() => onChange(o.value)} className="sr-only" />
              {o.Icon && <o.Icon width={18} height={18} />}
              {o.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** `below`: on small screens, centre the label under the node so it cannot run off the map edge. */
function Node({ pt, label, anchor, dx, dy, delay, reduce, below }: { pt: Pt; label: string; anchor: "start" | "end"; dx: number; dy: number; delay: number; reduce: boolean; below?: boolean }) {
  return (
    <motion.g initial={{ opacity: reduce ? 1 : 0 }} animate={{ opacity: 1 }} transition={reduce ? { duration: 0 } : { delay, duration: 0.5 }}>
      <circle cx={pt[0]} cy={pt[1]} r={16} fill="none" stroke="#FFFFFF" strokeOpacity={0.35} className="pulse-ring" />
      <circle cx={pt[0]} cy={pt[1]} r={7} fill="#0F1F37" stroke="#FFFFFF" strokeWidth={2} />
      <circle cx={pt[0]} cy={pt[1]} r={2.8} fill="#FFFFFF" />
      <text x={pt[0] + dx} y={pt[1] + dy} textAnchor={anchor} className={`map-label route-label ${below ? "hidden sm:block" : ""}`}>{label}</text>
      {below && <text x={pt[0]} y={pt[1] + 44} textAnchor="middle" className="map-label route-label sm:hidden">{label}</text>}
    </motion.g>
  );
}
