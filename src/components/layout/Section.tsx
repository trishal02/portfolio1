import type { ReactNode } from "react";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";

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
  const { elementRef, isVisible } = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
    triggerOnce: true,
  });

  return (
    <section
      ref={elementRef}
      id={id}
      className={`relative py-24 px-6 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      aria-labelledby={title ? `${id}-title` : undefined}
    >
      {/* Section Divider */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px mb-12"
        style={{
          background: "linear-gradient(to right, transparent, rgba(220, 38, 38, 0.5), transparent)",
        }}
      />
      
      {title && (
        <h2
          id={`${id}-title`}
          className="text-sm font-display font-bold tracking-[0.2em] uppercase mb-16 text-center"
          style={{ color: "#DC2626" }}
        >
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
