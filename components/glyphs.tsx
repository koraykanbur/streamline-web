// Line glyphs drawn for this site (24×24, stroke = currentColor).
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const IconPlane = (p: P) => (
  <svg {...base} {...p}>
    <path d="M2.5 13.2 21 9.5c.9-.2 1 1 .1 1.3L4.6 16.4l-2.1-3.2Z" />
    <path d="m9 12-3.5-6h2.6l6.4 4.6M9.6 14.6 8 19.5h2.4l4.3-6.1" />
  </svg>
);
export const IconShip = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 14h18l-2.6 5H5.6L3 14Z" />
    <path d="M6 14V9h5v5M11 14V6h5v8M16 14v-3h3v3" />
  </svg>
);
export const IconTruck = (p: P) => (
  <svg {...base} {...p}>
    <path d="M2.5 6.5h11v10h-11zM13.5 10h4.2l3.3 3.4v3.1h-7.5" />
    <circle cx="6.5" cy="17.5" r="1.8" fill="var(--bg, #fff)" />
    <circle cx="17" cy="17.5" r="1.8" fill="var(--bg, #fff)" />
  </svg>
);
export const IconFactory = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 20V10l5 3V10l5 3V10l5 3V4h3v16H3Z" />
    <path d="M7 17h2M11 17h2M15 17h2" />
  </svg>
);
export const IconWarehouse = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 20V9l9-5 9 5v11" />
    <path d="M7 20v-7h10v7M7 16h10" />
  </svg>
);
export const IconBox = (p: P) => (
  <svg {...base} {...p}>
    <path d="m12 3 8 4v10l-8 4-8-4V7l8-4Z" />
    <path d="m4 7 8 4 8-4M12 11v10" />
  </svg>
);
export const IconDoor = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 21V4h12v17M3 21h18" />
    <circle cx="14.5" cy="12.5" r=".6" fill="currentColor" />
  </svg>
);
export const IconCheck = (p: P) => (
  <svg {...base} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);
export const IconShield = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3 5 6v5.5c0 4.4 3 8 7 9.5 4-1.5 7-5.1 7-9.5V6l-7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
export const IconSearch = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </svg>
);
export const IconHandshake = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 11.5 7 7.5l3 1.5 3-2 4 1 4 3.5" />
    <path d="m7 13 3.5 3.5a1.5 1.5 0 0 0 2.1 0l4.9-4.9M3 11.5l3.5 3.5M21 11.5 17.5 15" />
  </svg>
);
export const IconLoupe = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 5h10v14H4zM7 9h4M7 12h4M7 15h2" />
    <circle cx="17" cy="15" r="3" />
    <path d="m19.2 17.2 1.8 1.8" />
  </svg>
);
export const IconRoute = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="5" cy="18" r="2" />
    <circle cx="19" cy="6" r="2" />
    <path d="M7 18h7a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h7" />
  </svg>
);
export const IconChat = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 5h16v11H9l-5 4V5Z" />
  </svg>
);
export const IconEye = (p: P) => (
  <svg {...base} {...p}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="2.8" />
  </svg>
);
export const IconSplit = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 12h6c3 0 4-6 8-6h4M9 12c3 0 4 6 8 6h4" />
  </svg>
);
export const IconMail = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 6h18v12H3z" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);
export const IconWhatsApp = (p: P) => (
  <svg width={24} height={24} viewBox="0 0 24 24" aria-hidden fill="currentColor" {...p}>
    <path d="M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.3 21.8l5.1-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8.9c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .1-1.2c0-.1-.2-.2-.5-.3Z" />
  </svg>
);

// ── map vehicle glyphs: drawn around (0,0), pointing +x, ~14 units long ──
export const MAP_PLANE =
  "M7 0 L2 -1.1 L-1 -6.5 L-3 -6.5 L-1 -1.2 L-5 -1 L-6.6 -3 L-7.6 -3 L-6.6 0 L-7.6 3 L-6.6 3 L-5 1 L-1 1.2 L-3 6.5 L-1 6.5 L2 1.1 Z";
export const MAP_SHIP = "M-7 -2.2 L5 -2.2 L7.5 0 L5 2.2 L-7 2.2 Z M-5 -1.2 h3 v2.4 h-3z M-1 -1.2 h3 v2.4 h-3z";
export const MAP_TRUCK = "M-6 -2.2 h8 v4.4 h-8z M2.6 -1.8 h2.4 l1.6 1.4 v2.6 h-4z";
