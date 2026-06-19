"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const dotX  = useSpring(mouseX, { damping: 28, stiffness: 300, mass: 0.5 });
  const dotY  = useSpring(mouseY, { damping: 28, stiffness: 300, mass: 0.5 });
  const ringX = useSpring(mouseX, { damping: 22, stiffness: 180, mass: 0.8 });
  const ringY = useSpring(mouseY, { damping: 22, stiffness: 180, mass: 0.8 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const move = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };

    const addHover    = () => document.body.classList.add("cursor-hover");
    const removeHover = () => document.body.classList.remove("cursor-hover");

    window.addEventListener("mousemove", move);

    // Re-query on each open so overlay links are captured
    const attach = () => {
      document.querySelectorAll("a, button, [data-cursor-hover]").forEach((el) => {
        el.addEventListener("mouseenter", addHover);
        el.addEventListener("mouseleave", removeHover);
      });
    };
    attach();
    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", move);
      observer.disconnect();
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Dot — mix-blend-mode:difference makes it dark on light, light on dark */}
      <motion.div
        className="cursor-dot"
        style={{ x: dotX, y: dotY }}
      />
      {/* Ring */}
      <motion.div
        className="cursor-ring"
        style={{ x: ringX, y: ringY }}
      />
    </>
  );
}
