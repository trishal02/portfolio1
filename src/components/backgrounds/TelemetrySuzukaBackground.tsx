import { motion, useReducedMotion } from "framer-motion";

export default function TelemetrySuzukaBackground() {
  const shouldReduceMotion = useReducedMotion();

  // Trace line path data (smooth telemetry-like curves)
  const tracePath1 =
    "M 0,300 Q 200,200 400,250 T 800,200 T 1200,280 T 1600,240 T 2000,260";
  const tracePath2 =
    "M 0,500 Q 250,450 500,480 T 1000,420 T 1500,460 T 2000,440";

  // Suzuka-inspired circuit path (stylized figure-eight)
  const circuitPath =
    "M 1200,600 Q 1400,500 1600,550 Q 1800,600 1700,700 Q 1600,800 1400,750 Q 1200,700 1100,650 Q 1000,600 1100,550 Q 1200,500 1400,550 Q 1600,600 1500,700 Q 1400,800 1200,750 Q 1000,700 900,650 Q 800,600 900,550 Q 1000,500 1200,550 Z";

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden bg-slate-950 pointer-events-none"
      aria-hidden="true"
    >
      {/* Grid Layer - CSS Background */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px, 40px 40px, 200px 200px, 200px 200px",
        }}
      />

      {/* Axis Ticks Layer */}
      <div
        className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 39px,
              rgba(59, 130, 246, 0.3) 39px,
              rgba(59, 130, 246, 0.3) 40px,
              transparent 40px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 39px,
              rgba(59, 130, 246, 0.3) 39px,
              rgba(59, 130, 246, 0.3) 40px,
              transparent 40px
            )
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Vignette at edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(2, 6, 23, 0.4) 100%)",
        }}
      />

      {/* SVG Layer for Trace Lines and Circuit */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ overflow: "visible" }}
        preserveAspectRatio="none"
      >
        {/* Trace Line 1 - Throttle style (greenish) */}
        <motion.path
          d={tracePath1}
          fill="none"
          stroke="rgba(34, 197, 94, 0.3)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="20 20"
          style={{
            filter: "blur(1px) drop-shadow(0 0 3px rgba(34, 197, 94, 0.4))",
          }}
          animate={
            shouldReduceMotion
              ? {}
              : {
                  strokeDashoffset: [0, -2000],
                  transition: {
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                  },
                }
          }
        />

        {/* Trace Line 2 - Brake style (reddish) */}
        <motion.path
          d={tracePath2}
          fill="none"
          stroke="rgba(239, 68, 68, 0.25)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="20 20"
          style={{
            filter: "blur(1px) drop-shadow(0 0 3px rgba(239, 68, 68, 0.3))",
          }}
          animate={
            shouldReduceMotion
              ? {}
              : {
                  strokeDashoffset: [0, -2000],
                  transition: {
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 5,
                  },
                }
          }
        />

        {/* Glowing Dot 1 - Following Trace 1 */}
        <motion.circle
          r="4"
          fill="rgba(34, 197, 94, 0.6)"
          style={{
            filter: "blur(2px) drop-shadow(0 0 8px rgba(34, 197, 94, 0.8))",
          }}
          animate={
            shouldReduceMotion
              ? { cx: 0, cy: 300 }
              : {
                  x: [0, 2000],
                  y: [300, 200, 250, 200, 280, 240, 260, 240, 260, 240, 260],
                  transition: {
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                  },
                }
          }
        />

        {/* Glowing Dot 2 - Following Trace 2 */}
        <motion.circle
          r="4"
          fill="rgba(239, 68, 68, 0.5)"
          style={{
            filter: "blur(2px) drop-shadow(0 0 8px rgba(239, 68, 68, 0.7))",
          }}
          animate={
            shouldReduceMotion
              ? { cx: 0, cy: 500 }
              : {
                  x: [0, 2000],
                  y: [500, 450, 480, 420, 460, 440, 460, 440, 460, 440, 460],
                  transition: {
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 5,
                  },
                }
          }
        />

        {/* Suzuka-inspired Circuit Outline */}
        <motion.path
          d={circuitPath}
          fill="none"
          stroke="rgba(59, 130, 246, 0.08)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: "blur(2px) drop-shadow(0 0 10px rgba(59, 130, 246, 0.15))",
            transformOrigin: "center",
          }}
          animate={
            shouldReduceMotion
              ? {}
              : {
                  x: [0, 10, -5, 5, 0],
                  y: [0, -5, 10, -5, 0],
                  rotate: [0, 0.5, -0.3, 0.2, 0],
                  transition: {
                    duration: 35,
                    repeat: Infinity,
                    ease: "linear",
                  },
                }
          }
        />
      </svg>
    </div>
  );
}
