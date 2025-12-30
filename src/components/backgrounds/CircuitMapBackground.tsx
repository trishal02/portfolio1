import { motion, useReducedMotion } from "framer-motion";

export default function CircuitMapBackground() {
  const shouldReduceMotion = useReducedMotion();

  // Simplified custom circuit path (Bezier-like track map, centered)
  const circuitPath =
    "M 800,400 Q 1000,300 1200,350 Q 1400,400 1500,500 Q 1600,600 1500,700 Q 1400,800 1200,750 Q 1000,700 900,650 Q 800,600 700,550 Q 600,500 700,450 Q 800,400 800,400 Z";

  // DRS segment paths (clipped portions of the main track)
  const drsSegment1 = "M 1000,300 Q 1100,320 1200,350";
  const drsSegment2 = "M 1400,400 Q 1450,450 1500,500";
  const drsSegment3 = "M 1000,700 Q 1100,720 1200,750";

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden bg-slate-950 pointer-events-none"
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 2000 1000"
        preserveAspectRatio="xMidYMid meet"
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Glow filter for track */}
          <filter id="trackGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Glow filter for car dot */}
          <filter id="carGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Main Circuit Outline */}
        <motion.path
          d={circuitPath}
          fill="none"
          stroke="rgba(59, 130, 246, 0.15)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#trackGlow)"
          style={{
            filter: "blur(0.5px) drop-shadow(0 0 4px rgba(59, 130, 246, 0.2))",
          }}
          initial={shouldReduceMotion ? {} : { pathLength: 0 }}
          animate={
            shouldReduceMotion
              ? {}
              : {
                  pathLength: 1,
                  transition: {
                    duration: 2.5,
                    ease: "easeInOut",
                  },
                }
          }
        />

        {/* DRS Segment 1 - Animated pulsing */}
        <motion.path
          d={drsSegment1}
          fill="none"
          stroke="rgba(34, 197, 94, 0.6)"
          strokeWidth="3"
          strokeLinecap="round"
          style={{
            filter: "blur(1px) drop-shadow(0 0 6px rgba(34, 197, 94, 0.8))",
          }}
          animate={
            shouldReduceMotion
              ? { opacity: 0 }
              : {
                  opacity: [0, 0.6, 0],
                  transition: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0,
                  },
                }
          }
        />

        {/* DRS Segment 2 - Animated pulsing */}
        <motion.path
          d={drsSegment2}
          fill="none"
          stroke="rgba(34, 197, 94, 0.6)"
          strokeWidth="3"
          strokeLinecap="round"
          style={{
            filter: "blur(1px) drop-shadow(0 0 6px rgba(34, 197, 94, 0.8))",
          }}
          animate={
            shouldReduceMotion
              ? { opacity: 0 }
              : {
                  opacity: [0, 0.6, 0],
                  transition: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.5,
                  },
                }
          }
        />

        {/* DRS Segment 3 - Animated pulsing */}
        <motion.path
          d={drsSegment3}
          fill="none"
          stroke="rgba(34, 197, 94, 0.6)"
          strokeWidth="3"
          strokeLinecap="round"
          style={{
            filter: "blur(1px) drop-shadow(0 0 6px rgba(34, 197, 94, 0.8))",
          }}
          animate={
            shouldReduceMotion
              ? { opacity: 0 }
              : {
                  opacity: [0, 0.6, 0],
                  transition: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 3,
                  },
                }
          }
        />

        {/* Race Car Dot with Motion Blur Tail */}
        <g>
          {/* Motion blur tail (lagging dot) */}
          <motion.circle
            r="4"
            fill="rgba(59, 130, 246, 0.3)"
            filter="url(#carGlow)"
            style={{
              filter: "blur(4px) drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))",
            }}
            animate={
              shouldReduceMotion
                ? { cx: 800, cy: 400 }
                : {
                    x: [
                      800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600,
                      1500, 1400, 1200, 1000, 900, 800, 700, 600, 700, 800,
                    ],
                    y: [
                      400, 380, 350, 340, 350, 400, 450, 500, 600, 700, 800,
                      750, 700, 650, 600, 550, 500, 450, 400,
                    ],
                    transition: {
                      duration: 25,
                      repeat: Infinity,
                      ease: "linear",
                      delay: 0.15, // Slight delay for tail effect
                    },
                  }
            }
          />

          {/* Main car dot */}
          <motion.circle
            r="3.5"
            fill="rgba(59, 130, 246, 0.7)"
            filter="url(#carGlow)"
            style={{
              filter: "blur(1px) drop-shadow(0 0 10px rgba(59, 130, 246, 0.9))",
            }}
            animate={
              shouldReduceMotion
                ? { cx: 800, cy: 400 }
                : {
                    x: [
                      800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600,
                      1500, 1400, 1200, 1000, 900, 800, 700, 600, 700, 800,
                    ],
                    y: [
                      400, 380, 350, 340, 350, 400, 450, 500, 600, 700, 800,
                      750, 700, 650, 600, 550, 500, 450, 400,
                    ],
                    transition: {
                      duration: 25,
                      repeat: Infinity,
                      ease: "linear",
                    },
                  }
            }
          />
        </g>
      </svg>
    </div>
  );
}

