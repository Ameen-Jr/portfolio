"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const pillars = [
  { num: "01", title: "FULL-STACK\nDEVELOPMENT", body: "Crafting scalable, hyper-performant architectures using React.js, FastAPI, Node.js, and optimized modern web databases.", accent: false },
  { num: "02", title: "GRAPHIC &\nVISUAL DESIGN",  body: "Orchestrating high-end visual layouts, vector precision, and publication pacing with Inkscape, Scribus, and motion design via CapCut.", accent: true },
  { num: "03", title: "INSTRUCTIONAL\nLOGIC & CLARITY", body: "Translating highly complex engineering architectures and core physical/abstract logic into transparent, production-grade documentation and human mentorship.", accent: false },
];

function PillarCard({ num, title, body, accent, index }: typeof pillars[0] & { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) scale(1.01)`;
    el.style.transition = "transform 0.1s ease";
  };
  const handleLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
    e.currentTarget.style.transition = "transform 0.5s ease";
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: index * 0.12 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`flex flex-col justify-between p-8 md:p-10 min-h-[420px] will-change-transform ${accent ? "bg-[#7ca48d] text-[#0f0f0f]" : "bg-[#161616] text-[#f0f0f0]"}`}
    >
      <span style={{ fontFamily: "var(--font-space)" }} className={`text-[11px] tracking-[0.2em] ${accent ? "text-[#1a4035]" : "text-[#6b6b6b]"}`}>{num}</span>
      <h3 style={{ fontFamily: "var(--font-bebas)" }} className="text-[clamp(2.4rem,4.5vw,3.8rem)] leading-[0.9] tracking-tight uppercase whitespace-pre-line mt-auto mb-6">{title}</h3>
      <p style={{ fontFamily: "var(--font-inter)" }} className={`text-[13px] leading-relaxed max-w-[340px] ${accent ? "text-[#1a4035]" : "text-[#888]"}`}>{body}</p>
    </motion.div>
  );
}

export default function TriplePillar() {
  return (
    <section className="w-full bg-[#0f0f0f] border-t border-[#2a2a2a]" id="services">
      <div className="px-6 md:px-10 py-10 border-b border-[#2a2a2a] flex items-center justify-between">
        <span style={{ fontFamily: "var(--font-space)" }} className="text-[10px] tracking-[0.25em] text-[#6b6b6b] uppercase">Disciplines</span>
        <span style={{ fontFamily: "var(--font-space)" }} className="text-[10px] tracking-[0.25em] text-[#3a3a3a] uppercase">03 Pillars</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#2a2a2a]">
        {pillars.map((p, i) => <PillarCard key={p.num} {...p} index={i} />)}
      </div>
    </section>
  );
}
