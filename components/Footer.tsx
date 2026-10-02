import { CONTACT, TIMELINES, hasWhatsApp, quoteHref, whatsappLink } from "@/lib/constants";
import { Logo } from "./Nav";

export default function Footer() {
  return (
    <footer className="bg-navy-2 px-6 py-14 text-white sm:px-10">
      <div className="mx-auto flex max-w-page flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-white/55">
            Sourcing and logistics from China to the UAE and Saudi Arabia. Source, collect, ship, clear, deliver.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 text-sm">
          <div className="space-y-2">
            <p className="text-white/40">Contact</p>
            {hasWhatsApp && <a className="block text-white/80 hover:text-white" href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
            <a className="block text-white/80 hover:text-white" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          </div>
          <div className="space-y-2">
            <p className="text-white/40">Explore</p>
            <a className="block text-white/80 hover:text-white" href="#journey">How it works</a>
            <a className="block text-white/80 hover:text-white" href="#services">Services</a>
            <a className="block text-white/80 hover:text-white" href={quoteHref}>Request a quote</a>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-page flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/40 md:flex-row md:justify-between">
        <p>© {new Date().getFullYear()} Streamline. Dubai, UAE.</p>
        <p>Air {TIMELINES.air}, sea {TIMELINES.sea}, door to door. Estimates, not guarantees.</p>
      </div>
    </footer>
  );
}
