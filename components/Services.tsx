"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ComponentType, SVGProps } from "react";
import { quoteHref } from "@/lib/constants";
import {
  IconBox, IconDoor, IconHandshake, IconLoupe, IconPlane, IconRoute, IconSearch, IconShield, IconShip, IconCheck,
} from "./glyphs";

type Svc = { name: string; line: string; Icon: ComponentType<SVGProps<SVGSVGElement>> };

const GROUPS: { title: string; items: Svc[] }[] = [
  {
    title: "Before it ships",
    items: [
      { name: "Supplier sourcing", line: "We find factories across China that can make what you need.", Icon: IconSearch },
      { name: "Product research", line: "Specs, materials, options and prices, compared side by side.", Icon: IconLoupe },
      { name: "Negotiation", line: "We negotiate pricing and terms directly with suppliers, in Mandarin.", Icon: IconHandshake },
      { name: "Quality coordination", line: "We check with suppliers before goods leave the factory.", Icon: IconCheck },
    ],
  },
  {
    title: "On the move",
    items: [
      { name: "Consolidation", line: "Orders from several suppliers combined into one shipment.", Icon: IconBox },
      { name: "Air freight", line: "The fast route, for urgent orders.", Icon: IconPlane },
      { name: "Sea freight", line: "The economical route, for flexible timelines.", Icon: IconShip },
    ],
  },
  {
    title: "On arrival",
    items: [
      { name: "Customs", line: "Clearance coordinated in the UAE and Saudi Arabia.", Icon: IconShield },
      { name: "Last-mile delivery", line: "From port or airport straight to your door.", Icon: IconDoor },
    ],
  },
];

export default function Services() {
  const reduce = useReducedMotion();
  return (
    <section id="services" className="scroll-mt-16 bg-mist px-6 py-28 text-navy sm:px-10 lg:py-36" aria-labelledby="services-title">
      <div className="mx-auto max-w-page">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <h2 id="services-title" className="font-display text-[clamp(2.4rem,5.5vw,4.6rem)] font-semibold leading-[0.95] tracking-[-0.03em]">
            We source it, move it, clear it, and deliver it.
          </h2>
          <p className="max-w-md text-lg leading-relaxed text-slate-dark lg:justify-self-end">
            Use one part or all of it. Most clients hand us the whole journey.
          </p>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-line lg:grid-cols-3">
          {GROUPS.map((g, gi) => (
            <div key={g.title} className="bg-white p-8 lg:p-10">
              <h3 className="text-sm text-slate-dark">{g.title}</h3>
              <ul className="mt-8 space-y-8">
                {g.items.map((s, i) => (
                  <motion.li
                    key={s.name}
                    className="flex gap-4"
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                    transition={{ duration: 0.6, delay: gi * 0.12 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <s.Icon className="mt-0.5 shrink-0" />
                    <div>
                      <p className="font-display text-xl font-semibold tracking-[-0.01em]">{s.name}</p>
                      <p className="mt-1 leading-relaxed text-slate-dark">{s.line}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
          {/* the one that ties it together */}
          <div className="flex flex-col gap-6 bg-navy p-8 text-white lg:col-span-3 lg:flex-row lg:items-center lg:justify-between lg:p-10">
            <div className="flex gap-4">
              <IconRoute className="mt-1 shrink-0" />
              <div>
                <p className="font-display text-2xl font-semibold tracking-[-0.01em]">End-to-end coordination</p>
                <p className="mt-1 max-w-xl leading-relaxed text-white/65">
                  Everything above, run as one job, with one person to talk to from the first message to delivery.
                </p>
              </div>
            </div>
            <a href={quoteHref} className="btn-light shrink-0 self-start lg:self-auto">Request a quote</a>
          </div>
        </div>
      </div>
    </section>
  );
}
