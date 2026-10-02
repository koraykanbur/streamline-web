import { IconChat, IconEye, IconRoute, IconSplit } from "./glyphs";

const POINTS = [
  { Icon: IconChat, title: "One point of contact", body: "No need to coordinate suppliers, freight, customs, and delivery separately. You message one person." },
  { Icon: IconRoute, title: "End to end", body: "One journey from supplier to your door. No handoffs for you to manage in between." },
  { Icon: IconEye, title: "Full visibility", body: "Know where your shipment is. We keep you updated at each stage, from factory to doorstep." },
  { Icon: IconSplit, title: "Flexible routes", body: "Air or sea, depending on what matters more this time: speed or cost." },
];

export default function Why() {
  return (
    <section id="why" className="scroll-mt-16 bg-white px-6 py-28 text-navy sm:px-10 lg:py-36" aria-labelledby="why-title">
      <div className="mx-auto grid max-w-page gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="why-title" className="font-display text-[clamp(2.4rem,5.5vw,4.6rem)] font-semibold leading-[0.95] tracking-[-0.03em]">
            Why Streamline
          </h2>
          <p className="mt-6 max-w-sm text-lg leading-relaxed text-slate-dark">
            Importing usually means juggling four companies and hoping they talk to each other. With us, they don't need to. We do.
          </p>
        </div>
        <ul className="divide-y divide-line border-y border-line">
          {POINTS.map(({ Icon, title, body }) => (
            <li key={title} className="grid gap-4 py-10 sm:grid-cols-[56px_1fr]">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-mist"><Icon /></span>
              <div>
                <h3 className="font-display text-2xl font-semibold tracking-[-0.01em]">{title}</h3>
                <p className="mt-2 max-w-lg text-lg leading-relaxed text-slate-dark">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
