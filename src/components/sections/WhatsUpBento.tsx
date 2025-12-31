import { useState } from "react";
import Section from "../layout/Section";
import { whatsUpItems } from "../../data/whatsUp";

export default function WhatsUpBento() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const handleCardClick = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleCardKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick(index);
    } else if (e.key === "Escape") {
      setActiveIndex(null);
    }
  };

  const getGridClasses = (size: "lg" | "md" | "sm") => {
    const base =
      "relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-racing-red";

    if (size === "lg") {
      return `${base} col-span-1 md:col-span-2 row-span-1 md:row-span-2 min-h-[300px] md:min-h-[400px]`;
    } else if (size === "md") {
      return `${base} col-span-1 min-h-[250px] md:min-h-[300px]`;
    } else {
      return `${base} col-span-1 min-h-[200px] md:min-h-[250px]`;
    }
  };

  return (
    <Section id="whats-up" title="What's Up" className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-fr">
        {whatsUpItems.map((item, index) => {
          const isActive = activeIndex === index;
          const isHovered = isActive;

          return (
            <div
              key={item.id}
              className={`group ${getGridClasses(item.size)}`}
              style={{
                borderColor: isHovered
                  ? "rgba(220, 38, 38, 0.5)"
                  : "rgba(255, 255, 255, 0.1)",
                boxShadow: isHovered
                  ? "0 0 20px rgba(220, 38, 38, 0.3), 0 8px 16px rgba(0, 0, 0, 0.3)"
                  : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
              onClick={() => handleCardClick(index)}
              onKeyDown={(e) => handleCardKeyDown(e, index)}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              onFocus={() => setActiveIndex(index)}
              onBlur={(e) => {
                setTimeout(() => {
                  if (!e.currentTarget.contains(document.activeElement)) {
                    setActiveIndex(null);
                  }
                }, 150);
              }}
              tabIndex={0}
              role="button"
              aria-label={`${item.title} - ${item.subtitle}`}
            >
              {/* Image Container */}
              <div className="absolute inset-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out"
                  style={{
                    transform:
                      isHovered && !prefersReducedMotion
                        ? "scale(1.05)"
                        : "scale(1)",
                  }}
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.style.background =
                        "linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(15, 23, 42, 0.4) 100%)";
                    }
                  }}
                />
              </div>

              {/* Gradient Overlay */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.5) 40%, transparent 70%)",
                  opacity: isHovered ? 1 : 0.6,
                }}
              />

              {/* Content Overlay - shows on hover/focus/active */}
              <div
                className={`absolute inset-0 flex flex-col justify-end p-4 md:p-6 pointer-events-none transition-opacity duration-500 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              >
                <div>
                  <h3
                    className="text-lg md:text-xl lg:text-2xl font-display font-bold mb-1"
                    style={{ color: "#FFFFFF" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-xs md:text-sm font-body opacity-90"
                    style={{ color: "#DC2626" }}
                  >
                    {item.subtitle}
                  </p>
                  {item.href && (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-xs md:text-sm font-body underline opacity-80 hover:opacity-100 transition-opacity"
                      style={{ color: "#DC2626" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Visit →
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
