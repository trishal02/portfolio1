import { useEffect, useState } from "react";

export default function BackgroundAnimation() {
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
      className="fixed inset-0 overflow-hidden"
      style={{
        pointerEvents: "none",
        zIndex: -25,
      }}
      aria-hidden="true"
    >
      {/* Base dark background - semi-transparent to show aurora */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(10, 10, 10, 0.7) 0%, rgba(0, 0, 0, 0.9) 100%)",
        }}
      />

      {/* Aurora Blob 1 - More visible */}
      <div
        className={`aurora-blob-1 absolute`}
        style={{
          width: "900px",
          height: "900px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, rgba(139, 92, 246, 0.5) 40%, rgba(99, 102, 241, 0.3) 60%, transparent 75%)",
          filter: "blur(100px)",
          top: "10%",
          left: "10%",
          animation: shouldReduceMotion
            ? "none"
            : "auroraMove1 30s ease-in-out infinite",
        }}
      />

      {/* Aurora Blob 2 - More visible */}
      <div
        className={`aurora-blob-2 absolute`}
        style={{
          width: "850px",
          height: "850px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.55) 0%, rgba(59, 130, 246, 0.45) 40%, rgba(99, 102, 241, 0.3) 60%, transparent 75%)",
          filter: "blur(110px)",
          top: "60%",
          right: "15%",
          animation: shouldReduceMotion
            ? "none"
            : "auroraMove2 35s ease-in-out infinite 5s",
        }}
      />

      {/* Aurora Blob 3 - More visible */}
      <div
        className={`aurora-blob-3 absolute`}
        style={{
          width: "750px",
          height: "750px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99, 102, 241, 0.5) 0%, rgba(139, 92, 246, 0.4) 40%, rgba(59, 130, 246, 0.25) 60%, transparent 75%)",
          filter: "blur(90px)",
          bottom: "20%",
          left: "50%",
          animation: shouldReduceMotion
            ? "none"
            : "auroraMove3 40s ease-in-out infinite 10s",
        }}
      />

      {/* Aurora Blob 4 - More visible */}
      <div
        className={`aurora-blob-4 absolute`}
        style={{
          width: "800px",
          height: "800px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(59, 130, 246, 0.45) 0%, rgba(99, 102, 241, 0.35) 40%, rgba(139, 92, 246, 0.25) 60%, transparent 75%)",
          filter: "blur(95px)",
          top: "40%",
          left: "60%",
          animation: shouldReduceMotion
            ? "none"
            : "auroraMove4 38s ease-in-out infinite 15s",
        }}
      />

      {/* Subtle Grain Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(255, 255, 255, 0.03) 2px,
              rgba(255, 255, 255, 0.03) 4px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(255, 255, 255, 0.03) 2px,
              rgba(255, 255, 255, 0.03) 4px
            )
          `,
          backgroundSize: "4px 4px",
        }}
      />

      {/* Subtle Telemetry Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Subtle Star/Dot Layer */}
      {!shouldReduceMotion && (
        <div className="absolute inset-0 hidden md:block">
          {Array.from({ length: 30 }).map((_, i) => {
            // Generate random but consistent positions
            const seed = i * 137.508; // Golden angle for distribution
            const x = (Math.sin(seed) * 0.5 + 0.5) * 100;
            const y = (Math.cos(seed * 2) * 0.5 + 0.5) * 100;
            const delay = (i * 0.3) % 20; // Stagger delays
            const duration = 40 + (i % 10) * 5; // Vary duration 40-85s
            const size = 1 + (i % 3) * 0.5; // Vary size 1-2px

            return (
              <div
                key={i}
                className="absolute star-dot"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.4)",
                  boxShadow: `0 0 ${size * 2}px rgba(255, 255, 255, 0.3)`,
                  animation: `starFloat${
                    i % 4
                  } ${duration}s ease-in-out infinite`,
                  animationDelay: `${delay}s`,
                  opacity: 0.3 + (i % 3) * 0.1, // Vary opacity 0.3-0.5
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
