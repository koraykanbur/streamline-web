"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CONTACT, FAQS } from "@/lib/constants";

const FIRST = 6;

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const [all, setAll] = useState(false);
  const reduce = useReducedMotion();
  const shown = all ? FAQS : FAQS.slice(0, FIRST);

  return (
    <section id="faq" className="scroll-mt-16 bg-white px-6 py-28 text-navy sm:px-10 lg:py-36" aria-labelledby="faq-title">
      <div className="mx-auto grid max-w-page gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow text-slate-dark">Before you start</p>
          <h2 id="faq-title" className="mt-4 font-display text-[clamp(2.4rem,5.5vw,4.6rem)] font-semibold leading-[0.95] tracking-[-0.03em]">
            Good questions.
            <br />
            Straight answers.
          </h2>
          <p className="mt-6 max-w-sm text-lg leading-relaxed text-slate-dark">
            Something we haven't covered? Write to{" "}
            <a className="font-medium text-navy underline underline-offset-4 [overflow-wrap:anywhere]" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
          </p>
        </div>

        <div>
          <ul className="divide-y divide-line border-y border-line">
            {shown.map((f, n) => {
              const on = open === n;
              return (
                <li key={f.q}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={on}
                      aria-controls={`faq-a-${n}`}
                      id={`faq-q-${n}`}
                      onClick={() => setOpen(on ? null : n)}
                      className="flex w-full items-center justify-between gap-6 py-6 text-left font-display text-xl font-semibold tracking-[-0.01em] sm:text-2xl"
                    >
                      {f.q}
                      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-[background-color,color,transform] duration-300 ${on ? "rotate-45 bg-navy text-white" : "bg-mist text-navy"}`} aria-hidden>
                        <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div
                        id={`faq-a-${n}`}
                        role="region"
                        aria-labelledby={`faq-q-${n}`}
                        initial={reduce ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-xl pb-7 text-lg leading-relaxed text-slate-dark">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
          {FAQS.length > FIRST && (
            <button type="button" onClick={() => setAll((v) => !v)} className="btn-ghost-dark mt-8" aria-expanded={all}>
              {all ? "Show fewer" : `See all ${FAQS.length} questions`}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
