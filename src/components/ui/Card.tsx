import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({
  children,
  className = "",
  hover = true,
}: CardProps) {
  return (
    <div
      className={`carbon-fiber border rounded-lg p-5 transition-all duration-300 ${
        hover ? "hover:glow-red hover:scale-[1.02] hover:-translate-y-1" : ""
      } ${className}`}
      style={{
        borderColor: "rgba(220, 38, 38, 0.3)",
        backgroundColor: "rgba(15, 23, 42, 0.4)", // Glass panel: slate-900/40
        backdropFilter: "blur(12px)",
        backgroundImage: `
          linear-gradient(135deg, rgba(220, 38, 38, 0.02) 0%, transparent 50%),
          repeating-linear-gradient(
            0deg,
            rgba(255, 255, 255, 0.01) 0px,
            transparent 1px,
            transparent 2px,
            rgba(255, 255, 255, 0.01) 3px
          )
        `,
      }}
    >
      {children}
    </div>
  );
}
