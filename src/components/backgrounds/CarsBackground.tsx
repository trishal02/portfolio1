import { motion, useReducedMotion } from "framer-motion";

// Debug mode flag - set to true to see cars clearly
const DEBUG_BG = false;

export default function CarsBackground() {
  const shouldReduceMotion = useReducedMotion();

  // Generate 20 cars with varied properties
  const cars = Array.from({ length: 20 }, (_, i) => {
    // Each car starts 0.5s after the previous one
    const delay = i * 0.5;
    
    // Vary Y position (lanes) - spread across viewport height
    // Use a seed-based approach for consistent but varied positions
    const seed = i * 137.508; // Golden angle for distribution
    const yPosition = 10 + ((Math.sin(seed) * 0.5 + 0.5) * 80); // 10% to 90% of viewport
    
    // Vary speed slightly (duration between 12-18 seconds)
    const duration = 12 + (i % 7) * 0.8; // 12s to ~17.6s
    
    // Vary opacity (0.08-0.20 for normal, 0.9 for debug)
    const opacity = DEBUG_BG ? 0.9 : 0.08 + (i % 5) * 0.03;
    
    // Vary color slightly (blue/cyan spectrum, red for debug)
    const hue = DEBUG_BG ? 0 : 200 + (i % 5) * 10; // 200-240 range
    const color = DEBUG_BG 
      ? "#DC2626" 
      : `hsla(${hue}, 70%, 60%, ${opacity})`;
    
    return {
      id: i,
      delay,
      yPosition,
      duration,
      opacity,
      color,
      hue,
    };
  });

  // Car SVG shape (simple car icon)
  const CarIcon = ({ color, opacity }: { color: string; opacity: number }) => (
    <svg
      width="24"
      height="12"
      viewBox="0 0 24 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Car body */}
      <rect x="2" y="4" width="20" height="6" rx="1" fill={color} opacity={opacity} />
      {/* Windshield */}
      <rect x="4" y="5" width="6" height="4" rx="0.5" fill={color} opacity={opacity * 0.6} />
      {/* Wheels */}
      <circle cx="7" cy="10" r="1.5" fill={color} opacity={opacity * 0.8} />
      <circle cx="17" cy="10" r="1.5" fill={color} opacity={opacity * 0.8} />
    </svg>
  );

  if (shouldReduceMotion) {
    // Static background when motion is reduced
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {DEBUG_BG && (
          <div
            className="absolute top-4 left-4 px-3 py-1 rounded text-xs font-bold"
            style={{ backgroundColor: "#DC2626", color: "#FFFFFF" }}
          >
            CARS BG ON (REDUCED MOTION)
          </div>
        )}
        {/* Render static cars at random positions */}
        {cars.map((car) => (
          <div
            key={car.id}
            className="absolute"
            style={{
              left: `${(car.id * 5) % 100}%`,
              top: `${car.yPosition}%`,
              opacity: car.opacity,
            }}
          >
            <CarIcon color={car.color} opacity={car.opacity} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Debug label */}
      {DEBUG_BG && (
        <div
          className="absolute top-4 left-4 px-3 py-1 rounded text-xs font-bold z-50"
          style={{ backgroundColor: "#DC2626", color: "#FFFFFF" }}
        >
          CARS BG ON
        </div>
      )}

      {/* Render 20 animated cars */}
      {cars.map((car) => (
        <motion.div
          key={car.id}
          className="absolute"
          style={{
            top: `${car.yPosition}%`,
          }}
          initial={{ x: "-10%" }}
          animate={{
            x: "110%", // Move from left edge to right edge
          }}
          transition={{
            duration: car.duration,
            repeat: Infinity,
            ease: "linear",
            delay: car.delay,
          }}
        >
          {/* Motion blur trail (lagging blurred duplicate) */}
          <motion.div
            className="absolute"
            style={{
              filter: "blur(4px)",
              opacity: car.opacity * 0.4,
            }}
            initial={{ x: "-10%" }}
            animate={{
              x: "110%",
            }}
            transition={{
              duration: car.duration,
              repeat: Infinity,
              ease: "linear",
              delay: car.delay + 0.1, // Slight delay for trail effect
            }}
          >
            <CarIcon color={car.color} opacity={car.opacity} />
          </motion.div>

          {/* Main car with glow */}
          <div
            className="relative"
            style={{
              filter: `drop-shadow(0 0 4px ${car.color})`,
              opacity: car.opacity,
            }}
          >
            <CarIcon color={car.color} opacity={1} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

