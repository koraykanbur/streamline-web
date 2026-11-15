"use client";

// What the visitor has told us so far (hero input, route planner).
// The quote section reads it so nothing has to be typed twice.

import { useSyncExternalStore } from "react";

export type Destination = "UAE" | "Saudi Arabia";
export type Mode = "air" | "sea";
export type Brief = { product?: string; destination?: Destination; mode?: Mode };

const EMPTY: Brief = {};
let brief: Brief = EMPTY;
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

export function setBrief(patch: Brief) {
  brief = { ...brief, ...patch };
  emit();
}

export function clearBrief() {
  brief = EMPTY;
  emit();
}

export function useBrief(): Brief {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    () => brief,
    () => EMPTY,
  );
}

export const hasBrief = (b: Brief) => Boolean(b.product || b.destination || b.mode);

/** Scroll to the quote form. Smoothness follows the CSS scroll-behavior (off for reduced motion). */
export function goToQuote() {
  document.getElementById("quote")?.scrollIntoView();
}
