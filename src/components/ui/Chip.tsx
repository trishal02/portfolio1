import type { ReactNode } from "react";

interface ChipProps {
  children: ReactNode;
  variant?: "soft" | "medium" | "hard" | "default";
  className?: string;
}

export default function Chip({
  children,
  variant = "default",
  className = "",
}: ChipProps) {
  const baseClasses =
    "inline-flex items-center px-3 py-1 rounded-full text-xs font-display font-semibold uppercase tracking-wider border transition-all duration-300";

  const variantClasses = {
    soft: "bg-green/20 text-green border-green/40 hover:bg-green/30",
    medium: "bg-yellow/20 text-yellow border-yellow/40 hover:bg-yellow/30",
    hard: "bg-racing-red/20 text-racing-red border-racing-red/40 hover:bg-racing-red/30",
    default:
      "bg-metallic-gray/20 text-metallic-gray-light border-metallic-gray/40 hover:bg-metallic-gray/30",
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}

