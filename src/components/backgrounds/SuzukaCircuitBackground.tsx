import { motion, useReducedMotion } from "framer-motion";

export default function SuzukaCircuitBackground() {
  const shouldReduceMotion = useReducedMotion();

  // Suzuka-inspired figure-8 circuit path (custom, not official)
  const circuitPath =
    "M 1000,500 Q 1200,400 1400,450 Q 1600,500 1700,600 Q 1800,700 1700,800 Q 1600,900 1400,850 Q 1200,800 1100,750 Q 1000,700 900,650 Q 800,600 700,550 Q 600,500 700,450 Q 800,400 900,450 Q 1000,500 1000,500 Z";

  // DRS segment paths (short subpaths along the track)
  const drsSegment1 = "M 1200,400 Q 1300,420 1400,450"; // First straight
  const drsSegment2 = "M 1600,500 Q 1650,550 1700,600"; // Second straight
  const drsSegment3 = "M 1200,800 Q 1150,820 1100,750"; // Third straight

  // Sector positions (approximate along the track)
  const sector1Pos = { x: 1300, y: 420 };
  const sector2Pos = { x: 1650, y: 650 };
  const sector3Pos = { x: 1050, y: 725 };

  // Start/finish line position
  const startFinishPos = { x: 1000, y: 500 };

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
          <filter id="suzukaTrackGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Glow filter for car dot */}
          <filter id="suzukaCarGlow">
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
          stroke="rgba(59, 130, 246, 0.14)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#suzukaTrackGlow)"
          style={{
            filter: "blur(0.5px) drop-shadow(0 0 4px rgba(59, 130, 246, 0.18))",
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

        {/* Sector Labels */}
        <text
          x={sector1Pos.x}
          y={sector1Pos.y}
          fontSize="12"
          fill="rgba(59, 130, 246, 0.12)"
          fontFamily="monospace"
          textAnchor="middle"
          opacity={0.12}
        >
          S1
        </text>
        <text
          x={sector2Pos.x}
          y={sector2Pos.y}
          fontSize="12"
          fill="rgba(59, 130, 246, 0.12)"
          fontFamily="monospace"
          textAnchor="middle"
          opacity={0.12}
        >
          S2
        </text>
        <text
          x={sector3Pos.x}
          y={sector3Pos.y}
          fontSize="12"
          fill="rgba(59, 130, 246, 0.12)"
          fontFamily="monospace"
          textAnchor="middle"
          opacity={0.12}
        >
          S3
        </text>

        {/* Start/Finish Marker */}
        <g opacity={0.1}>
          <line
            x1={startFinishPos.x - 15}
            y1={startFinishPos.y}
            x2={startFinishPos.x + 15}
            y2={startFinishPos.y}
            stroke="rgba(220, 38, 38, 0.15)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <text
            x={startFinishPos.x}
            y={startFinishPos.y - 8}
            fontSize="8"
            fill="rgba(220, 38, 38, 0.12)"
            fontFamily="monospace"
            textAnchor="middle"
          >
            S/F
          </text>
        </g>

        {/* Race Car Dot with Motion Blur Tail */}
        <g>
          {/* Motion blur tail (lagging dot) */}
          <motion.circle
            r="4"
            fill="rgba(59, 130, 246, 0.3)"
            filter="url(#suzukaCarGlow)"
            style={{
              filter: "blur(4px) drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))",
            }}
            animate={
              shouldReduceMotion
                ? { cx: 1000, cy: 500 }
                : {
                    x: [
                      1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800,
                      1700, 1600, 1400, 1200, 1100, 1000, 900, 800, 700, 800,
                      900, 1000,
                    ],
                    y: [
                      500, 480, 450, 420, 450, 500, 550, 600, 700, 800, 900,
                      850, 800, 750, 700, 650, 550, 500, 450, 450, 500,
                    ],
                    transition: {
                      duration: 30,
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
            filter="url(#suzukaCarGlow)"
            style={{
              filter: "blur(1px) drop-shadow(0 0 10px rgba(59, 130, 246, 0.9))",
            }}
            animate={
              shouldReduceMotion
                ? { cx: 1000, cy: 500 }
                : {
                    x: [
                      1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800,
                      1700, 1600, 1400, 1200, 1100, 1000, 900, 800, 700, 800,
                      900, 1000,
                    ],
                    y: [
                      500, 480, 450, 420, 450, 500, 550, 600, 700, 800, 900,
                      850, 800, 750, 700, 650, 550, 500, 450, 450, 500,
                    ],
                    transition: {
                      duration: 30,
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

