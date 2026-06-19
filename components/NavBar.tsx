"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { num: "01", label: "About",    id: "about",    marqueeText: "MY JOURNEY"  },
  { num: "02", label: "Projects", id: "projects", marqueeText: "RECENT WORK" },
  { num: "03", label: "Contact",  id: "contact",  marqueeText: "LET'S TALK"  },
];

function ArrowCircle() {
  return (
    <span className="shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#1c1c1c] flex items-center justify-center mx-6 md:mx-10">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="white" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function NavMenuItem({
  item, index, hoveredIndex, setHovered, onNavigate,
}: {
  item: (typeof navItems)[0];
  index: number;
  hoveredIndex: number | null;
  setHovered: (i: number | null) => void;
  onNavigate: (id: string) => void;
}) {
  const isHovered = hoveredIndex === index;

  // Build marquee content (×4 pairs, duplicated for seamless loop)
  const unit = Array.from({ length: 4 }, (_, i) => (
    <span key={i} className="flex items-center shrink-0">
      <span
        style={{ fontFamily: "var(--font-bebas)" }}
        className="text-[10vw] md:text-[8vw] leading-none text-white whitespace-nowrap mx-6 md:mx-10 tracking-tight"
      >
        {item.marqueeText}
      </span>
      <ArrowCircle />
    </span>
  ));

  return (
    <div
      className="relative border-t border-[#d0d0d0] overflow-hidden"
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
    >
      {/* Default label row */}
      <button
        onClick={() => onNavigate(item.id)}
        className="flex items-start gap-4 py-5 md:py-7 w-full cursor-none relative z-10 px-10 md:px-20"
      >
        <span
          style={{ fontFamily: "var(--font-space)" }}
          className="text-[#888] text-xs mt-3 md:mt-5 leading-none shrink-0"
        >
          {item.num}
        </span>
        <span
          style={{ fontFamily: "var(--font-bebas)" }}
          className="text-[14vw] md:text-[11vw] leading-none text-[#111] uppercase"
        >
          {item.label}
        </span>
      </button>

      {/* Hover overlay — slides up from bottom */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ y: "102%" }}
            animate={{ y: "0%" }}
            exit={{ y: "102%" }}
            transition={{ duration: 0.42, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-0 bg-[#7ca48d] flex items-center overflow-hidden z-20"
          >
            <div className="menu-marquee-track flex items-center">
              {unit}{unit}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const scrollTo = (id: string) => {
    setOpen(false);
    setTimeout(
      () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }),
      500
    );
  };

  const menuVariants = {
    hidden:   { opacity: 0, y: "-100%" },
    visible:  { opacity: 1, y: "0%",  transition: { duration: 0.6,  ease: [0.16, 1, 0.3, 1]   } },
    exit:     { opacity: 0, y: "-100%", transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1] } },
  };

  return (
    <>
      {/* ── Fixed bar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-[72px]">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-11 h-11 rounded-full border border-[#3a3a3a] flex items-center justify-center hover:border-[#6b6b6b] transition-colors"
          aria-label="Back to top"
        >
          <span
            style={{ fontFamily: "var(--font-bebas)" }}
            className="text-[15px] tracking-widest text-[#f0f0f0] leading-none"
          >
            AJ
          </span>
        </button>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "14px 28px",
            borderRadius: "999px",
            border: open ? "1px solid #222" : "1px solid var(--border)",
            fontFamily: "var(--font-space)",
            fontSize: "0.75rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: open ? "#111" : "var(--text-primary)",
            background: "transparent",
            cursor: "none",
            transition: "all 0.25s ease",
          }}
        >
          <span>{open ? "CLOSE" : "MENU"}</span>
          <span className="status-dot" />
        </button>
      </nav>

      {/* ── Full-screen overlay ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 bg-[#f3f3f3] flex flex-col"
          >
            {/* Nav items */}
            <div className="flex-1 flex flex-col justify-center overflow-hidden">
              {navItems.map((item, i) => (
                <NavMenuItem
                  key={item.label}
                  item={item}
                  index={i}
                  hoveredIndex={hoveredIndex}
                  setHovered={setHoveredIndex}
                  onNavigate={scrollTo}
                />
              ))}
              <div className="border-t border-[#d0d0d0]" />
            </div>

            {/* Footer row */}
            <div className="px-10 md:px-20 py-8 border-t border-[#d0d0d0] flex justify-between items-center">
              <p style={{ fontFamily: "var(--font-space)" }} className="text-[11px] text-[#888] tracking-widest uppercase">
                © 2025 Ameen Jawhar
              </p>
              <p style={{ fontFamily: "var(--font-space)" }} className="text-[11px] text-[#888] tracking-widest uppercase">
                Kerala, India
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
