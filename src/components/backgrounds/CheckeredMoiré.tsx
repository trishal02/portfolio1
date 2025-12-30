import { useEffect, useState } from "react";

export default function CheckeredMoiré() {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setShouldReduceMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setShouldReduceMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden bg-slate-950 pointer-events-none"
      aria-hidden="true"
    >
      {/* Base Checkered Pattern Layer 1 */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 20px,
              rgba(255, 255, 255, 0.03) 20px,
              rgba(255, 255, 255, 0.03) 21px,
              transparent 21px,
              transparent 40px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 20px,
              rgba(255, 255, 255, 0.03) 20px,
              rgba(255, 255, 255, 0.03) 21px,
              transparent 21px,
              transparent 40px
            )
          `,
          backgroundSize: "40px 40px",
          animation: shouldReduceMotion
            ? "none"
            : "moireWave1 25s ease-in-out infinite",
        }}
      />

      {/* Base Checkered Pattern Layer 2 - Slightly offset for moiré effect */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 21px,
              rgba(255, 255, 255, 0.03) 21px,
              rgba(255, 255, 255, 0.03) 22px,
              transparent 22px,
              transparent 42px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 21px,
              rgba(255, 255, 255, 0.03) 21px,
              rgba(255, 255, 255, 0.03) 22px,
              transparent 22px,
              transparent 42px
            )
          `,
          backgroundSize: "42px 42px",
          animation: shouldReduceMotion
            ? "none"
            : "moireWave2 30s ease-in-out infinite",
        }}
      />

      {/* Moiré Wave Distortion Layer */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 25px,
              rgba(255, 255, 255, 0.02) 25px,
              rgba(255, 255, 255, 0.02) 26px,
              transparent 26px,
              transparent 50px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 25px,
              rgba(255, 255, 255, 0.02) 25px,
              rgba(255, 255, 255, 0.02) 26px,
              transparent 26px,
              transparent 50px
            )
          `,
          backgroundSize: "50px 50px",
          filter: "blur(0.5px)",
          animation: shouldReduceMotion
            ? "none"
            : "moireWave3 35s ease-in-out infinite",
        }}
      />

      {/* Soft Blur Overlay to soften the pattern */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(2, 6, 23, 0.3) 100%)",
          filter: "blur(1px)",
        }}
      />
    </div>
  );
}

