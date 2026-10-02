"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import JourneyMap from "./JourneyMap";
import StageVignette from "./StageVignette";
import { STAGES, FREIGHT } from "@/lib/journey";
import { TIMELINES, quoteHref } from "@/lib/constants";

/** Desktop: one pinned map, the shipment moves as you scroll. */
export default function JourneyDesktop() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const i = STAGES.findIndex((s) => p >= s.start && p < s.end);
    const next = i === -1 ? STAGES.length - 1 : i;
    if (next !== active) setActive(next);
  });

  const jump = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    const s = STAGES[i];
    const target = top + travel * (s.start + Math.min(0.06, (s.end - s.start) * 0.6));
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  const stage = STAGES[active];

  return (
    <div ref={ref} className="relative bg-navy text-white" style={{ height: "760vh" }}>
      <div className="sticky top-0 flex h-screen overflow-hidden">
        {/* stage rail */}
        <nav aria-label="Journey stages" className="hidden w-48 shrink-0 flex-col justify-center gap-1 border-r border-white/10 pl-8 xl:flex">
          {STAGES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => jump(i)}
              className="group flex items-center gap-3 py-1.5 text-left text-sm transition-colors"
              aria-current={i === active ? "step" : undefined}
            >
              <span className={`tabular-nums text-xs ${i <= active ? "text-white" : "text-white/30"}`}>{i + 1}</span>
              <span className={`h-px transition-all duration-500 ${i === active ? "w-6 bg-white" : i < active ? "w-3 bg-white/60" : "w-3 bg-white/20"}`} />
              <span className={`${i === active ? "text-white" : "text-white/45 group-hover:text-white/80"} transition-colors`}>{s.nav}</span>
            </button>
          ))}
        </nav>

        {/* copy */}
        <div className="relative z-10 flex w-[min(34rem,42%)] shrink-0 flex-col justify-center px-10 xl:px-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="mb-6 text-sm text-slate">{stage.where}</p>
              <div className="mb-8 text-white">
                <StageVignette id={stage.id} />
              </div>
              <h3 className={`font-display font-semibold leading-[0.95] tracking-[-0.02em] ${stage.id === "idea" ? "text-[clamp(2.4rem,3.6vw,3.4rem)]" : "text-[clamp(2.8rem,4.4vw,4.4rem)]"}`}>
                {stage.title}
              </h3>
              <p className="mt-5 text-xl text-white">{stage.lead}</p>
              <p className="mt-3 max-w-md text-base leading-relaxed text-white/65">{stage.body}</p>

              {stage.id === "split" && (
                <div className="mt-8 grid max-w-md grid-cols-2 gap-px overflow-hidden rounded-lg bg-white/15">
                  {(["air", "sea"] as const).map((k) => (
                    <div key={k} className="bg-navy-2 p-4">
                      <p className="text-sm text-white/60">{FREIGHT[k].label}</p>
                      <p className="mt-1 font-display text-2xl font-semibold">{FREIGHT[k].time}</p>
                      <p className="mt-2 text-sm leading-snug text-white/65">{FREIGHT[k].line}</p>
                    </div>
                  ))}
                  <p className="col-span-2 bg-navy-2 px-4 pb-4 text-xs leading-relaxed text-white/45">
                    Door to door, from supplier pickup to delivery. {TIMELINES.note}
                  </p>
                </div>
              )}
              {stage.id === "delivered" && (
                <a href={quoteHref} className="btn-light mt-8 inline-flex">Request a quote</a>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* map */}
        <div className="relative min-w-0 flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-navy to-transparent" />
          <JourneyMap progress={scrollYProgress} />
          <MapLegend />
        </div>
      </div>
    </div>
  );
}

function MapLegend() {
  return (
    <div className="absolute bottom-8 right-8 flex items-center gap-5 text-xs text-white/50">
      <span className="flex items-center gap-2"><span className="block h-2 w-2 rotate-45 border border-white" /> Supplier</span>
      <span className="flex items-center gap-2"><span className="block h-2.5 w-2.5 rounded-full border border-white" /> Customs</span>
      <span className="flex items-center gap-2"><span className="block h-2.5 w-2.5 rounded-sm border border-white" /> Your door</span>
    </div>
  );
}
