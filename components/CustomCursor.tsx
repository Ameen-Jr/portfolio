"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const mouseX = useMotionValue(-300);
  const mouseY = useMotionValue(-300);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  /* Dot: near-instant */
  const dotX = useSpring(mouseX, { stiffness: 600, damping: 42, mass: 0.2 });
  const dotY = useSpring(mouseY, { stiffness: 600, damping: 42, mass: 0.2 });

  /* Reticle: heavy spring lag for smooth depth */
  const retX = useSpring(mouseX, { stiffness: 90, damping: 22, mass: 1.0 });
  const retY = useSpring(mouseY, { stiffness: 90, damping: 22, mass: 1.0 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visible) setVisible(true);
    };
    const on  = () => { setHovered(true);  document.body.classList.add("cursor-hover"); };
    const off = () => { setHovered(false); document.body.classList.remove("cursor-hover"); };

    window.addEventListener("mousemove", move);
    const attach = () => {
      document.querySelectorAll("a, button, [data-cursor-hover]").forEach((el) => {
        el.addEventListener("mouseenter", on);
        el.addEventListener("mouseleave", off);
      });
    };
    attach();
    const obs = new MutationObserver(attach);
    obs.observe(document.body, { childList: true, subtree: true });
    return () => { window.removeEventListener("mousemove", move); obs.disconnect(); };
  }, [mouseX, mouseY, visible]);

  if (!visible) return null;

  return (
    <>
      {/* ── Central dot — mix-blend-mode on the outermost fixed div ── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ x: dotX, y: dotY, mixBlendMode: "difference" } as any}
      >
        <motion.div
          animate={{ scale: hovered ? 2.2 : 1, opacity: hovered ? 0.5 : 1 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          style={{
            width: 5, height: 5,
            borderRadius: "50%",
            background: "white",
            transform: "translate(-50%, -50%)",
          }}
        />
      </motion.div>

      {/* ── Reticle — mix-blend-mode on outermost fixed div ── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{ x: retX, y: retY, mixBlendMode: "difference" } as any}
        animate={{ scale: hovered ? 1.6 : 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <div style={{ transform: "translate(-50%, -50%)" }}>
          <svg
            width="54" height="54"
            viewBox="-27 -27 54 54"
            aria-hidden="true"
            className={`cursor-reticle${hovered ? " cursor-reticle--hover" : ""}`}
          >
            {/* Outer dashed ring */}
            <circle cx="0" cy="0" r="18" fill="none" stroke="white" strokeWidth="0.8" strokeDasharray="8 4" strokeLinecap="round" />
            {/* 4 axis ticks */}
            <line x1="0"   y1="-18" x2="0"   y2="-24" stroke="white" strokeWidth="0.9" strokeLinecap="round" />
            <line x1="18"  y1="0"   x2="24"  y2="0"   stroke="white" strokeWidth="0.9" strokeLinecap="round" />
            <line x1="0"   y1="18"  x2="0"   y2="24"  stroke="white" strokeWidth="0.9" strokeLinecap="round" />
            <line x1="-18" y1="0"   x2="-24" y2="0"   stroke="white" strokeWidth="0.9" strokeLinecap="round" />
            {/* 45° corner markers */}
            <line x1="12"  y1="-12" x2="15"  y2="-15" stroke="white" strokeWidth="0.6" strokeLinecap="round" opacity="0.45" />
            <line x1="12"  y1="12"  x2="15"  y2="15"  stroke="white" strokeWidth="0.6" strokeLinecap="round" opacity="0.45" />
            <line x1="-12" y1="12"  x2="-15" y2="15"  stroke="white" strokeWidth="0.6" strokeLinecap="round" opacity="0.45" />
            <line x1="-12" y1="-12" x2="-15" y2="-15" stroke="white" strokeWidth="0.6" strokeLinecap="round" opacity="0.45" />
          </svg>
        </div>
      </motion.div>
    </>
  );
}
