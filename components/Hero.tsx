"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { LAND_DOTS } from "@/lib/map-dots";
import { ROUTES, pts } from "@/lib/geo";
import { TIMELINES } from "@/lib/constants";
import { goToQuote, setBrief } from "@/lib/brief";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const mapY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const mapO = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0.35]);

  const routes = [
    { d: ROUTES.air, cls: "hero-route r1" },
    { d: ROUTES.airKsa, cls: "hero-route r2" },
    { d: ROUTES.sea, cls: "hero-route r3" },
    { d: ROUTES.seaKsa, cls: "hero-route r4" },
  ];

  return (
    <section ref={ref} className="relative flex min-h-[100svh] flex-col overflow-hidden bg-navy text-white">
      {/* map */}
      <motion.div style={{ y: mapY, opacity: mapO }} className="pointer-events-none absolute inset-x-0 bottom-0 top-16" aria-hidden>
        <svg viewBox="40 75 940 360" preserveAspectRatio="xMidYMin meet" className="absolute inset-0 h-full w-full">
          <path d={LAND_DOTS} stroke="#8A9BB0" strokeOpacity={0.45} strokeWidth={1.9} strokeLinecap="round" fill="none" />
          {routes.map((r) => (
            <g key={r.d}>
              <path d={r.d} fill="none" stroke="#C9DAF2" strokeOpacity={0.14} strokeWidth={6} pathLength={100} className={`${r.cls} hero-glow`} />
              <path d={r.d} fill="none" stroke="#FFFFFF" strokeWidth={1.3} pathLength={100} className={r.cls} />
              <path d={r.d} fill="none" stroke="#FFFFFF" strokeWidth={2.6} strokeLinecap="round" pathLength={100} className={`${r.cls} hero-comet`} />
            </g>
          ))}
          <HeroNode x={pts.hub[0]} y={pts.hub[1]} label="Shenzhen" anchor="start" dx={14} dy={4} delay={0} />
          <HeroNode x={pts.doors[0].pt[0]} y={pts.doors[0].pt[1]} label="Dubai" anchor="start" dx={10} dy={-12} delay={1.6} />
          <HeroNode x={pts.doors[2].pt[0]} y={pts.doors[2].pt[1]} label="Riyadh" anchor="end" dx={-8} dy={-12} delay={1.8} />
        </svg>
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-navy via-navy/80 to-transparent" aria-hidden />
      <div className="flex-1" />

      {/* copy */}
      <div className="relative mx-auto w-full max-w-page px-6 pb-14 sm:px-10 lg:pb-20">
        <div className="grid items-end gap-10 lg:grid-cols-[1.35fr_1fr]">
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[clamp(3.2rem,9vw,8.5rem)] font-semibold leading-[0.88] tracking-[-0.035em]"
          >
            From China
            <br />
            to your door.
          </motion.h1>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-md lg:pb-3"
          >
            <p className="text-lg leading-relaxed text-white/75">
              Source products across China. Coordinate logistics. Handle customs. Deliver directly to the UAE and Saudi Arabia.
            </p>
            <form
              className="mt-8 flex items-center gap-1 rounded-full bg-white p-1.5 pl-5 text-navy focus-within:ring-2 focus-within:ring-white/40"
              onSubmit={(e) => {
                e.preventDefault();
                const product = String(new FormData(e.currentTarget).get("product") ?? "").trim();
                if (product) setBrief({ product });
                goToQuote();
              }}
            >
              <label htmlFor="hero-product" className="sr-only">What do you need sourced?</label>
              <input
                id="hero-product"
                name="product"
                type="text"
                autoComplete="off"
                maxLength={120}
                placeholder="What do you need?"
                className="h-11 min-w-0 flex-1 bg-transparent text-base placeholder:text-slate-dark focus:outline-none"
              />
              <button type="submit" className="btn-dark !h-11 shrink-0 !px-5">Get a quote</button>
            </form>
            <p className="mt-3 text-sm text-white/55">
              Air about {TIMELINES.air}, sea about {TIMELINES.sea}, door to door.
            </p>
            <a href="#journey" className="mt-6 inline-flex items-center text-[0.95rem] font-medium text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline">
              Explore the journey
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden className="ml-2"><path d="M7 2v10M3 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HeroNode({ x, y, label, anchor, dx, dy, delay }: { x: number; y: number; label: string; anchor: "start" | "end"; dx: number; dy: number; delay: number }) {
  return (
    <g className="hero-node" style={{ animationDelay: `${delay}s` }}>
      <circle cx={x} cy={y} r={12} fill="none" stroke="#FFFFFF" strokeOpacity={0.35} className="pulse-ring" />
      <circle cx={x} cy={y} r={5} fill="#0A1628" stroke="#FFFFFF" strokeWidth={1.5} />
      <circle cx={x} cy={y} r={2} fill="#FFFFFF" />
      <text x={x + dx} y={y + dy} textAnchor={anchor} className="map-label" fontSize={11}>{label}</text>
    </g>
  );
}
