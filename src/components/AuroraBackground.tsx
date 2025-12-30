import { motion, useReducedMotion } from "framer-motion";

export default function AuroraBackground() {
  const shouldReduceMotion = useReducedMotion();

  // Blob animation variants
  const blobVariants = {
    animate: {
      x: ["0%", "30%", "-20%", "10%", "0%"],
      y: ["0%", "-25%", "15%", "-10%", "0%"],
      rotate: [0, 90, 180, 270, 360],
      scale: [1, 1.2, 0.9, 1.1, 1],
    },
    transition: {
      duration: shouldReduceMotion ? 0.01 : 25,
      repeat: Infinity,
      ease: "linear",
    },
  };

  const blobVariants2 = {
    animate: {
      x: ["0%", "-25%", "20%", "-15%", "0%"],
      y: ["0%", "30%", "-20%", "25%", "0%"],
      rotate: [0, -90, -180, -270, -360],
      scale: [1, 0.8, 1.3, 0.95, 1],
    },
    transition: {
      duration: shouldReduceMotion ? 0.01 : 30,
      repeat: Infinity,
      ease: "linear",
      delay: 5,
    },
  };

  const blobVariants3 = {
    animate: {
      x: ["0%", "20%", "-30%", "15%", "0%"],
      y: ["0%", "25%", "-15%", "20%", "0%"],
      rotate: [0, 120, 240, 360, 0],
      scale: [1, 1.1, 0.85, 1.15, 1],
    },
    transition: {
      duration: shouldReduceMotion ? 0.01 : 35,
      repeat: Infinity,
      ease: "linear",
      delay: 10,
    },
  };

  const blobVariants4 = {
    animate: {
      x: ["0%", "-20%", "25%", "-10%", "0%"],
      y: ["0%", "-30%", "20%", "-25%", "0%"],
      rotate: [0, -120, -240, -360, 0],
      scale: [1, 0.9, 1.2, 1.05, 1],
    },
    transition: {
      duration: shouldReduceMotion ? 0.01 : 28,
      repeat: Infinity,
      ease: "linear",
      delay: 15,
    },
  };

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden bg-slate-950 pointer-events-none"
      aria-hidden="true"
    >
      {/* Aurora Blob 1 - Indigo */}
      <motion.div
        className="absolute"
        style={{
          width: "800px",
          height: "800px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(79, 70, 229, 0.3) 50%, transparent 70%)",
          filter: "blur(100px)",
          top: "10%",
          left: "10%",
          opacity: 0.35,
        }}
        variants={blobVariants}
        animate={shouldReduceMotion ? {} : "animate"}
      />

      {/* Aurora Blob 2 - Purple */}
      <motion.div
        className="absolute"
        style={{
          width: "750px",
          height: "750px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(124, 58, 237, 0.3) 50%, transparent 70%)",
          filter: "blur(100px)",
          top: "60%",
          right: "15%",
          opacity: 0.3,
        }}
        variants={blobVariants2}
        animate={shouldReduceMotion ? {} : "animate"}
      />

      {/* Aurora Blob 3 - Slate/Indigo */}
      <motion.div
        className="absolute"
        style={{
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(67, 56, 202, 0.35) 0%, rgba(100, 116, 139, 0.25) 50%, transparent 70%)",
          filter: "blur(100px)",
          bottom: "20%",
          left: "50%",
          opacity: 0.25,
        }}
        variants={blobVariants3}
        animate={shouldReduceMotion ? {} : "animate"}
      />

      {/* Aurora Blob 4 - Indigo/Purple mix */}
      <motion.div
        className="absolute"
        style={{
          width: "850px",
          height: "850px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.25) 50%, transparent 70%)",
          filter: "blur(100px)",
          top: "40%",
          left: "60%",
          opacity: 0.28,
        }}
        variants={blobVariants4}
        animate={shouldReduceMotion ? {} : "animate"}
      />

      {/* Subtle Noise/Grain Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(255, 255, 255, 0.03) 2px,
              rgba(255, 255, 255, 0.03) 4px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(255, 255, 255, 0.03) 2px,
              rgba(255, 255, 255, 0.03) 4px
            )
          `,
          backgroundSize: "4px 4px",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

