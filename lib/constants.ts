// ─────────────────────────────────────────────────────────────
//  Everything you need to change before launch lives here.
//  Search for "TODO" to find the placeholders.
// ─────────────────────────────────────────────────────────────

export const SITE = {
  name: "Streamline",
  // TODO: your live domain (used for SEO tags, sitemap and robots.txt)
  url: "https://streamline.ae",
  title: "Streamline — Sourcing and shipping from China to the UAE and Saudi Arabia",
  description:
    "Tell us what you need. We find suppliers across China, consolidate your order, ship by air or sea, handle customs and deliver to your door in the UAE and Saudi Arabia.",
};

export const CONTACT = {
  // TODO: WhatsApp number in international format, digits only (e.g. 971501234567).
  // While empty, every WhatsApp button is hidden so no fake number goes live.
  whatsapp: "",
  // How the number is shown on the page, e.g. "+971 50 123 4567"
  whatsappDisplay: "",
  // TODO: your inbound email
  email: "source.streamline@gmail.com",
};

// TODO: paste your Tally form ID (the part after tally.so/r/ in your form link).
// While this is empty, the page shows a built-in form that sends the request
// to your WhatsApp instead, so the site still works.
export const TALLY_FORM_ID = "wbbBe7";

// Door-to-door ranges. Shown with a "not a guarantee" note everywhere.
export const TIMELINES = {
  air: "7–12 days",
  sea: "3–4 weeks",
  note: "Timelines vary depending on product readiness, destination, customs, and shipment type.",
};

export const FOUNDER = {
  // TODO: review this copy. It is a draft built only from facts you've shared
  // (firsthand China–GCC experience, Mandarin + English, ~2 years, 20+ clients).
  // Rewrite it in your own words — authentic beats polished here.
  name: "Koray",
  role: "Founder, Streamline",
  paragraphs: [
    "Streamline grew out of firsthand experience moving products between China and the GCC. The hard part was never one single step. It was that every step had a different person, and nobody owned the whole journey.",
    "I speak Mandarin and English, so I talk to suppliers directly. No chain of middlemen between you and the factory.",
    "Two years and more than twenty clients later, the idea is the same. You tell us what you need. We handle it from the factory floor to your door, and you deal with one person the whole way.",
  ],
};

export const quoteHref = "#quote";

export const hasWhatsApp = CONTACT.whatsapp.length > 0;

export function whatsappLink(message = "Hi Streamline, I'd like a quote.") {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}
