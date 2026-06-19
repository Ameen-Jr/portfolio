"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const callouts = [
  {
    index: "01",
    title: "Full-Stack Desktop ERP",
    body: "Engineered an offline-first, local client-server architecture wrapping a React 19 + Vite frontend and a Python FastAPI backend into a production-ready desktop shell using Tauri 2 (Rust).",
  },
  {
    index: "02",
    title: "Automated Logistics & Workflows",
    body: "Developed dual-session batch attendance engines, mid-year dynamic fee-rate scheduling, library gamification, and keyboard-navigable spreadsheets for bulk exam data processing.",
  },
  {
    index: "03",
    title: "Custom SVG Analytics & Communications",
    body: "Built zero-dependency, raw SVG analytics scatter plots for academic risk assessment, paired with client-side browser automation executing customized result transmissions via wa.me deep links.",
  },
  {
    index: "04",
    title: "Resilient Desktop Lifecycle",
    body: "Shipped a versioned ZIP update engine with custom schema migrations (migrate.py), automated pre-promotion local database backups, and scheduled Google Drive OAuth2 cloud archival tasks.",
  },
];

/* ── individual callout row ── */
function CalloutRow({
  index,
  title,
  body,
  progress,
  i,
}: {
  index: string;
  title: string;
  body: string;
  progress: any;
  i: number;
}) {
  const segments = callouts.length;
  const start = i / segments;
  const end = (i + 0.7) / segments;

  const opacity = useTransform(progress, [start, end, end + 0.15], [0, 1, 1]);
  const y = useTransform(progress, [start, end], [40, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="border-b border-[#2a2a2a] last:border-b-0 py-6"
    >
      <div className="flex gap-4 items-start">
        <span
          style={{ fontFamily: "var(--font-space)" }}
          className="text-[10px] tracking-[0.2em] text-[#3a3a3a] pt-1 shrink-0"
        >
          {index}
        </span>
        <div>
          <h4
            style={{ fontFamily: "var(--font-inter)" }}
            className="text-[13px] font-semibold text-[#f0f0f0] mb-1.5 leading-snug"
          >
            {title}
          </h4>
          <p
            style={{ fontFamily: "var(--font-inter)" }}
            className="text-[12px] text-[#6b6b6b] leading-relaxed"
          >
            {body}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturedWork() {
  /* Container is 400vh tall; inner sticky element is 100vh */
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  /* Subtle background colour shift */
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["#0f0f0f", "#131713", "#0f0f0f"]
  );

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative"
      style={{ height: "380vh" }}
    >
      {/* Sticky inner */}
      <motion.div
        style={{ backgroundColor: bgColor }}
        className="sticky top-0 h-screen w-full flex flex-col border-t border-[#2a2a2a] overflow-hidden"
      >
        {/* Section header */}
        <div className="w-full border-b border-[#2a2a2a] px-6 md:px-10 py-5 flex items-center justify-between shrink-0">
          <span
            style={{ fontFamily: "var(--font-space)" }}
            className="text-[10px] tracking-[0.25em] text-[#6b6b6b] uppercase"
          >
            Featured Work
          </span>
          <span
            style={{ fontFamily: "var(--font-space)" }}
            className="text-[10px] tracking-[0.25em] text-[#3a3a3a] uppercase"
          >
            Case Study — 01
          </span>
        </div>

        {/* Main content: two-column */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_1fr] divide-y md:divide-y-0 md:divide-x divide-[#2a2a2a] overflow-hidden">

          {/* ── LEFT: technical callouts ── */}
          <div className="flex flex-col justify-between p-6 md:p-10 overflow-hidden">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
              >
                <span
                  style={{ fontFamily: "var(--font-space)" }}
                  className="text-[10px] tracking-[0.2em] text-[#7ca48d] uppercase"
                >
                  Technical Highlights
                </span>
              </motion.div>

              <div className="mt-6">
                {callouts.map((c, i) => (
                  <CalloutRow
                    key={c.index}
                    {...c}
                    i={i}
                    progress={scrollYProgress}
                  />
                ))}
              </div>
            </div>

            {/* View project link */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.6 }}
              viewport={{ once: true }}
              className="mt-6"
            >
              <a
                href="#"
                className="hover-underline text-[11px] tracking-widest uppercase text-[#6b6b6b] hover:text-[#f0f0f0] transition-colors"
                style={{ fontFamily: "var(--font-space)" }}
                data-cursor-hover
              >
                View Full Case Study ↗
              </a>
            </motion.div>
          </div>

          {/* ── RIGHT: project identity panel ── */}
          <div className="relative flex flex-col justify-between p-6 md:p-10 bg-[#111] overflow-hidden">

            {/* Decorative grid lines */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none opacity-[0.06]"
              style={{
                backgroundImage:
                  "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />

            {/* Top: project number */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <span
                style={{ fontFamily: "var(--font-space)" }}
                className="text-[10px] tracking-[0.25em] text-[#3a3a3a] uppercase"
              >
                Project 01 / 2025
              </span>
            </motion.div>

            {/* Center: giant project name */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              viewport={{ once: true }}
              className="relative z-10 text-center md:text-left"
            >
              <h2
                style={{ fontFamily: "var(--font-bebas)" }}
                className="text-[clamp(4rem,10vw,9rem)] leading-[0.85] tracking-tight text-[#f0f0f0]"
              >
                TEZAURA
              </h2>
              <p
                style={{ fontFamily: "var(--font-space)" }}
                className="text-[#7ca48d] text-[12px] tracking-widest uppercase mt-3"
              >
                Refining Academic Logistics
              </p>

              {/* Tech tags */}
              <div className="flex flex-wrap gap-2 mt-6">
                {["React 19", "FastAPI", "Tauri 2", "Python", "Rust", "SQLite"].map(
                  (tag) => (
                    <span
                      key={tag}
                      style={{ fontFamily: "var(--font-space)" }}
                      className="text-[9px] tracking-widest uppercase border border-[#2a2a2a] text-[#6b6b6b] px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </motion.div>

            {/* Bottom row */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              viewport={{ once: true }}
              className="relative z-10 flex items-end justify-between"
            >
              <div>
                <p
                  style={{ fontFamily: "var(--font-space)" }}
                  className="text-[9px] tracking-[0.2em] text-[#3a3a3a] uppercase"
                >
                  Type
                </p>
                <p
                  style={{ fontFamily: "var(--font-space)" }}
                  className="text-[11px] text-[#888] mt-1"
                >
                  Desktop ERP
                </p>
              </div>
              <div className="text-right">
                <p
                  style={{ fontFamily: "var(--font-space)" }}
                  className="text-[9px] tracking-[0.2em] text-[#3a3a3a] uppercase"
                >
                  Status
                </p>
                <p
                  style={{ fontFamily: "var(--font-space)" }}
                  className="text-[11px] text-[#7ca48d] mt-1"
                >
                  Production
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
