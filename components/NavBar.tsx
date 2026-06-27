"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* Inline SVG so `color` on the parent controls everything — 100% reliable */
function AJLogo() {
  return (
    <svg viewBox="0 0 200 200" width="36" height="36" fill="none"
      stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {/* Outer ring */}
      <circle cx="100" cy="100" r="92" strokeWidth="2" />
      {/* Mid ring — dashes create bracket-gap effect */}
      <circle cx="100" cy="100" r="81" strokeWidth="1.5"
        strokeDasharray="96 34" strokeDashoffset="-48" />
      {/* Inner ring */}
      <circle cx="100" cy="100" r="70" strokeWidth="1.5"
        strokeDasharray="84 30" strokeDashoffset="-42" />
      {/* Corner bracket marks — NW / NE / SE / SW */}
      <path d="M30 46 L30 30 L46 30" strokeWidth="1.8" />
      <path d="M154 30 L170 30 L170 46" strokeWidth="1.8" />
      <path d="M170 154 L170 170 L154 170" strokeWidth="1.8" />
      <path d="M46 170 L30 170 L30 154" strokeWidth="1.8" />
      {/* "A" — geometric slash-style */}
      <path d="M34 160 L72 40 M84 40 L104 160" strokeWidth="8" strokeLinejoin="miter" />
      <line x1="48" y1="108" x2="98" y2="108" strokeWidth="8" />
      {/* "j" — square dot + descender */}
      <rect x="114" y="40" width="22" height="22" fill="currentColor" stroke="none" />
      <path d="M125 66 L125 150 Q125 172 103 172" strokeWidth="8" />
    </svg>
  );
}

const navItems = [
  { num: "01", label: "About",    id: "about",    marqueeText: "MY JOURNEY"  },
  { num: "02", label: "Projects", id: "projects", marqueeText: "RECENT WORK" },
  { num: "03", label: "Contact",  id: "contact",  marqueeText: "LET'S TALK"  },
];

function ArrowCircle() {
  return (
    <span className="shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#1c1c1c] flex items-center justify-center mx-6 md:mx-10">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function NavMenuItem({ item, index, hoveredIndex, setHovered, onNavigate }: {
  item: (typeof navItems)[0]; index: number; hoveredIndex: number | null;
  setHovered: (i: number | null) => void; onNavigate: (id: string) => void;
}) {
  const isHovered = hoveredIndex === index;
  const unit = Array.from({ length: 4 }, (_, i) => (
    <span key={i} className="flex items-center shrink-0">
      <span style={{ fontFamily: "var(--font-bebas)" }}
        className="text-[10vw] md:text-[8vw] leading-none text-white whitespace-nowrap mx-6 md:mx-10 tracking-tight">
        {item.marqueeText}
      </span>
      <ArrowCircle />
    </span>
  ));

  return (
    <div
      className="relative border-t border-[#d0d0d0] overflow-hidden cursor-none"
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      onClick={() => onNavigate(item.id)}
    >
      <div className="flex items-start gap-4 py-5 md:py-7 w-full relative z-10 px-10 md:px-20">
        <span style={{ fontFamily: "var(--font-space)" }} className="text-[#888] text-xs mt-3 md:mt-5 leading-none shrink-0">{item.num}</span>
        <span style={{ fontFamily: "var(--font-bebas)" }} className="text-[14vw] md:text-[11vw] leading-none text-[#111] uppercase">{item.label}</span>
      </div>
      <AnimatePresence>
        {isHovered && (
          <motion.div initial={{ y: "102%" }} animate={{ y: "0%" }} exit={{ y: "102%" }}
            transition={{ duration: 0.42, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-0 bg-[#7ca48d] flex items-center overflow-hidden z-20 pointer-events-none">
            <div className="menu-marquee-track flex items-center">{unit}{unit}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  /* true when a light-bg section (contact, etc.) is visible behind the fixed nav */
  const [isLightBg, setIsLightBg] = useState(false);

  useEffect(() => {
    /* Watch every section that has a light background */
    const lightSelectors = ["#contact", "section[data-light]"];
    const targets = lightSelectors.flatMap(s => Array.from(document.querySelectorAll(s)));
    if (!targets.length) return;
    const obs = new IntersectionObserver(
      (entries) => setIsLightBg(entries.some(e => e.isIntersecting)),
      { threshold: 0.05 }
    );
    targets.forEach(t => obs.observe(t));
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    setOpen(false);
    // Wait for menu close animation (500ms), then dispatch to SmoothScrollProvider
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("scroll-to-section", { detail: id }));
    }, 520);
  };

  /* Logo is dark when: menu open (white overlay) OR scrolled to light section */
  const logoDark = open || isLightBg;

  return (
    <>
      {/* ── Fixed bar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between pl-2 pr-6 md:pl-4 md:pr-10 h-[72px]">

        {/* Logo — top-left corner, SVG currentColor auto-switches dark/white */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="cursor-none"
          aria-label="Back to top"
          data-cursor-hover
          style={{
            color: logoDark ? "#111" : "#ffffff",
            transition: "color 0.35s ease",
            background: "none", border: "none", padding: 0,
          }}
        >
          <AJLogo />
        </button>

        {/* MENU / CLOSE — solid dark pill (always readable over any bg) */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          data-cursor-hover
          className="pill-btn"
          style={open
            ? { color: "#111", borderColor: "#333", background: "transparent" }
            : { background: "rgba(12,12,12,0.72)", borderColor: "rgba(255,255,255,0.16)" }
          }
        >
          <span>{open ? "CLOSE" : "MENU"}</span>
          <span className="status-dot" />
        </button>
      </nav>

      {/* ── Full-screen overlay ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: "0%", transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ opacity: 0, y: "-100%", transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1] } }}
            className="fixed inset-0 z-40 bg-[#f3f3f3] flex flex-col"
          >
            <div className="flex-1 flex flex-col justify-center overflow-hidden">
              {navItems.map((item, i) => (
                <NavMenuItem key={item.label} item={item} index={i}
                  hoveredIndex={hoveredIndex} setHovered={setHoveredIndex} onNavigate={scrollTo} />
              ))}
              <div className="border-t border-[#d0d0d0]" />
            </div>
            <div className="px-10 md:px-20 py-8 border-t border-[#d0d0d0] flex justify-between items-center">
              <p style={{ fontFamily: "var(--font-space)" }} className="text-[11px] text-[#888] tracking-widest uppercase">© 2025 Ameen Jawhar</p>
              <p style={{ fontFamily: "var(--font-space)" }} className="text-[11px] text-[#888] tracking-widest uppercase">Kerala, India</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
