import { motion, useReducedMotion } from "framer-motion";

export default function SuzukaCircuitBackground() {
  const shouldReduceMotion = useReducedMotion();

  // Suzuka-inspired figure-8 circuit path with crossover (custom, not official)
  // Creates a clear figure-eight with a visible crossover in the center
  // Path flows: Top → Right loop → Crossover center → Left loop → Return
  const circuitPath =
    "M 1000,250 Q 1200,230 1400,250 Q 1600,270 1700,350 Q 1800,430 1750,550 Q 1700,670 1500,750 Q 1300,830 1100,800 Q 900,770 750,700 Q 600,630 550,550 Q 500,470 550,400 Q 600,330 750,300 Q 900,270 1000,300 Q 1100,330 1250,370 Q 1400,410 1500,460 Q 1600,510 1700,570 Q 1800,630 1750,700 Q 1700,770 1500,800 Q 1300,830 1100,780 Q 900,730 750,650 Q 600,570 550,500 Q 500,430 550,360 Q 600,290 750,260 Q 900,230 1000,250 Z";

  // DRS segment paths (short subpaths along the track - updated for new path)
  const drsSegment1 = "M 1400,250 Q 1500,310 1600,350"; // First straight section
  const drsSegment2 = "M 1250,370 Q 1325,390 1400,410"; // Second straight section (crossover area)
  const drsSegment3 = "M 1100,780 Q 1000,755 900,730"; // Third straight section

  // Sector positions (approximate along the new track path)
  const sector1Pos = { x: 1550, y: 330 };
  const sector2Pos = { x: 1325, y: 390 };
  const sector3Pos = { x: 1000, y: 765 };

  // Start/finish line position (at the beginning of the track)
  const startFinishPos = { x: 1000, y: 250 };

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden bg-slate-950 pointer-events-none"
      aria-hidden="true"
    >
      {/* TEMP DEBUG MARKER - Remove after visibility confirmed */}
      <div
        className="fixed top-2 left-2 z-[9999] text-green-500 font-mono text-xs font-bold opacity-100"
        style={{ zIndex: 9999 }}
      >
        BG DEBUG VISIBLE
      </div>

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

        {/* Main Circuit Outline - TEMP INCREASED VISIBILITY */}
        <motion.path
          d={circuitPath}
          fill="none"
          stroke="rgba(59, 130, 246, 0.8)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#suzukaTrackGlow)"
          style={{
            filter: "blur(0.5px) drop-shadow(0 0 6px rgba(59, 130, 246, 0.8))",
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

        {/* DRS Segment 1 - Subtle pulsing */}
        <motion.path
          d={drsSegment1}
          fill="none"
          stroke="rgba(34, 197, 94, 0.25)"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{
            filter: "blur(0.5px) drop-shadow(0 0 4px rgba(34, 197, 94, 0.4))",
          }}
          animate={
            shouldReduceMotion
              ? { opacity: 0 }
              : {
                  opacity: [0.15, 0.35, 0.15],
                  transition: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0,
                  },
                }
          }
        />

        {/* DRS Segment 2 - Subtle pulsing */}
        <motion.path
          d={drsSegment2}
          fill="none"
          stroke="rgba(34, 197, 94, 0.25)"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{
            filter: "blur(0.5px) drop-shadow(0 0 4px rgba(34, 197, 94, 0.4))",
          }}
          animate={
            shouldReduceMotion
              ? { opacity: 0 }
              : {
                  opacity: [0.15, 0.35, 0.15],
                  transition: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                  },
                }
          }
        />

        {/* DRS Segment 3 - Subtle pulsing */}
        <motion.path
          d={drsSegment3}
          fill="none"
          stroke="rgba(34, 197, 94, 0.25)"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{
            filter: "blur(0.5px) drop-shadow(0 0 4px rgba(34, 197, 94, 0.4))",
          }}
          animate={
            shouldReduceMotion
              ? { opacity: 0 }
              : {
                  opacity: [0.15, 0.35, 0.15],
                  transition: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 4,
                  },
                }
          }
        />

        {/* Sector Labels */}
        <text
          x={sector1Pos.x}
          y={sector1Pos.y}
          fontSize="11"
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
          fontSize="11"
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
          fontSize="11"
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

        {/* Race Cars - 20 cars spaced along the track */}
        <g>
          {Array.from({ length: 20 }, (_, i) => {
            // Space cars evenly along the track (each car delayed by 1.75s from the previous)
            const delay = i * 1.75;
            // Vary colors slightly for visual interest (blue/cyan spectrum)
            const hue = 200 + (i % 5) * 10; // 200-240 range
            const tailColor = `hsla(${hue}, 70%, 60%, 0.25)`;

            return (
              <g key={i}>
                {/* Motion blur tail (lagging dot) */}
                <motion.circle
                  r="3.5"
                  fill={tailColor}
                  filter="url(#suzukaCarGlow)"
                  style={{
                    filter: `blur(3px) drop-shadow(0 0 6px hsla(${hue}, 70%, 60%, 0.4))`,
                  }}
                  animate={
                    shouldReduceMotion
                      ? { cx: 1000, cy: 250 }
                      : {
                          x: [
                            1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700,
                            1800, 1750, 1700, 1500, 1300, 1100, 900, 750, 600,
                            550, 500, 550, 600, 750, 900, 1000, 1100, 1250,
                            1400, 1500, 1600, 1700, 1750, 1800, 1700, 1500,
                            1300, 1100, 900, 750, 600, 550, 500, 550, 600, 750,
                            900, 1000,
                          ],
                          y: [
                            250, 240, 230, 250, 270, 310, 350, 430, 550, 670,
                            750, 830, 800, 770, 700, 630, 550, 470, 400, 330,
                            300, 270, 300, 330, 370, 410, 460, 510, 570, 630,
                            700, 770, 800, 780, 730, 650, 570, 500, 430, 360,
                            290, 260, 230, 250,
                          ],
                          transition: {
                            duration: 35,
                            repeat: Infinity,
                            ease: "linear",
                            delay: delay + 0.2, // Slight delay for tail effect
                          },
                        }
                  }
                />

                {/* Main car dot - TEMP INCREASED VISIBILITY */}
                <motion.circle
                  r="4"
                  fill={`hsla(${hue}, 70%, 60%, 0.8)`}
                  filter="url(#suzukaCarGlow)"
                  style={{
                    filter: `blur(0.5px) drop-shadow(0 0 12px hsla(${hue}, 70%, 60%, 0.9))`,
                  }}
                  animate={
                    shouldReduceMotion
                      ? { cx: 1000, cy: 250 }
                      : {
                          x: [
                            1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700,
                            1800, 1750, 1700, 1500, 1300, 1100, 900, 750, 600,
                            550, 500, 550, 600, 750, 900, 1000, 1100, 1250,
                            1400, 1500, 1600, 1700, 1750, 1800, 1700, 1500,
                            1300, 1100, 900, 750, 600, 550, 500, 550, 600, 750,
                            900, 1000,
                          ],
                          y: [
                            250, 240, 230, 250, 270, 310, 350, 430, 550, 670,
                            750, 830, 800, 770, 700, 630, 550, 470, 400, 330,
                            300, 270, 300, 330, 370, 410, 460, 510, 570, 630,
                            700, 770, 800, 780, 730, 650, 570, 500, 430, 360,
                            290, 260, 230, 250,
                          ],
                          transition: {
                            duration: 35,
                            repeat: Infinity,
                            ease: "linear",
                            delay: delay,
                          },
                        }
                  }
                />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
