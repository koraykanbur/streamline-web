"use client";

import { useEffect, useState } from "react";
import { hasWhatsApp, quoteHref, whatsappLink } from "@/lib/constants";
import { IconWhatsApp } from "./glyphs";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-mark.png" width={30} height={30} alt="" aria-hidden className="h-[30px] w-[30px]" />
      <span className="font-display text-[1.2rem] font-semibold tracking-[-0.02em]">Streamline</span>
    </span>
  );
}

const LINKS = [
  { href: "#journey", label: "How it works" },
  { href: "#services", label: "Services" },
  { href: "#why", label: "Why Streamline" },
  { href: "#founder", label: "About" },
];

export default function Nav() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 text-white transition-[background-color,backdrop-filter,border-color] duration-300 ${
        solid ? "border-b border-white/10 bg-navy/95 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-page items-center justify-between px-6 sm:px-10">
        <a href="#top" aria-label="Streamline, back to top"><Logo /></a>
        <nav aria-label="Main" className="hidden items-center gap-8 text-sm text-white/70 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-white">{l.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {hasWhatsApp && (
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="Message Streamline on WhatsApp" className="grid h-10 w-10 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white">
              <IconWhatsApp width={20} height={20} />
            </a>
          )}
          <a href={quoteHref} className="btn-light !h-10 !px-4 text-sm">Request a quote</a>
        </div>
      </div>
    </header>
  );
}
