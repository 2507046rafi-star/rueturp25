import React, { useEffect, useState } from "react";

export default function ColorfulRain() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Create a stable list of 45 drops with varying properties
  const drops = Array.from({ length: 45 }, (_, idx) => {
    // Generate deterministic properties based on index to avoid Math.random() mismatches
    const left = (idx * 2.3 + idx * idx * 0.7) % 100;
    const delay = (idx * 0.17 + (idx % 3) * 0.4) % 6;
    const duration = 1.2 + ((idx * 0.23 + (idx % 4) * 0.5) % 1.8);
    const height = 40 + ((idx * 11) % 60);
    const opacity = 0.2 + ((idx * 3) % 4) * 0.15;
    
    // Colorful rain colors (rose, amber, emerald, sky, purple, fuchsia)
    const colors = [
      "text-rose-400 dark:text-rose-500",
      "text-amber-400 dark:text-amber-500",
      "text-emerald-400 dark:text-emerald-500",
      "text-sky-400 dark:text-sky-500",
      "text-violet-400 dark:text-violet-500",
      "text-fuchsia-400 dark:text-fuchsia-500",
      "text-pink-400 dark:text-pink-500",
    ];
    const color = colors[idx % colors.length];

    return {
      id: idx,
      left: `${left}%`,
      delay: `${delay}s`,
      duration: `${duration}s`,
      height: `${height}px`,
      opacity,
      color,
    };
  });

  return (
    <div id="colorful-rain-container" className="fixed inset-0 pointer-events-none overflow-hidden z-10 select-none">
      {drops.map((drop) => (
        <div
          key={drop.id}
          className={`rain-drop ${drop.color}`}
          style={{
            left: drop.left,
            top: "-150px",
            height: drop.height,
            opacity: drop.opacity,
            animationName: "rain",
            animationDuration: drop.duration,
            animationTimingFunction: "linear",
            animationDelay: drop.delay,
            animationIterationCount: "infinite",
          }}
        />
      ))}
    </div>
  );
}
