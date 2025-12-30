import { motion, useReducedMotion } from "framer-motion";

export default function HudTelemetryBackground() {
  const shouldReduceMotion = useReducedMotion();

  // Trace line path data (smooth telemetry curves)
  const tracePath1 =
    "M 0,300 Q 200,200 400,250 T 800,200 T 1200,280 T 1600,240 T 2000,260";
  const tracePath2 =
    "M 0,500 Q 250,450 500,480 T 1000,420 T 1500,460 T 2000,440";

  // Suzuka-inspired circuit path (stylized figure-eight)
  const circuitPath =
    "M 1200,600 Q 1400,500 1600,550 Q 1800,600 1700,700 Q 1600,800 1400,750 Q 1200,700 1100,650 Q 1000,600 1100,550 Q 1200,500 1400,550 Q 1600,600 1500,700 Q 1400,800 1200,750 Q 1000,700 900,650 Q 800,600 900,550 Q 1000,500 1200,550 Z";

  return (
    <div
      className="fixed inset-0 overflow-hidden bg-slate-950 pointer-events-none"
      style={{ zIndex: -9 }}
      aria-hidden="true"
    >

      {/* A) Telemetry Grid Layer - CSS Background - TEMP HIGH OPACITY */}
      <div
        className="absolute inset-0 opacity-[0.8]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.06) 1px, transparent 1px),
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px, 40px 40px, 200px 200px, 200px 200px",
        }}
      />

      {/* Soft Vignette at edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(2, 6, 23, 0.5) 100%)",
        }}
      />

      {/* B) Moving Trace Lines - SVG + Framer Motion */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ overflow: "visible" }}
        preserveAspectRatio="none"
      >
        {/* Trace Line 1 - with chromatic glow */}
        <defs>
          <filter id="chromaticGlow1">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
            <feComponentTransfer>
              <feFuncR type="linear" slope="1.2" />
              <feFuncG type="linear" slope="0.9" />
              <feFuncB type="linear" slope="1.1" />
            </feComponentTransfer>
          </filter>
          <filter id="chromaticGlow2">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
            <feComponentTransfer>
              <feFuncR type="linear" slope="1.1" />
              <feFuncG type="linear" slope="0.95" />
              <feFuncB type="linear" slope="1.15" />
            </feComponentTransfer>
          </filter>
        </defs>

        <motion.path
          d={tracePath1}
          fill="none"
          stroke="rgba(34, 197, 94, 0.8)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="20 20"
          filter="url(#chromaticGlow1)"
          style={{
            filter: "blur(0.5px) drop-shadow(0 0 8px rgba(34, 197, 94, 0.8))",
          }}
          animate={
            shouldReduceMotion
              ? {}
              : {
                  strokeDashoffset: [0, -2000],
                  transition: {
                    duration: 28,
                    repeat: Infinity,
                    ease: "linear",
                  },
                }
          }
        />

        {/* Trace Line 2 - with chromatic glow */}
        <motion.path
          d={tracePath2}
          fill="none"
          stroke="rgba(239, 68, 68, 0.2)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="20 20"
          filter="url(#chromaticGlow2)"
          style={{
            filter: "blur(0.5px) drop-shadow(0 0 4px rgba(239, 68, 68, 0.25))",
          }}
          animate={
            shouldReduceMotion
              ? {}
              : {
                  strokeDashoffset: [0, -2000],
                  transition: {
                    duration: 32,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 6,
                  },
                }
          }
        />

        {/* Glowing dot cursors following trace paths */}
        <motion.circle
          r="3"
          fill="rgba(34, 197, 94, 0.5)"
          style={{
            filter: "blur(1.5px) drop-shadow(0 0 6px rgba(34, 197, 94, 0.7))",
          }}
          animate={
            shouldReduceMotion
              ? { cx: 0, cy: 300 }
              : {
                  x: [0, 2000],
                  y: [300, 200, 250, 200, 280, 240, 260, 240, 260, 240, 260],
                  transition: {
                    duration: 28,
                    repeat: Infinity,
                    ease: "linear",
                  },
                }
          }
        />

        <motion.circle
          r="3"
          fill="rgba(239, 68, 68, 0.4)"
          style={{
            filter: "blur(1.5px) drop-shadow(0 0 6px rgba(239, 68, 68, 0.6))",
          }}
          animate={
            shouldReduceMotion
              ? { cx: 0, cy: 500 }
              : {
                  x: [0, 2000],
                  y: [500, 450, 480, 420, 460, 440, 460, 440, 460, 440, 460],
                  transition: {
                    duration: 32,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 6,
                  },
                }
          }
        />

        {/* C) Suzuka-inspired Circuit Overlay */}
        <g
          style={{
            opacity: 0.1,
            filter: "blur(1px) drop-shadow(0 0 8px rgba(59, 130, 246, 0.2))",
          }}
        >
          <motion.path
            d={circuitPath}
            fill="none"
            stroke="rgba(59, 130, 246, 0.12)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={
              shouldReduceMotion
                ? {}
                : {
                    x: [0, 8, -4, 6, 0],
                    y: [0, -4, 8, -3, 0],
                    rotate: [0, 0.4, -0.25, 0.15, 0],
                    transition: {
                      duration: 38,
                      repeat: Infinity,
                      ease: "linear",
                    },
                  }
            }
          />

          {/* Circuit dot moving around */}
          <motion.circle
            r="2.5"
            fill="rgba(59, 130, 246, 0.4)"
            style={{
              filter: "blur(1px) drop-shadow(0 0 4px rgba(59, 130, 246, 0.6))",
            }}
            animate={
              shouldReduceMotion
                ? { cx: 1200, cy: 600 }
                : {
                    x: [
                      1200, 1400, 1600, 1700, 1600, 1400, 1200, 1100, 1000,
                      1100, 1200, 1400, 1500, 1400, 1200, 1000, 900, 800, 900,
                      1000, 1200,
                    ],
                    y: [
                      600, 500, 550, 600, 700, 800, 750, 700, 650, 600, 550,
                      500, 550, 600, 700, 750, 700, 650, 600, 550, 600,
                    ],
                    transition: {
                      duration: 40,
                      repeat: Infinity,
                      ease: "linear",
                    },
                  }
            }
          />

          {/* Micro labels near circuit */}
          <text
            x="1100"
            y="580"
            fontSize="10"
            fill="rgba(59, 130, 246, 0.15)"
            fontFamily="monospace"
            textAnchor="middle"
          >
            SUZUKA
          </text>
          <text
            x="1400"
            y="480"
            fontSize="8"
            fill="rgba(59, 130, 246, 0.12)"
            fontFamily="monospace"
            textAnchor="middle"
          >
            SECTOR 1
          </text>
          <text
            x="1600"
            y="650"
            fontSize="8"
            fill="rgba(59, 130, 246, 0.12)"
            fontFamily="monospace"
            textAnchor="middle"
          >
            SECTOR 2
          </text>
          <text
            x="1000"
            y="700"
            fontSize="8"
            fill="rgba(59, 130, 246, 0.12)"
            fontFamily="monospace"
            textAnchor="middle"
          >
            SECTOR 3
          </text>
        </g>
      </svg>

      {/* D) Micro HUD Text Blocks - TEMP HIGH OPACITY */}
      {/* Top-left HUD */}
      <div
        className="absolute top-6 left-6 font-mono text-xs space-y-1 opacity-[0.8]"
        style={{ color: "rgba(59, 130, 246, 1)" }}
      >
        <div>GEAR 7</div>
        <div>SPEED 312</div>
        <div>RPM 11800</div>
      </div>

      {/* Top-right HUD */}
      <div
        className="absolute top-6 right-6 font-mono text-xs space-y-1 opacity-[0.8] text-right"
        style={{ color: "rgba(34, 197, 94, 1)" }}
      >
        <div>DRS: ON</div>
        <div>ERS: 72%</div>
        <div>LAP: 04</div>
      </div>

      {/* Bottom-left HUD */}
      <div
        className="absolute bottom-6 left-6 font-mono text-xs space-y-1 opacity-[0.8]"
        style={{ color: "rgba(239, 68, 68, 1)" }}
      >
        <div>TYRE: SOFT</div>
        <div>TEMP: 92°C</div>
      </div>

      {/* E) Scanning Line (top to bottom) - TEMP HIGH OPACITY */}
      <motion.div
        className="absolute left-0 right-0 w-full h-1"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(59, 130, 246, 0.8), transparent)",
          boxShadow: "0 0 16px rgba(59, 130, 246, 0.9)",
        }}
        animate={
          shouldReduceMotion
            ? { top: "0%" }
            : {
                top: ["0%", "100%"],
                transition: {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                },
              }
        }
      />
    </div>
  );
}
