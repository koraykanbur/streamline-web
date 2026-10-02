import { FOUNDER } from "@/lib/constants";

export default function Founder() {
  return (
    <section id="founder" className="scroll-mt-16 bg-mist px-6 py-28 text-navy sm:px-10 lg:py-36" aria-labelledby="founder-title">
      <div className="mx-auto grid max-w-page gap-14 lg:grid-cols-[1fr_1fr]">
        <h2 id="founder-title" className="font-display text-[clamp(2.2rem,4.6vw,3.8rem)] font-semibold leading-[1] tracking-[-0.025em]">
          Built between China and the Gulf, not in a boardroom.
        </h2>
        <div>
          <div className="space-y-5 text-lg leading-relaxed text-navy/80">
            {FOUNDER.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <div className="mt-10 flex items-center gap-4 border-t border-navy/10 pt-6">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-navy font-display text-lg font-semibold text-white" aria-hidden>
              {FOUNDER.name.slice(0, 1)}
            </span>
            <div>
              <p className="font-medium">{FOUNDER.name}</p>
              <p className="text-sm text-slate-dark">{FOUNDER.role}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
