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
      className={`carbon-fiber border rounded-lg p-6 transition-all duration-300 ${
        hover ? "hover:glow-red hover:scale-[1.02]" : ""
      } ${className}`}
      style={{ borderColor: "rgba(220, 38, 38, 0.3)" }}
    >
      {children}
    </div>
  );
}
