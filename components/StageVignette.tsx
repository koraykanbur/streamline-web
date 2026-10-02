"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { StageId } from "@/lib/journey";
import { MAP_PLANE, MAP_SHIP } from "./glyphs";

/**
 * Small illustrations that play when a stage becomes active.
 * Drawn on a 280×110 canvas, stroke = currentColor.
 */
export default function StageVignette({ id, tone = "dark" }: { id: StageId; tone?: "dark" | "light" }) {
  const reduce = useReducedMotion();
  const fg = tone === "dark" ? "#FFFFFF" : "#0A1628";
  const bg = tone === "dark" ? "#0A1628" : "#FFFFFF";
  const dim = tone === "dark" ? "rgba(255,255,255,.22)" : "rgba(10,22,40,.18)";
  const T = (delay: number, duration = 0.8) =>
    reduce ? { duration: 0 } : { delay, duration, ease: [0.22, 1, 0.36, 1] as const };

  const common = { width: "100%", viewBox: "0 0 280 110", fill: "none", "aria-hidden": true as const, style: { maxWidth: 320, display: "block" } };

  switch (id) {
    case "idea":
      return (
        <svg {...common}>
          <motion.rect x={22} y={34} width={176} height={42} rx={21} stroke={fg} strokeWidth={1.4}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={T(0.1, 1)} />
          <motion.text x={40} y={60} fill={fg} fontSize={13} fontFamily="Inter Variable, Inter, sans-serif"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={T(0.6)}>
            2,000 units to Dubai
          </motion.text>
          <motion.path d="M198 55h50" stroke={fg} strokeWidth={1.4} strokeDasharray="3 5"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={T(1)} />
          <motion.circle cx={256} cy={55} r={6} fill={fg} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={T(1.5, 0.4)} />
        </svg>
      );
    case "source": {
      const fx = [[30, 20], [24, 58], [40, 92], [92, 14], [96, 96]];
      return (
        <svg {...common}>
          {fx.map(([x, y], i) => (
            <g key={i}>
              <motion.path d={`M${x} ${y} Q${(x + 200) / 2} ${(y + 55) / 2 + (y < 55 ? -6 : 6)} 200 55`} stroke={fg} strokeWidth={1.2} strokeOpacity={0.8}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={T(0.3 + i * 0.12, 0.9)} />
              <motion.rect x={x - 4} y={y - 4} width={8} height={8} transform={`rotate(45 ${x} ${y})`} fill={bg} stroke={fg} strokeWidth={1.3}
                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={T(i * 0.1, 0.4)} style={{ transformOrigin: `${x}px ${y}px` }} />
            </g>
          ))}
          <motion.circle cx={200} cy={55} r={10} fill={bg} stroke={fg} strokeWidth={1.6} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={T(1.1, 0.5)} style={{ transformOrigin: "200px 55px" }} />
          <motion.circle cx={200} cy={55} r={3.5} fill={fg} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={T(1.3, 0.4)} style={{ transformOrigin: "200px 55px" }} />
          <motion.path d="M212 55h56" stroke={fg} strokeWidth={1.6} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={T(1.4)} />
        </svg>
      );
    }
    case "collect":
      return (
        <svg {...common}>
          <path d="M20 80h240" stroke={dim} strokeWidth={1.2} />
          {/* factory */}
          <path d="M22 80V52l14 9v-9l14 9v-9l14 9V36h8v44" stroke={fg} strokeWidth={1.3} />
          {/* warehouse */}
          <path d="M214 80V50l24-13 24 13v30M224 80V62h28v18" stroke={fg} strokeWidth={1.3} />
          <motion.path d="M78 80h130" stroke={fg} strokeWidth={1.6} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={T(0.2, 1.6)} />
          <motion.g initial={{ x: 84 }} animate={{ x: 196 }} transition={T(0.2, 1.6)}>
            <VTruck y={79.6} fg={fg} bg={bg} />
          </motion.g>
        </svg>
      );
    case "consolidate": {
      const boxes = [[40, 30], [40, 72], [96, 20], [96, 82]];
      return (
        <svg {...common}>
          {boxes.map(([x, y], i) => (
            <motion.rect key={i} width={22} height={22} rx={2} stroke={fg} strokeWidth={1.3} fill={bg}
              initial={{ x: x - 11, y: y - 11, opacity: 1 }}
              animate={{ x: 169 + (i % 2) * 24, y: i < 2 ? 32 : 56, opacity: 1 }}
              transition={T(0.2 + i * 0.1, 1.1)} />
          ))}
          <motion.rect x={150} y={20} width={84} height={70} rx={4} stroke={fg} strokeWidth={1.6}
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={T(1.3, 0.8)} />
          <motion.text x={150} y={106} fill={fg} fontSize={11} fontFamily="Inter Variable, Inter, sans-serif" opacity={0.8}
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={T(1.8)}>
            4 suppliers → 1 shipment
          </motion.text>
        </svg>
      );
    }
    case "split":
      return (
        <svg {...common}>
          <circle cx={24} cy={55} r={6} fill={fg} />
          <motion.path id="air-v" d="M30 55C80 55 90 18 150 18H262" stroke={fg} strokeWidth={1.6} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={T(0.2, 1)} />
          <motion.path d="M30 55C80 55 90 92 150 92H262" stroke={fg} strokeWidth={1.6} strokeDasharray="4 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={T(0.2, 1.8)} />
          <motion.g initial={{ x: 120, opacity: 0 }} animate={{ x: 240, opacity: 1 }} transition={T(0.6, 1)}>
            <g transform="translate(0 18) scale(1.7)"><path d={MAP_PLANE} fill={fg} /></g>
          </motion.g>
          <motion.g initial={{ x: 120, opacity: 0 }} animate={{ x: 236, opacity: 1 }} transition={T(0.6, 2)}>
            <g transform="translate(0 92) scale(1.8)"><path d={MAP_SHIP} fill={fg} /></g>
          </motion.g>
        </svg>
      );
    case "customs":
      return (
        <svg {...common}>
          <path d="M20 84h240" stroke={dim} strokeWidth={1.2} />
          {/* gate post */}
          <path d="M150 84V40h10v44" stroke={fg} strokeWidth={1.4} />
          {/* barrier arm rotates up */}
          <motion.g style={{ transformOrigin: "155px 46px" }} initial={{ rotate: 0 }} animate={{ rotate: -78 }} transition={T(1.2, 0.45)}>
            <rect x={155} y={43} width={92} height={6} rx={3} stroke={fg} strokeWidth={1.3} fill={bg} />
            <path d="M175 43v6M195 43v6M215 43v6M235 43v6" stroke={fg} strokeWidth={1.3} />
          </motion.g>
          {/* box approaches, waits, continues */}
          <motion.g initial={{ x: 20 }} animate={{ x: [20, 108, 108, 230] }} transition={reduce ? { duration: 0 } : { delay: 0.1, duration: 2.6, times: [0, 0.35, 0.55, 1], ease: "easeInOut" }}>
            <VTruck y={83.6} fg={fg} bg={bg} />
          </motion.g>
          <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={T(1.0, 0.35)} style={{ transformOrigin: "155px 18px" }}>
            <circle cx={155} cy={18} r={12} fill={fg} />
            <path d="M149.5 18.3 153.2 22 160.8 14.4" stroke={bg} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </motion.g>
        </svg>
      );
    case "delivered":
      return (
        <svg {...common}>
          <path d="M20 84h240" stroke={dim} strokeWidth={1.2} />
          <path d="M214 84V50l22-14 22 14v34M228 84V64h16v20" stroke={fg} strokeWidth={1.4} />
          <motion.g initial={{ x: 22 }} animate={{ x: 196 }} transition={T(0.2, 1.6)}>
            <VTruck y={83.6} fg={fg} bg={bg} />
          </motion.g>
          <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={T(1.8, 0.4)} style={{ transformOrigin: "236px 22px" }}>
            <circle cx={236} cy={22} r={12} fill={fg} />
            <path d="M230.5 22.3 234.2 26 241.8 18.4" stroke={bg} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </motion.g>
        </svg>
      );
  }
}

/** Side-view truck, wheels resting on y. Drawn around x = 0. */
function VTruck({ y, fg, bg }: { y: number; fg: string; bg: string }) {
  return (
    <g transform={`translate(0 ${y})`}>
      <rect x={-16} y={-19} width={21} height={15} rx={1.5} fill={bg} stroke={fg} strokeWidth={1.4} />
      <path d="M5 -14h6.5l4.5 5v5H5z" fill={bg} stroke={fg} strokeWidth={1.4} strokeLinejoin="round" />
      <path d="M7.5 -12.2h3.4l2.6 3" stroke={fg} strokeWidth={1.1} fill="none" />
      <circle cx={-10} cy={-2.4} r={2.8} fill={bg} stroke={fg} strokeWidth={1.4} />
      <circle cx={10} cy={-2.4} r={2.8} fill={bg} stroke={fg} strokeWidth={1.4} />
    </g>
  );
}
