"use client";

import { motion, useReducedMotion } from "framer-motion";
import { quoteHref } from "@/lib/constants";
import { IconBox, IconCheck, IconChat, IconDoor, IconFactory, IconPlane, IconSearch, IconShield, IconShip, IconSplit, IconTruck, IconWarehouse } from "./glyphs";

const STEPS = [
  { label: "Your idea", Icon: IconChat },
  { label: "Source", Icon: IconSearch },
  { label: "Collect", Icon: IconFactory },
  { label: "Warehouse", Icon: IconWarehouse },
  { label: "Air or sea", Icon: null },
  { label: "UAE / Saudi", Icon: IconBox },
  { label: "Customs", Icon: IconShield },
  { label: "Delivery", Icon: IconTruck },
  { label: "Your door", Icon: IconDoor },
];

export default function FullJourney() {
  const reduce = useReducedMotion();
  const vp = { once: true, margin: "0px 0px -20% 0px" };
  const step = (i: number) => (reduce ? { duration: 0 } : { delay: 0.2 + i * 0.14, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const });

  return (
    <section className="bg-white px-6 py-28 text-navy sm:px-10 lg:py-36" aria-labelledby="full-journey-title">
      <div className="mx-auto max-w-page">
        <h2 id="full-journey-title" className="max-w-4xl font-display text-[clamp(2.6rem,6.5vw,5.8rem)] font-semibold leading-[0.92] tracking-[-0.03em]">
          You source.
          <br />
          We handle the rest.
        </h2>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-dark">
          One request in. One delivery out. Everything between is ours to coordinate.
        </p>

        {/* desktop chain */}
        <div className="relative mt-20 hidden lg:block">
          <div className="absolute left-[5.5%] right-[5.5%] top-7 h-px bg-line" aria-hidden />
          <motion.div
            className="absolute left-[5.5%] right-[5.5%] top-7 h-px origin-left bg-navy"
            initial={{ scaleX: reduce ? 1 : 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={vp}
            transition={reduce ? { duration: 0 } : { delay: 0.2, duration: 9 * 0.14 + 0.3, ease: "linear" }}
            aria-hidden
          />
          <ol className="relative grid grid-cols-9">
            {STEPS.map(({ label, Icon }, i) => (
              <li key={label} className="flex flex-col items-center text-center">
                <motion.span
                  className="grid h-14 w-14 place-items-center rounded-full border bg-white"
                  initial={{ borderColor: "#DCE1E8", color: "#8A9BB0" }}
                  whileInView={{ borderColor: "#0A1628", color: "#0A1628" }}
                  viewport={vp}
                  transition={step(i)}
                >
                  {Icon ? <Icon /> : (
                    <span className="flex -space-x-1"><IconPlane width={18} height={18} /><IconShip width={18} height={18} /></span>
                  )}
                </motion.span>
                <motion.span className="mt-4 text-sm font-medium" initial={{ opacity: 0.35 }} whileInView={{ opacity: 1 }} viewport={vp} transition={step(i)}>
                  {label}
                </motion.span>
              </li>
            ))}
          </ol>
        </div>

        {/* mobile chain */}
        <ol className="relative mt-14 space-y-5 lg:hidden">
          <span className="absolute bottom-5 left-[19px] top-5 w-px bg-navy/15" aria-hidden />
          {STEPS.map(({ label, Icon }, i) => (
            <motion.li key={label} className="relative flex items-center gap-4"
              initial={{ opacity: reduce ? 1 : 0.3 }} whileInView={{ opacity: 1 }} viewport={vp} transition={step(i)}>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-navy bg-white">
                {Icon ? <Icon width={18} height={18} /> : <IconSplit width={18} height={18} />}
              </span>
              <span className="font-medium">{label}</span>
              {i === STEPS.length - 1 && <IconCheck className="ml-auto" />}
            </motion.li>
          ))}
        </ol>

        <div className="mt-20 flex flex-wrap items-center gap-6">
          <a href={quoteHref} className="btn-dark">Request a quote</a>
          <p className="text-sm text-slate-dark">Tell us the product, quantity and destination. We reply with options.</p>
        </div>
      </div>
    </section>
  );
}
