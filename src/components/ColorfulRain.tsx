import React, { useEffect, useState } from "react";

interface Drop {
  id: number;
  left: string;
  delay: string;
  duration: string;
  height: string;
  color: string;
}

export default function ColorfulRain() {
  const [drops, setDrops] = useState<Drop[]>([]);

  useEffect(() => {
    // Generate static drops with different parameters once to avoid infinite render loops
    const colors = [
      "text-rose-500/80 dark:text-rose-400/70",
      "text-orange-500/80 dark:text-orange-400/70",
      "text-pink-500/80 dark:text-pink-400/70",
      "text-fuchsia-500/80 dark:text-fuchsia-400/70",
      "text-amber-400/80 dark:text-amber-300/70",
    ];
    // Increase count to 35 for a rich full screen luxury effect
    const generated: Drop[] = Array.from({ length: 35 }).map((_, i) => {
      const left = `${Math.random() * 100}%`;
      const delay = `${Math.random() * 8}s`;
      const duration = `${2.5 + Math.random() * 4.0}s`;
      const height = `${35 + Math.random() * 55}px`;
      const color = colors[i % colors.length];
      return { id: i, left, delay, duration, height, color };
    });
    setDrops(generated);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 select-none">
      {/* Sleek Interface Grid Lines */}
      <div className="rain-bg absolute inset-0" />
      
      {/* Floating Raindrops */}
      <div className="absolute inset-0 opacity-45 dark:opacity-35">
        {drops.map((drop) => (
          <div
            key={drop.id}
            className={`absolute top-0 animate-rain ${drop.color} rain-drop`}
            style={{
              left: drop.left,
              animationDelay: drop.delay,
              animationDuration: drop.duration,
              height: drop.height,
            }}
          />
        ))}
      </div>
    </div>
  );
}
