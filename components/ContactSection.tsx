"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";

/* ─── Contact section: mirrors chkstepan.com's minimal CTA contact layout ─── */
/* Reference: centered large CTA headline → pill button → bottom info grid      */

function AnimatedHeading() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const words = ["READY TO", "BUILD SOMETHING", "THAT ACTUALLY WORKS?"];

  return (
    <div ref={ref} className="overflow-hidden">
      {words.map((line, i) => (
        <div key={i} className="overflow-hidden leading-none">
          <motion.span
            initial={{ y: "110%" }}
            animate={inView ? { y: "0%" } : {}}
            transition={{
              duration: 0.85,
              ease: [0.16, 1, 0.3, 1],
              delay: i * 0.1,
            }}
            style={{ fontFamily: "var(--font-bebas)" }}
            className="block text-[clamp(3rem,7.5vw,7rem)] leading-none tracking-tight text-[#111]"
          >
            {line}
          </motion.span>
        </div>
      ))}
    </div>
  );
}

/* Small live clock */
function LocalTime() {
  const spanRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const update = () => {
      if (!spanRef.current) return;
      spanRef.current.textContent = new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return <span ref={spanRef} />;
}

export default function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="contact"
      ref={ref}
      className="w-full bg-[#f3f3f3] overflow-hidden"
    >
      {/* ── TOP GRID — structural columns ── */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none inset-0"
        style={{ zIndex: 0 }}
      />

      {/* ── CTA BODY ── */}
      <div className="relative z-10 px-6 md:px-16 lg:px-24 pt-24 pb-16 flex flex-col items-center text-center">

        {/* Grid lines (decorative, like reference) */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(#e0e0e0 1px, transparent 1px)",
            backgroundSize: "100% 80px",
            opacity: 0.6,
          }}
        />

        {/* Plus markers at column intersections */}
        {[20, 50, 80].map((x) =>
          [0, 33, 66, 100].map((y) => (
            <span
              key={`${x}-${y}`}
              aria-hidden
              className="absolute text-[#ccc] text-sm pointer-events-none select-none"
              style={{ left: `${x}%`, top: `${y === 0 ? "0" : y + "%"}`, transform: "translate(-50%,-50%)" }}
            >
              +
            </span>
          ))
        )}

        {/* Animated heading */}
        <AnimatedHeading />

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
          style={{ fontFamily: "var(--font-inter)" }}
          className="mt-8 text-[14px] text-[#555] max-w-[480px] leading-relaxed relative z-10"
        >
          Clean architecture, precise design, and focused engineering —
          working together as one system.
        </motion.p>

        {/* Pill CTA button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          className="mt-10 relative z-10"
        >
          <a
            href="mailto:ameenjawhares@gmail.com"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-[#e8e8e8] border border-[#d0d0d0] text-[#111] hover:bg-[#111] hover:text-[#f0f0f0] hover:border-[#111] transition-all duration-400 group"
            style={{ fontFamily: "var(--font-space)" }}
            data-cursor-hover
          >
            <span className="text-[11px] tracking-[0.2em] uppercase">
              {"LET'S TALK"}
            </span>
            <span className="text-lg transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
              ↗
            </span>
          </a>
        </motion.div>

        {/* Bottom spacer */}
        <div className="h-20" />
      </div>

      {/* ── BOTTOM FOOTER GRID ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.8 }}
        className="relative z-10 border-t border-[#d0d0d0] grid grid-cols-2 md:grid-cols-4 divide-x divide-[#d0d0d0]"
      >
        {/* Bio */}
        <div className="p-6 md:p-8 col-span-2 md:col-span-1">
          <p
            style={{ fontFamily: "var(--font-inter)" }}
            className="text-[12px] text-[#555] leading-relaxed max-w-[220px]"
          >
            My work is driven by architectural clarity, performance, and design
            precision — building systems that feel simple, fast, and intentional.
          </p>
          <p
            style={{ fontFamily: "var(--font-space)" }}
            className="text-[10px] text-[#999] mt-4 tracking-widest uppercase"
          >
            © 2026 Ameen Jawhar
          </p>
        </div>

        {/* Contact info */}
        <div className="p-6 md:p-8">
          <p
            style={{ fontFamily: "var(--font-space)" }}
            className="text-[10px] tracking-[0.2em] text-[#999] uppercase mb-4"
          >
            Contact
          </p>
          <a
            href="mailto:ameenjawhares@gmail.com"
            className="block text-[12px] text-[#111] hover-underline mb-2"
            style={{ fontFamily: "var(--font-space)" }}
            data-cursor-hover
          >
            ameenjawhares@gmail.com
          </a>
          <p
            style={{ fontFamily: "var(--font-space)" }}
            className="text-[12px] text-[#555]"
          >
            Kerala, India
          </p>
        </div>

        {/* Socials */}
        <div className="p-6 md:p-8">
          <p
            style={{ fontFamily: "var(--font-space)" }}
            className="text-[10px] tracking-[0.2em] text-[#999] uppercase mb-4"
          >
            Links
          </p>
          <div className="flex flex-col gap-2">
            {[
              { label: "GitHub", href: "https://github.com/Ameen-Jr" },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/ameen-jawhar/" },
              { label: "Twitter / X", href: "#" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-[#111] hover-underline"
                style={{ fontFamily: "var(--font-space)" }}
                data-cursor-hover
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>

        {/* Time */}
        <div className="p-6 md:p-8">
          <p
            style={{ fontFamily: "var(--font-space)" }}
            className="text-[10px] tracking-[0.2em] text-[#999] uppercase mb-4"
          >
            Local Time
          </p>
          <p
            style={{ fontFamily: "var(--font-space)" }}
            className="text-[12px] text-[#555]"
          >
            IST — <LocalTime />
          </p>
        </div>
      </motion.div>

      {/* Giant name strip at very bottom — exactly like reference */}
      <div className="relative overflow-hidden bg-[#1a1a1a] border-t border-[#2a2a2a]">
        <p
          style={{ fontFamily: "var(--font-bebas)" }}
          className="text-[18vw] leading-none tracking-tight text-[#2a2a2a] select-none whitespace-nowrap py-4 pl-4"
          aria-hidden="true"
        >
          AMEEN JAWHAR
        </p>
      </div>
    </section>
  );
}
