"use client";

import { useReducedMotion } from "framer-motion";
import JourneyDesktop from "./JourneyDesktop";
import JourneyVertical from "./JourneyVertical";

export default function Journey() {
  const reduce = useReducedMotion();
  return (
    <section id="journey" aria-label="How a shipment moves with Streamline" className="scroll-mt-0">
      <h2 className="sr-only">The journey, from your idea to your door</h2>
      {reduce ? (
        <JourneyVertical />
      ) : (
        <>
          <div className="hidden lg:block">
            <JourneyDesktop />
          </div>
          <div className="lg:hidden">
            <JourneyVertical />
          </div>
        </>
      )}
    </section>
  );
}
