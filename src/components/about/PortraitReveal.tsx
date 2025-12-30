import { useEffect, useRef, useState, useCallback } from "react";

interface PortraitRevealProps {
  frontSrc?: string;
  revealSrc?: string;
  radiusPx?: number;
}

export default function PortraitReveal({
  frontSrc = "/5E86B2BB-4491-4660-8F5C-070DAD97CD40_1_105_c.jpeg",
  revealSrc = "/ferrari_logo.jpeg",
  radiusPx = 140,
}: PortraitRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const targetXRef = useRef<number>(0);
  const targetYRef = useRef<number>(0);
  const currentXRef = useRef<number>(0);
  const currentYRef = useRef<number>(0);
  const [maskX, setMaskX] = useState(0); // Pixels
  const [maskY, setMaskY] = useState(0); // Pixels
  const [maskAlpha, setMaskAlpha] = useState(0); // 0-1 for opacity
  const prefersReducedMotionRef = useRef(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  // Smooth lerp function for easing
  const lerp = useCallback((start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  }, []);

  // Animation loop for smooth cursor following
  useEffect(() => {
    if (prefersReducedMotionRef.current) return;

    const animate = () => {
      const diffX = Math.abs(currentXRef.current - targetXRef.current);
      const diffY = Math.abs(currentYRef.current - targetYRef.current);

      if (diffX > 0.5 || diffY > 0.5) {
        currentXRef.current = lerp(currentXRef.current, targetXRef.current, 0.15);
        currentYRef.current = lerp(currentYRef.current, targetYRef.current, 0.15);
        setMaskX(currentXRef.current);
        setMaskY(currentYRef.current);
        rafRef.current = requestAnimationFrame(animate);
      } else {
        currentXRef.current = targetXRef.current;
        currentYRef.current = targetYRef.current;
        setMaskX(currentXRef.current);
        setMaskY(currentYRef.current);
      }
    };

    if (maskAlpha > 0) {
      rafRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [lerp, maskAlpha]);

  // Update mask position (in pixels relative to container)
  const updateMask = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left; // Pixels from left
      const y = clientY - rect.top; // Pixels from top

      targetXRef.current = x;
      targetYRef.current = y;

      if (prefersReducedMotionRef.current) {
        // No easing for reduced motion - update directly
        currentXRef.current = x;
        currentYRef.current = y;
        setMaskX(x);
        setMaskY(y);
      }
    },
    []
  );

  // Handle mouse move
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      updateMask(e.clientX, e.clientY);
    },
    [updateMask]
  );

  // Handle touch move
  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      e.preventDefault(); // Prevent scrolling while dragging
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        updateMask(touch.clientX, touch.clientY);
      }
    },
    [updateMask]
  );

  // Handle hover enter
  const handleMouseEnter = useCallback(() => {
    setMaskAlpha(1);
  }, []);

  // Handle hover leave
  const handleMouseLeave = useCallback(() => {
    setMaskAlpha(0);
  }, []);

  // Handle touch start (mobile)
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        updateMask(touch.clientX, touch.clientY);
      }
    },
    [updateMask]
  );

  // Handle touch end (mobile) - toggle reveal
  const handleTouchEnd = useCallback(() => {
    setMaskAlpha((prev) => (prev === 0 ? 1 : 0));
  }, []);

  // Initialize and update CSS variables
  useEffect(() => {
    if (containerRef.current) {
      // Initialize with center position if not set
      const initialX = maskX || (containerRef.current.offsetWidth / 2);
      const initialY = maskY || (containerRef.current.offsetHeight / 2);
      
      containerRef.current.style.setProperty("--mx", `${initialX}px`);
      containerRef.current.style.setProperty("--my", `${initialY}px`);
      containerRef.current.style.setProperty("--r", `${radiusPx}px`);
      containerRef.current.style.setProperty("--a", `${maskAlpha}`);
    }
  }, []); // Initialize once

  // Update CSS variables on changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty("--mx", `${maskX}px`);
      containerRef.current.style.setProperty("--my", `${maskY}px`);
      containerRef.current.style.setProperty("--r", `${radiusPx}px`);
      containerRef.current.style.setProperty("--a", `${maskAlpha}`);
    }
  }, [maskX, maskY, radiusPx, maskAlpha]);

  // Log warnings if images don't load
  const handleImageError = useCallback((src: string, type: string) => {
    console.warn(
      `[PortraitReveal] Failed to load ${type} image: ${src}. Please ensure the file exists in /public.`
    );
  }, []);

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="relative rounded-2xl overflow-hidden border"
        style={{
          borderColor: "rgba(220, 38, 38, 0.3)",
          aspectRatio: "4/5",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Ferrari reveal layer (bottom) */}
        <div className="absolute inset-0">
          <img
            src={revealSrc}
            alt="Ferrari reveal"
            className="w-full h-full object-cover"
            onError={(e) => {
              handleImageError(revealSrc, "Ferrari reveal");
              // Fallback to a red gradient pattern if image doesn't exist
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const parent = target.parentElement;
              if (parent) {
                parent.style.background =
                  "repeating-linear-gradient(45deg, #DC2626 0px, #DC2626 20px, #B91C1C 20px, #B91C1C 40px)";
              }
            }}
          />
        </div>

        {/* Portrait image (top) - with mask that creates transparent circle to reveal Ferrari */}
        <img
          src={frontSrc}
          alt="Trishal Reddy Indireddy"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{
            filter: "brightness(0.95) contrast(1.05)",
            // When --a is 1, create transparent circle; when 0, fully opaque
            maskImage: maskAlpha > 0 
              ? `radial-gradient(circle var(--r) at var(--mx) var(--my), transparent 0%, transparent 65%, rgba(0,0,0,1) 65%)`
              : "none",
            WebkitMaskImage: maskAlpha > 0
              ? `radial-gradient(circle var(--r) at var(--mx) var(--my), transparent 0%, transparent 65%, rgba(0,0,0,1) 65%)`
              : "none",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskSize: "100% 100%",
            WebkitMaskSize: "100% 100%",
          }}
          onError={() => handleImageError(frontSrc, "portrait")}
        />

        {/* Subtle overlay for F1 theme */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(220, 38, 38, 0.05) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Hint text (desktop only) */}
      <p
        className="text-xs text-center mt-2 opacity-60 hidden md:block transition-opacity"
        style={{ color: "#9CA3AF" }}
      >
        Hover to reveal
      </p>
    </div>
  );
}
