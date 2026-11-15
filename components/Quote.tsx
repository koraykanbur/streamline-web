"use client";

import Script from "next/script";
import { useState, type FormEvent } from "react";
import { CONTACT, TALLY_FORM_ID, TALLY_PREFILL, hasWhatsApp, whatsappLink } from "@/lib/constants";
import { FREIGHT } from "@/lib/journey";
import { clearBrief, hasBrief, useBrief, type Brief } from "@/lib/brief";
import { IconMail, IconWhatsApp } from "./glyphs";

export default function Quote() {
  const brief = useBrief();
  return (
    <section id="quote" className="scroll-mt-16 bg-navy px-6 py-28 text-white sm:px-10 lg:py-36" aria-labelledby="quote-title">
      <div className="mx-auto grid max-w-page gap-16 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <h2 id="quote-title" className="font-display text-[clamp(3rem,7vw,6rem)] font-semibold leading-[0.9] tracking-[-0.035em]">
            Ready to move?
          </h2>
          <p className="mt-6 max-w-sm text-lg leading-relaxed text-white/70">
            Tell us what you need. We'll come back with suppliers, pricing and shipping options.
          </p>
          <div className="mt-10 space-y-3">
            {hasWhatsApp && (
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="group flex max-w-sm items-center gap-4 rounded-xl border border-white/15 p-4 transition-colors hover:border-white/40">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-navy"><IconWhatsApp width={20} height={20} /></span>
                <span>
                  <span className="block text-sm text-white/55">WhatsApp</span>
                  <span className="block font-medium">{CONTACT.whatsappDisplay}</span>
                </span>
              </a>
            )}
            <a href={`mailto:${CONTACT.email}`} className="group flex max-w-sm items-center gap-4 rounded-xl border border-white/15 p-4 transition-colors hover:border-white/40">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-navy"><IconMail width={20} height={20} /></span>
              <span>
                <span className="block text-sm text-white/55">Email</span>
                <span className="block font-medium [overflow-wrap:anywhere]">{CONTACT.email}</span>
              </span>
            </a>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 text-navy sm:p-10">
          {hasBrief(brief) && <BriefBar brief={brief} />}
          {TALLY_FORM_ID ? <TallyEmbed id={TALLY_FORM_ID} brief={brief} /> : <FallbackForm brief={brief} />}
        </div>
      </div>
    </section>
  );
}

/** What the visitor already told us higher up the page. */
function BriefBar({ brief }: { brief: Brief }) {
  const chips = [brief.product, brief.destination, brief.mode && FREIGHT[brief.mode].label].filter(Boolean) as string[];
  const carried = !TALLY_FORM_ID || TALLY_PREFILL;
  return (
    <div className="mb-6 rounded-xl bg-mist p-4" role="status">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-slate-dark">{carried ? "Already in your request" : "You picked"}</p>
        <button type="button" onClick={clearBrief} className="text-sm text-slate-dark underline underline-offset-4 hover:text-navy">Clear</button>
      </div>
      <ul className="mt-2 flex flex-wrap gap-2">
        {chips.map((c) => (
          <li key={c} className="rounded-full bg-white px-3 py-1 text-sm font-medium [overflow-wrap:anywhere]">{c}</li>
        ))}
      </ul>
      {!carried && <p className="mt-3 text-sm text-slate-dark">Add it to the form below so we have it.</p>}
    </div>
  );
}

function TallyEmbed({ id, brief }: { id: string; brief: Brief }) {
  // Embed params per Tally's embed docs — verify at tally.so/help if anything looks off.
  // Hidden-field prefill only runs once TALLY_PREFILL is switched on in lib/constants.ts.
  const extra = new URLSearchParams();
  if (TALLY_PREFILL) {
    if (brief.product) extra.set("product", brief.product);
    if (brief.destination) extra.set("destination", brief.destination);
    if (brief.mode) extra.set("shipping", FREIGHT[brief.mode].label);
  }
  const q = extra.toString();
  const src = `https://tally.so/embed/${id}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1${q ? `&${q}` : ""}`;
  return (
    <>
      <iframe
        key={src}
        data-tally-src={src}
        src={src}
        loading="lazy"
        width="100%"
        height="720"
        title="Request a quote"
        className="block w-full border-0"
      />
      <Script src="https://tally.so/widgets/embed.js" strategy="lazyOnload" />
      <p className="mt-4 border-t border-line pt-4 text-sm text-slate-dark">
        Form not loading? Email us at{" "}<br className="sm:hidden" /><a className="font-medium text-navy underline underline-offset-4 [overflow-wrap:anywhere]" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        {hasWhatsApp && (<> or <a className="font-medium text-navy underline underline-offset-4" href={whatsappLink()} target="_blank" rel="noopener noreferrer">message us on WhatsApp</a></>)}.
      </p>
    </>
  );
}

