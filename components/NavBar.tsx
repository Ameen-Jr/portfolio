"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { num: "01", label: "About" },
  { num: "02", label: "Projects" },
  { num: "03", label: "Contact" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);

  const menuVariants = {
    hidden: { opacity: 0, y: "-100%" },
    visible: {
      opacity: 1,
      y: "0%",
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
    exit: {
      opacity: 0,
      y: "-100%",
      transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1] },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.1 + i * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  const scrollTo = (id: string) => {
    setOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 500);
  };

  return (
    <>
      {/* Fixed Nav Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-[72px]">
        {/* Logo */}
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

        {/* Menu toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="pill-btn group"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span>{open ? "CLOSE" : "MENU"}</span>
          <span className="status-dot" />
        </button>
      </nav>

      {/* Full-screen Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 bg-[#f3f3f3] flex flex-col"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            {/* Nav links */}
            <div className="flex-1 flex flex-col justify-center px-10 md:px-20 overflow-hidden">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="border-t border-[#d0d0d0] first:border-t-0"
                >
                  <button
                    onClick={() => scrollTo(item.label.toLowerCase())}
                    className="flex items-start gap-4 py-6 md:py-8 w-full group cursor-none"
                  >
                    <span className="text-[#888] text-sm font-mono mt-2 md:mt-4 leading-none">
                      {item.num}
                    </span>
                    <span className="text-[14vw] md:text-[12vw] leading-none text-[#111] group-hover:text-[#555] transition-colors duration-300 uppercase">
                      {item.label}
                    </span>
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Footer row inside menu */}
            <div className="px-10 md:px-20 py-8 border-t border-[#d0d0d0] flex justify-between items-center">
              <p
                style={{ fontFamily: "var(--font-space)" }}
                className="text-[11px] text-[#888] tracking-widest uppercase"
              >
                © 2025 Ameen Jawhar
              </p>
              <p
                style={{ fontFamily: "var(--font-space)" }}
                className="text-[11px] text-[#888] tracking-widest uppercase"
              >
                Kerala, India
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
