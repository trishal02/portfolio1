import { useEffect, useState } from "react";

export default function SpeedStreaks() {
  const [streaks, setStreaks] = useState<
    Array<{ id: number; delay: number; top: number }>
  >([]);

  useEffect(() => {
    // Generate random speed streaks
    const newStreaks = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      delay: Math.random() * 3,
      top: Math.random() * 100,
    }));
    setStreaks(newStreaks);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {streaks.map((streak) => (
        <div
          key={streak.id}
          className="speed-streak"
          style={{
            left: `${20 + streak.id * 15}%`,
            top: `${streak.top}%`,
            animationDelay: `${streak.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