const FIELDS = [
  { name: "name", label: "Name", type: "text", autoComplete: "name", required: true },
  { name: "company", label: "Company", type: "text", autoComplete: "organization" },
  { name: "email", label: "Email", type: "email", autoComplete: "email", required: true },
  { name: "whatsapp", label: "WhatsApp", type: "tel", autoComplete: "tel" },
] as const;

/** Works with no backend: sends the request to WhatsApp (or email) pre-filled. */
function FallbackForm({ brief }: { brief: Brief }) {
  const [sent, setSent] = useState<null | "whatsapp" | "email">(null);

  const build = (form: HTMLFormElement) => {
    const d = new FormData(form);
    const g = (k: string) => String(d.get(k) ?? "").trim();
    return [
      "Quote request",
      `Name: ${g("name")}`,
      g("company") && `Company: ${g("company")}`,
      `Email: ${g("email")}`,
      g("whatsapp") && `WhatsApp: ${g("whatsapp")}`,
      `Destination: ${g("destination")}`,
      `Product: ${g("product")}`,
      g("quantity") && `Quantity: ${g("quantity")}`,
      g("notes") && `Notes: ${g("notes")}`,
    ].filter(Boolean).join("\n");
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const via = !hasWhatsApp || ((e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null)?.value === "email" ? "email" : "whatsapp";
    const msg = build(form);
    if (via === "email") {
      window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent("Quote request")}&body=${encodeURIComponent(msg)}`;
    } else {
      window.open(whatsappLink(msg), "_blank", "noopener,noreferrer");
    }
    setSent(via);
  };

  return (
    <form key={`${brief.product ?? ""}|${brief.destination ?? ""}|${brief.mode ?? ""}`} onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      {FIELDS.map((f) => (
        <Field key={f.name} {...f} />
      ))}
      <div className="sm:col-span-2">
        <label htmlFor="destination" className="field-label">Destination</label>
        <select id="destination" name="destination" required defaultValue={brief.destination ?? ""} className="field">
          <option value="" disabled>Choose a destination</option>
          <option>UAE</option>
          <option>Saudi Arabia</option>
          <option>Both</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <Field name="product" label="Product needed" type="text" required defaultValue={brief.product} placeholder="e.g. stainless steel water bottles, 750ml" />
      </div>
      <Field name="quantity" label="Quantity" type="text" placeholder="e.g. 2,000 units" />
      <div className="hidden sm:block" />
      <div className="sm:col-span-2">
        <label htmlFor="notes" className="field-label">Additional notes <span className="text-slate">(optional)</span></label>
        <textarea id="notes" name="notes" rows={4} className="field resize-y" defaultValue={brief.mode ? `Shipping: ${FREIGHT[brief.mode].label}` : undefined} placeholder="Branding, packaging, target price, deadline…" />
      </div>
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <button type="submit" value="whatsapp" className="btn-dark">Request a quote</button>
        {hasWhatsApp && <button type="submit" value="email" className="btn-ghost-dark">Send by email instead</button>}
      </div>
      <p className="text-sm text-slate-dark sm:col-span-2" role="status" aria-live="polite">
        {sent === "whatsapp" && "Your request is ready in WhatsApp. Press send there and we'll take it from here."}
        {sent === "email" && "Your request is ready in your email app. Press send and we'll take it from here."}
        {!sent && (hasWhatsApp ? "Your request opens in WhatsApp, ready to send." : "Your request opens in your email app, ready to send.")}
      </p>
    </form>
  );
}

function Field({ name, label, type, autoComplete, required, placeholder, defaultValue }: { name: string; label: string; type: string; autoComplete?: string; required?: boolean; placeholder?: string; defaultValue?: string }) {
  return (
    <div>
      <label htmlFor={name} className="field-label">
        {label} {!required && <span className="text-slate">(optional)</span>}
      </label>
      <input id={name} name={name} type={type} autoComplete={autoComplete} required={required} placeholder={placeholder} defaultValue={defaultValue} className="field" />
    </div>
  );
}
