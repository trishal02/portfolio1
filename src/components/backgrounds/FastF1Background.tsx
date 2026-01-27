/**
 * FastF1Background — Lightweight, pure-CSS F1-themed background.
 * No Framer Motion, no SVG filters, no blur() or drop-shadow().
 * Full-screen fixed layer with dark base, subtle gradients, diagonal grid, vignette, optional grain.
 */

export default function FastF1Background() {
  console.log("[FastF1Background] mounted");
  return (
    <div
      className="fixed inset-0 overflow-hidden bg-slate-950"
      style={{
        zIndex: 0,
        pointerEvents: "none",
        // Base + 2–3 subtle radial gradients (no blur)
        background: `
          radial-gradient(ellipse 85% 55% at 50% 0%, rgba(30, 27, 75, 0.35), transparent 60%),
          radial-gradient(ellipse 55% 45% at 85% 55%, rgba(59, 130, 246, 0.08), transparent 55%),
          radial-gradient(ellipse 50% 35% at 15% 85%, rgba(139, 92, 246, 0.06), transparent 50%),
          linear-gradient(180deg, #0f172a 0%, #020617 100%)
        `,
        backgroundPosition: "0 0, 0 0, 0 0, 0 0",
        backgroundRepeat: "repeat, repeat, repeat, repeat",
        backgroundSize: "100% 100%, 100% 100%, 100% 100%, 100% 100%",
      }}
      aria-hidden="true"
    >
      {/* Faint diagonal grid — repeating-linear-gradient only */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              115deg,
              transparent 0px,
              transparent 1px,
              rgba(59, 130, 246, 0.12) 1px,
              rgba(59, 130, 246, 0.12) 2px
            ),
            repeating-linear-gradient(
              25deg,
              transparent 0px,
              transparent 1px,
              rgba(59, 130, 246, 0.08) 1px,
              rgba(59, 130, 246, 0.08) 2px
            )
          `,
          backgroundSize: "24px 24px, 24px 24px",
        }}
      />

      {/* Subtle vignette — radial gradient only */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(2, 6, 23, 0.5) 100%)",
        }}
      />

      {/* Optional grain overlay — pure CSS dots pattern, no SVG/filters, opacity ~0.04 */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.4) 0.5px, transparent 0.5px),
            radial-gradient(circle at 80% 70%, rgba(255,255,255,0.35) 0.5px, transparent 0.5px),
            radial-gradient(circle at 40% 80%, rgba(255,255,255,0.3) 0.5px, transparent 0.5px)
          `,
          backgroundSize: "6px 6px, 5px 5px, 7px 7px",
          backgroundRepeat: "repeat",
        }}
      />

      {/* DEBUG WATERMARK — Remove this block after verifying FastF1Background is visible (search "DEBUG WATERMARK" in this file). */}
      <div
        className="fixed bottom-3 right-3 px-2 py-1 rounded font-mono text-xs pointer-events-none"
        style={{
          zIndex: 9998,
          opacity: 0.6,
          color: "rgba(34, 197, 94, 0.95)",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        FAST BG ACTIVE
      </div>
    </div>
  );
}
