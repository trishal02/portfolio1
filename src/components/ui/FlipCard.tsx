import { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";

interface FlipCardProps {
  front: ReactNode;
  back: ReactNode;
  className?: string;
}

export default function FlipCard({ front, back, className = "" }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(hover: none)").matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle click/tap for mobile
  const handleClick = () => {
    if (isMobile) {
      setIsFlipped(!isFlipped);
    }
  };

  // Handle keyboard (Enter/Space)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsFlipped(!isFlipped);
    }
  };

  // Reset flip when card loses focus (for keyboard navigation)
  useEffect(() => {
    const handleFocusOut = (e: FocusEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.relatedTarget as Node)) {
        if (!isMobile) {
          setIsFlipped(false);
        }
      }
    };

    const card = cardRef.current;
    if (card) {
      card.addEventListener("focusout", handleFocusOut);
      return () => card.removeEventListener("focusout", handleFocusOut);
    }
  }, [isMobile]);

  return (
    <div
      ref={cardRef}
      className={`flip-card-wrapper ${isFlipped ? "flipped" : ""} ${className}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      role="button"
      aria-label="Flip card to view coursework"
    >
      <div
        className="flip-card-inner"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front Side */}
        <div className="flip-card-front" style={{ backfaceVisibility: "hidden" }}>
          {front}
        </div>

        {/* Back Side */}
        <div className="flip-card-back" style={{ backfaceVisibility: "hidden" }}>
          {back}
        </div>
      </div>
    </div>
  );
}
