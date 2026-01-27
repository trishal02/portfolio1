/**
 * BackgroundManager — Renders exactly ONE background at a time.
 * Performance-aware: respects reduced motion, device constraints, and FPS.
 */

import { useState, useMemo, useRef, useEffect } from "react";
import { useReducedMotion } from "framer-motion";

// Lazy-loaded or static imports for backgrounds (single active at a time)
import AuroraBackground from "../AuroraBackground";
import CarsBackground from "../backgrounds/CarsBackground";
import F1Background from "./F1Background";
import TelemetrySuzukaBackground from "../backgrounds/TelemetrySuzukaBackground";
import SuzukaCircuitBackground from "../backgrounds/SuzukaCircuitBackground";

export type BackgroundMode = "auto" | "static" | "light" | "full";
export type BackgroundVariant =
  | "aurora"
  | "telemetry"
  | "cars"
  | "f1"
  | "circuit"
  | "off";

const FPS_WINDOW_MS = 2000;
const FPS_LOW_THRESHOLD = 45;
const FPS_CRITICAL_THRESHOLD = 30;
const FPS_RECOVER_THRESHOLD = 55;
const CONSECUTIVE_LOW_FOR_DOWNGRADE = 2;
const CONSECUTIVE_GOOD_FOR_UPGRADE = 3;
// In auto mode we never upgrade past "light" to avoid thrashing
const AUTO_MAX_LEVEL: BackgroundMode = "light";

export interface BackgroundManagerProps {
  mode?: BackgroundMode;
  variant?: BackgroundVariant;
}

/** Static fallback: single div, CSS gradients only. No blur, filters, SVG, or Framer Motion. */
function StaticBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-slate-950"
      aria-hidden="true"
      style={{
        background: `
          radial-gradient(ellipse 80% 50% at 50% 0%, rgba(30, 27, 75, 0.4), transparent),
          radial-gradient(ellipse 60% 40% at 80% 60%, rgba(59, 130, 246, 0.12), transparent),
          radial-gradient(ellipse 50% 30% at 20% 80%, rgba(139, 92, 246, 0.1), transparent),
          linear-gradient(180deg, #0f172a 0%, #020617 100%)
        `,
      }}
    />
  );
}

function useDeviceLowPower(): boolean {
  const [lowPower, setLowPower] = useState(() => {
    if (typeof navigator === "undefined") return true;
    const cores = navigator.hardwareConcurrency ?? 0;
    const memory = (navigator as { deviceMemory?: number }).deviceMemory ?? 0;
    const isNarrow = typeof window !== "undefined" && window.innerWidth < 768;
    return cores <= 4 || memory <= 4 || isNarrow;
  });
  useEffect(() => {
    const update = () => {
      const cores = navigator.hardwareConcurrency ?? 0;
      const memory = (navigator as { deviceMemory?: number }).deviceMemory ?? 0;
      setLowPower(cores <= 4 || memory <= 4 || window.innerWidth < 768);
    };
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return lowPower;
}

/** FPS monitor: returns effective FPS over sliding windows and suggests downgrade/upgrade. */
function useFpsMonitor(enabled: boolean): {
  fps: number;
  consecutiveLow: number;
  consecutiveGood: number;
} {
  const [fps, setFps] = useState(60);
  const consecutiveLowRef = useRef(0);
  const consecutiveGoodRef = useRef(0);
  const [consecutiveLow, setConsecutiveLow] = useState(0);
  const [consecutiveGood, setConsecutiveGood] = useState(0);
  const lastTimeRef = useRef<number>(0);
  const frameCountRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    lastTimeRef.current = performance.now();
    let nextWindowStart = lastTimeRef.current + FPS_WINDOW_MS;

    const tick = (now: number) => {
      frameCountRef.current += 1;
      if (now >= nextWindowStart) {
        const elapsed = (now - (nextWindowStart - FPS_WINDOW_MS)) / 1000;
        const measured = elapsed > 0 ? frameCountRef.current / elapsed : 60;
        setFps(Math.round(measured));

        if (measured < FPS_LOW_THRESHOLD) {
          consecutiveLowRef.current += 1;
          consecutiveGoodRef.current = 0;
        } else {
          consecutiveLowRef.current = 0;
          if (measured > FPS_RECOVER_THRESHOLD) {
            consecutiveGoodRef.current += 1;
          } else {
            consecutiveGoodRef.current = 0;
          }
        }
        setConsecutiveLow(consecutiveLowRef.current);
        setConsecutiveGood(consecutiveGoodRef.current);

        frameCountRef.current = 0;
        nextWindowStart = now + FPS_WINDOW_MS;
      }
      lastTimeRef.current = now;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [enabled]);

  return { fps, consecutiveLow, consecutiveGood };
}

/** Resolve effective mode when mode === "auto". Start at light; downgrade on low FPS, upgrade only to light. */
function useAutoEffectiveMode(
  preferReduceMotion: boolean,
  lowPower: boolean,
  fps: number,
  consecutiveLow: number,
  consecutiveGood: number
): BackgroundMode {
  return useMemo(() => {
    if (preferReduceMotion) return "static";
    if (lowPower) return "light";
    if (consecutiveLow >= CONSECUTIVE_LOW_FOR_DOWNGRADE) {
      if (fps < FPS_CRITICAL_THRESHOLD) return "static";
      return "light";
    }
    if (consecutiveGood >= CONSECUTIVE_GOOD_FOR_UPGRADE) return AUTO_MAX_LEVEL;
    return AUTO_MAX_LEVEL;
  }, [preferReduceMotion, lowPower, fps, consecutiveLow, consecutiveGood]);
}

export default function BackgroundManager({
  mode = "auto",
  variant = "aurora",
}: BackgroundManagerProps) {
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = Boolean(shouldReduceMotion);
  const lowPower = useDeviceLowPower();

  const { fps, consecutiveLow, consecutiveGood } = useFpsMonitor(mode === "auto");

  const effectiveAutoMode = useAutoEffectiveMode(
    reduceMotion,
    lowPower,
    fps,
    consecutiveLow,
    consecutiveGood
  );

  const effectiveMode: BackgroundMode =
    mode === "auto" ? effectiveAutoMode : mode;

  // Resolve which single background to show
  const content = useMemo(() => {
    if (effectiveMode === "static" || variant === "off") {
      return <StaticBackground />;
    }

    if (effectiveMode === "light") {
      // Light: exactly one of Aurora or Checkered (no heavy blur/filters)
      return <AuroraBackground lightMode />;
    }

    // full: one cinematic background by variant
    switch (variant) {
      case "aurora":
        return <AuroraBackground />;
      case "telemetry":
        return <TelemetrySuzukaBackground enableFilters />;
      case "cars":
        return <CarsBackground />;
      case "f1":
        return <F1Background />;
      case "circuit":
        return <SuzukaCircuitBackground />;
      default:
        return <AuroraBackground />;
    }
  }, [effectiveMode, variant]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {content}
    </div>
  );
}
