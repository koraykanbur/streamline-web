"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { STAGES, type StageId } from "@/lib/journey";
import { TIMELINES, quoteHref } from "@/lib/constants";
import { IconCheck } from "./glyphs";

// What the conversation looks like at each stage. Illustrative only:
// the product, places and wording are examples, not a real order.
type Msg = { from: "you" | "us"; text: string; list?: string[] };

const THREAD: Record<StageId, Msg[]> = {
  idea: [
    { from: "you", text: "I need 2,000 stainless steel water bottles, 750ml, delivered to Dubai." },
    { from: "us", text: "Got it. We'll come back with supplier options." },
  ],
  source: [
    { from: "us", text: "We've compared suppliers for you. Options, specs and prices, side by side." },
    { from: "you", text: "Let's go with the second one." },
    { from: "us", text: "Done. We'll check with the supplier before anything leaves the factory." },
  ],
  collect: [
    { from: "us", text: "Your goods are ready. We're picking them up from the factory today." },
    { from: "us", text: "Arrived at our warehouse in Shenzhen." },
  ],
  consolidate: [
    { from: "us", text: "Everything is in. One shipment, ready to go.", list: ["Checked", "Packed", "Combined"] },
  ],
  split: [
    { from: "us", text: `Air is about ${TIMELINES.air} door to door. Sea is about ${TIMELINES.sea} and costs less. Which one?` },
    { from: "you", text: "Air this time." },
    { from: "us", text: "Booked." },
  ],
  customs: [
    { from: "us", text: "Your shipment has landed. Customs clearance is in progress." },
    { from: "us", text: "Nothing needed from you." },
  ],
  delivered: [
    { from: "us", text: "Out for delivery." },
    { from: "us", text: "Delivered to your door.", list: ["Delivered"] },
  ],
};

export default function StepThrough() {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const s = STAGES[i];
  const next = STAGES[i + 1];

  const go = (n: number, focus = false) => {
    const k = (n + STAGES.length) % STAGES.length;
    setI(k);
    if (focus) tabs.current[k]?.focus();
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); go(i + 1, true); }
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); go(i - 1, true); }
    else if (e.key === "Home") { e.preventDefault(); go(0, true); }
    else if (e.key === "End") { e.preventDefault(); go(STAGES.length - 1, true); }
  };

  const fade = reduce
    ? { initial: false as const, animate: { opacity: 1 }, exit: { opacity: 1 }, transition: { duration: 0 } }
    : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <section id="steps" className="scroll-mt-16 bg-white px-6 py-28 text-navy sm:px-10 lg:py-36" aria-labelledby="steps-title">
      <div className="mx-auto max-w-page">
        <p className="eyebrow text-slate-dark">Step by step</p>
        <h2 id="steps-title" className="mt-4 max-w-4xl font-display text-[clamp(2.6rem,6.5vw,5.8rem)] font-semibold leading-[0.92] tracking-[-0.03em]">
          Say the word.
          <br />
          We handle the rest.
        </h2>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-dark">
          One request in. One delivery out. Click through each step to see what happens, and what you hear from us.
        </p>

        {/* step tabs */}
        <div className="relative mt-14">
          <div
            role="tablist"
            aria-label="Steps of the journey"
            onKeyDown={onKey}
            className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {STAGES.map((st, n) => {
              const on = n === i;
              const done = n < i;
              return (
                <button
                  key={st.id}
                  ref={(el) => { tabs.current[n] = el; }}
                  role="tab"
                  type="button"
                  id={`step-tab-${st.id}`}
                  aria-selected={on}
                  aria-controls="step-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => go(n)}
                  className={`flex h-11 shrink-0 items-center gap-2.5 rounded-full border pl-1.5 pr-4 text-sm font-medium transition-colors duration-200 ${
                    on ? "border-navy bg-navy text-white" : "border-line bg-white text-navy hover:border-navy/50"
                  }`}
                >
                  <span className={`grid h-8 w-8 place-items-center rounded-full text-[13px] tabular-nums ${on ? "bg-white text-navy" : done ? "bg-navy text-white" : "bg-mist text-navy"}`}>
                    {done ? <IconCheck width={15} height={15} /> : n + 1}
                  </span>
                  {st.nav}
                </button>
              );
            })}
          </div>
          {/* progress */}
          <div className="mt-4 h-px bg-line" aria-hidden>
            <div
              className="h-px origin-left bg-navy transition-transform duration-500 ease-out motion-reduce:transition-none"
              style={{ transform: `scaleX(${(i + 1) / STAGES.length})` }}
            />
          </div>
        </div>

        {/* panel */}
        <div
          id="step-panel"
          role="tabpanel"
          aria-labelledby={`step-tab-${s.id}`}
          className="mt-12 grid gap-12 lg:min-h-[23rem] lg:grid-cols-[1fr_1fr] lg:gap-20"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={s.id} {...fade}>
              <p className="text-sm text-slate-dark">{s.where}</p>
              <h3 className="mt-3 font-display text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[1] tracking-[-0.025em]">{s.title}</h3>
              <p className="mt-4 text-xl">{s.lead}</p>
              <p className="mt-3 max-w-lg text-lg leading-relaxed text-slate-dark">{s.body}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {next ? (
                  <button type="button" onClick={() => go(i + 1)} className="btn-dark">
                    Next step: {next.nav}
                    <Arrow />
                  </button>
                ) : (
                  <>
                    <a href={quoteHref} className="btn-dark">Request a quote</a>
                    <button type="button" onClick={() => go(0)} className="btn-ghost-dark">Start again</button>
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <div>
            <div className="rounded-2xl bg-mist p-4 sm:p-6">
              <div className="flex items-center justify-between border-b border-navy/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-navy font-display text-sm font-semibold text-white" aria-hidden>S</span>
                  <div>
                    <p className="text-sm font-medium leading-tight">Streamline</p>
                    <p className="text-xs text-slate-dark">One person, start to finish</p>
                  </div>
                </div>
                <p className="text-xs tabular-nums text-slate-dark">{i + 1} / {STAGES.length}</p>
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.ul key={s.id} className="flex min-h-[13rem] flex-col justify-end gap-2.5 pt-5" {...(reduce ? {} : { exit: { opacity: 0 }, transition: { duration: 0.15 } })}>
                  {THREAD[s.id].map((m, n) => (
                    <motion.li
                      key={n}
                      initial={reduce ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={reduce ? { duration: 0 } : { delay: 0.15 + n * 0.35, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-[0.95rem] leading-relaxed ${
                        m.from === "you" ? "self-end rounded-br-md bg-navy text-white" : "self-start rounded-bl-md bg-white text-navy"
                      }`}
                    >
                      <span className="sr-only">{m.from === "you" ? "You: " : "Streamline: "}</span>
                      {m.text}
                      {m.list && (
                        <span className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-dark">
                          {m.list.map((t) => (
                            <span key={t} className="inline-flex items-center gap-1.5"><IconCheck width={14} height={14} />{t}</span>
                          ))}
                        </span>
                      )}
                    </motion.li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            </div>
            <p className="mt-3 text-xs text-slate-dark">Sample conversation, for illustration.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden className="ml-2">
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
