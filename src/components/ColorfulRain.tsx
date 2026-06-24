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
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Generate static drops with different parameters once to avoid infinite render loops
    const colors = [
      "text-rose-500/80 dark:text-rose-400/70",
      "text-orange-500/80 dark:text-orange-400/70",
      "text-pink-500/80 dark:text-pink-400/70",
      "text-fuchsia-500/80 dark:text-fuchsia-400/70",
      "text-amber-400/80 dark:text-amber-300/70",
    ];
    // Decrease count to 48 (additional 20% decrease from 60) for optimal luxury rain flow effect
    const generated: Drop[] = Array.from({ length: 48 }).map((_, i) => {
      const left = `${Math.random() * 100}%`;
      const delay = `${Math.random() * 8}s`;
      const duration = `${1.8 + Math.random() * 3.5}s`;
      const height = `${40 + Math.random() * 70}px`;
      const color = colors[i % colors.length];
      return { id: i, left, delay, duration, height, color };
    });
    setDrops(generated);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 select-none">
      {/* Sleek Interface Grid Lines */}
      <div className="rain-bg absolute inset-0" />
      
      {/* Dynamic Scroll-Linked Lighting Glow */}
      <div 
        className="absolute inset-0 pointer-events-none mix-blend-screen opacity-70 dark:opacity-60 transition-transform duration-100 ease-out"
        style={{
          background: `radial-gradient(circle at 50% ${Math.min(95, 15 + scrollY * 0.05)}%, rgba(244, 63, 94, 0.15) 0%, rgba(249, 115, 22, 0.08) 35%, rgba(236, 72, 153, 0.03) 60%, transparent 80%)`,
        }}
      />
      
      {/* Floating Raindrops */}
      <div className="absolute inset-0 opacity-50 dark:opacity-40">
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
