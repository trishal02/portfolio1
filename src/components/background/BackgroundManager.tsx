/**
 * BackgroundManager — Renders exactly ONE background at a time.
 * Performance-aware: respects reduced motion, device constraints, and FPS.
 */

import { useState, useMemo, useRef, useEffect } from "react";
import { useReducedMotion } from "framer-motion";

// Lazy-loaded or static imports for backgrounds (single active at a time)
import FastF1Background from "../backgrounds/FastF1Background";
import AuroraBackground from "../AuroraBackground";
import CarsBackground from "../backgrounds/CarsBackground";
import F1Background from "./F1Background";
import TelemetrySuzukaBackground from "../backgrounds/TelemetrySuzukaBackground";
import SuzukaCircuitBackground from "../backgrounds/SuzukaCircuitBackground";

export type BackgroundMode = "auto" | "static" | "light" | "full";
export type BackgroundVariant =
  | "fast"
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
  /** Default "fast" uses FastF1Background in full mode; cinematic options: aurora, telemetry, cars, f1, circuit. */
  variant?: BackgroundVariant;
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
  variant = "fast",
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

  console.log("[BackgroundManager] render", { effectiveMode, variant, mode });

  // Resolve which single background to show
  const content = useMemo(() => {
    // Static and light modes: always use lightweight FastF1Background (pure CSS, no blur/filters)
    if (effectiveMode === "static" || effectiveMode === "light" || variant === "off") {
      return <FastF1Background />;
    }

    // full: default variant "fast" uses FastF1Background; other variants are cinematic
    switch (variant) {
      case "fast":
        return <FastF1Background />;
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
        return <FastF1Background />;
    }
  }, [effectiveMode, variant]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {content}
    </div>
  );
}
