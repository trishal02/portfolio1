import { useEffect, useRef } from "react";

interface AnimatedBackgroundProps {
  isDark: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export default function AnimatedBackground({
  isDark,
}: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particle system - more particles for better effect
    const particles: Particle[] = [];
    const particleCount = Math.floor((canvas.width * canvas.height) / 15000);

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      });
    }

    let animationId: number;
    const mouse = { x: 0, y: 0 };

    // Track mouse position for interactive effect
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Mouse interaction - particles slightly attracted to mouse
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 100) {
          particle.vx += dx * 0.0001;
          particle.vy += dy * 0.0001;
        }

        // Limit velocity
        particle.vx = Math.max(-2, Math.min(2, particle.vx));
        particle.vy = Math.max(-2, Math.min(2, particle.vy));

        // Draw particle with glow effect
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius * 2
        );
        gradient.addColorStop(
          0,
          isDark ? "rgba(99, 102, 241, 0.8)" : "rgba(99, 102, 241, 0.4)"
        );
        gradient.addColorStop(
          1,
          isDark ? "rgba(99, 102, 241, 0)" : "rgba(99, 102, 241, 0)"
        );

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw connections to nearby particles
        particles.slice(index + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const opacity = (1 - distance / 120) * (isDark ? 0.3 : 0.2);
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = isDark
              ? `rgba(99, 102, 241, ${opacity})`
              : `rgba(139, 92, 246, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [isDark]);

  return (
    <>
      {/* Animated gradient mesh background */}
      <div
        className="fixed inset-0 -z-10 transition-opacity duration-1000"
        style={{
          background: isDark
            ? `
              radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99, 102, 241, 0.2) 0%, transparent 50%),
              radial-gradient(ellipse 80% 50% at 50% 100%, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
              radial-gradient(ellipse 60% 80% at 0% 50%, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse 60% 80% at 100% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
              hsl(222, 47%, 11%)
            `
            : `
              radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
              radial-gradient(ellipse 80% 50% at 50% 100%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
              radial-gradient(ellipse 60% 80% at 0% 50%, rgba(236, 72, 153, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse 60% 80% at 100% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
              hsl(0 0% 98%)
            `,
          animation: "gradientShift 20s ease infinite",
        }}
      />
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{ opacity: isDark ? 1 : 0.7 }}
      />
      <style>{`
        @keyframes gradientShift {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
          33% {
            transform: scale(1.05) rotate(2deg);
            opacity: 0.95;
          }
          66% {
            transform: scale(0.98) rotate(-2deg);
            opacity: 0.98;
          }
        }
      `}</style>
    </>
  );
}
