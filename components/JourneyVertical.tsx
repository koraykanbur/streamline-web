"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useSpring } from "framer-motion";
import StageVignette from "./StageVignette";
import { STAGES, FREIGHT, type Stage } from "@/lib/journey";
import { TIMELINES, quoteHref } from "@/lib/constants";
import { IconPlane, IconShip } from "./glyphs";

/** Mobile (and reduced-motion) journey: a vertical route that lights up as you scroll. */
export default function JourneyVertical() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 70%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  return (
    <div className="bg-navy px-6 pb-24 pt-8 text-white sm:px-10">
      <div ref={ref} className="relative mx-auto max-w-xl">
        {/* spine */}
        <div className="absolute bottom-0 left-[7px] top-2 w-px bg-white/15" aria-hidden />
        <motion.div
          className="absolute bottom-0 left-[7px] top-2 w-px origin-top bg-white"
          style={{ scaleY: reduce ? 1 : scaleY }}
          aria-hidden
        />
        <ol className="relative space-y-20">
          {STAGES.map((s) => (
            <StageBlock key={s.id} s={s} />
          ))}
        </ol>
      </div>
    </div>
  );
}

function StageBlock({ s }: { s: Stage }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -25% 0px" });
  const reduce = useReducedMotion();
  const show = inView || reduce;

  return (
    <li ref={ref} className="relative pl-10">
      <span
        className={`absolute left-0 top-1.5 block h-[15px] w-[15px] rounded-full border transition-colors duration-500 ${show ? "border-white bg-white" : "border-white/40 bg-navy"}`}
        aria-hidden
      />
      <p className="text-sm text-slate">{s.where}</p>
      <div className="mb-5 mt-5 min-h-[90px] text-white">{show && <StageVignette id={s.id} />}</div>
      <h3 className="font-display text-[2.6rem] font-semibold leading-[0.95] tracking-[-0.02em]">{s.title}</h3>
      <p className="mt-4 text-lg">{s.lead}</p>
      <p className="mt-2 leading-relaxed text-white/65">{s.body}</p>

      {s.id === "split" && (
        <div className="mt-8 grid grid-cols-2 gap-3">
          {(["air", "sea"] as const).map((k) => {
            const f = FREIGHT[k];
            const Icon = k === "air" ? IconPlane : IconShip;
            return (
              <div key={k} className="rounded-lg border border-white/15 p-4">
                <Icon className="text-white" />
                <p className="mt-3 text-sm text-white/60">{f.label}</p>
                <p className="font-display text-xl font-semibold">{f.time}</p>
                <ul className="mt-3 space-y-1 text-[13px] text-white/60">
                  {f.path.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </div>
            );
          })}
          <p className="col-span-2 text-xs leading-relaxed text-white/45">
            Door to door, from supplier pickup to delivery. {TIMELINES.note}
          </p>
        </div>
      )}
      {s.id === "delivered" && (
        <a href={quoteHref} className="btn-light mt-8 inline-flex">Request a quote</a>
      )}
    </li>
  );
}
