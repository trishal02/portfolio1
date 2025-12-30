import type { ReactNode } from "react";

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  title?: string;
}

export default function Section({
  id,
  children,
  className = "",
  title,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`relative py-20 px-6 ${className}`}
      aria-labelledby={title ? `${id}-title` : undefined}
    >
      {title && (
        <h2
          id={`${id}-title`}
          className="text-sm font-display font-bold tracking-[0.2em] uppercase mb-12 text-center"
          style={{ color: "#DC2626" }}
        >
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
