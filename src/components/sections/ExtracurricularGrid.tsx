import { useState } from "react";
import Section from "../layout/Section";
import { extracurricularItems } from "../../data/extracurriculars";

export default function ExtracurricularGrid() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const handleTileClick = (index: number) => {
    // Toggle overlay on mobile/tap
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleTileKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleTileClick(index);
    } else if (e.key === "Escape") {
      setActiveIndex(null);
    }
  };

  return (
    <Section
      id="extracurriculars"
      title="What's Up"
      className="max-w-7xl mx-auto"
    >
      {/* Mobile helper text */}
      <p
        className="text-xs text-center mb-8 md:hidden opacity-60"
        style={{ color: "#9CA3AF" }}
      >
        Tap a tile to view
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {extracurricularItems.map((item, index) => {
          const isActive = activeIndex === index;

          return (
            <div
              key={index}
              className="group relative rounded-2xl overflow-hidden border cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-racing-red"
              style={{
                borderColor: "rgba(255, 255, 255, 0.1)",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                aspectRatio: "1",
              }}
              onClick={() => handleTileClick(index)}
              onKeyDown={(e) => handleTileKeyDown(e, index)}
              onFocus={() => setActiveIndex(index)}
              onBlur={(e) => {
                // Clear active state when focus leaves (with small delay for click events)
                setTimeout(() => {
                  if (!e.currentTarget.contains(document.activeElement)) {
                    setActiveIndex(null);
                  }
                }, 150);
              }}
              tabIndex={0}
              role="button"
              aria-label={`View ${item.name}${
                item.caption ? ` - ${item.caption}` : ""
              }`}
            >
              {/* Image Container */}
              <div className="absolute inset-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className={`w-full h-full object-cover transition-transform duration-500 ease-out ${
                    prefersReducedMotion ? "" : "md:group-hover:scale-105"
                  } ${isActive && !prefersReducedMotion ? "scale-105" : ""}`}
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to a gradient if image fails to load
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

              {/* Overlay - shows on active (mobile tap/focus) or hover (desktop) */}
              <div
                className={`absolute inset-0 flex flex-col justify-end p-4 md:p-6 pointer-events-none transition-opacity duration-500 ease-out ${
                  isActive
                    ? "opacity-100"
                    : "opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
                }`}
                style={{
                  background:
                    "linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                }}
              >
                <div>
                  <h3
                    className="text-lg md:text-xl font-display font-bold mb-1"
                    style={{ color: "#FFFFFF" }}
                  >
                    {item.name}
                  </h3>
                  {item.caption && (
                    <p
                      className="text-xs md:text-sm font-body opacity-90"
                      style={{ color: "#DC2626" }}
                    >
                      {item.caption}
                    </p>
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
