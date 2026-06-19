"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const DURATION = 2000;
    const start = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setCount(Math.floor(eased * 100));
      if (t < 1) { raf = requestAnimationFrame(tick); }
      else {
        setCount(100);
        setTimeout(() => setExiting(true), 300);
        setTimeout(() => { setGone(true); onComplete(); }, 1100);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  if (gone) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#0f0f0f] overflow-hidden"
      animate={{ y: exiting ? "-100%" : "0%" }}
      transition={{ duration: 0.78, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* 8 column guides */}
      <div className="absolute inset-0 flex" aria-hidden>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex-1 border-r border-[#1c1c1c] last:border-r-0" />
        ))}
      </div>

      {/* AJ watermark top-left */}
      <div className="absolute top-8 left-8">
        <span style={{ fontFamily: "var(--font-bebas)" }} className="text-[#252525] text-2xl tracking-widest select-none">AJ</span>
      </div>

      {/* Giant counter bottom-right */}
      <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10">
        <span
          style={{ fontFamily: "var(--font-bebas)" }}
          className="text-[22vw] md:text-[17vw] leading-[0.85] text-[#f0f0f0] tabular-nums select-none"
        >
          {count}%
        </span>
      </div>

      {/* Accent progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1a1a1a]">
        <div className="h-full bg-[#7ca48d]" style={{ width: `${count}%`, transition: "width 80ms linear" }} />
      </div>
    </motion.div>
  );
}
