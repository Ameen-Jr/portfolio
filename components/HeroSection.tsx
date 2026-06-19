"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ── Animated wavy SVG background ── */
function WavyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Bail for reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.lineWidth = 0.5;
      for (let y = 0; y < canvas.height; y += 14) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      return () => window.removeEventListener("resize", resize);
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 0.6;

      const lines = Math.ceil(canvas.height / 14);
      for (let i = 0; i < lines; i++) {
        const y = i * 14;
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 4) {
          const wave =
            Math.sin((x / canvas.width) * Math.PI * 3 + frame * 0.012 + i * 0.3) * 6 +
            Math.sin((x / canvas.width) * Math.PI * 6 - frame * 0.008 + i * 0.15) * 3;
          if (x === 0) ctx.moveTo(x, y + wave);
          else ctx.lineTo(x, y + wave);
        }
        ctx.stroke();
      }
      frame++;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      id="about"
      ref={ref}
      className="relative w-full min-h-screen bg-[#0f0f0f] overflow-hidden flex flex-col"
    >
      <WavyBackground />

      {/* Stat row — top */}
      <div className="relative z-10 w-full border-b border-[#2a2a2a] mt-[72px] grid grid-cols-3 text-center">
        <div className="border-r border-[#2a2a2a] py-3">
          <span
            style={{ fontFamily: "var(--font-space)" }}
            className="text-[10px] tracking-[0.2em] text-[#6b6b6b] uppercase"
          >
            Btech CSE
          </span>
        </div>
        <div className="border-r border-[#2a2a2a] py-3">
          <span
            style={{ fontFamily: "var(--font-space)" }}
            className="text-[10px] tracking-[0.2em] text-[#6b6b6b] uppercase"
          >
            Based in Kerala, IN
          </span>
        </div>
        <div className="py-3">
          <span
            style={{ fontFamily: "var(--font-space)" }}
            className="text-[10px] tracking-[0.2em] text-[#6b6b6b] uppercase"
          >
            Open to Work
          </span>
        </div>
      </div>

      {/* Giant display heading */}
      <motion.div
        style={{ y: titleY, opacity }}
        className="relative z-10 flex-1 flex flex-col justify-center px-4 md:px-10 pt-8 pb-4"
      >
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{ fontFamily: "var(--font-bebas)" }}
          className="text-[13vw] sm:text-[12vw] md:text-[11vw] leading-[0.88] tracking-tight text-[#f0f0f0] uppercase"
        >
          ARCHITECTING
          <br />
          <span className="text-[var(--accent)]">CLEAN</span> FULL‑STACK
          <br />
          LOGIC WITH A
          <br />
          <span className="relative inline-block">
            DESIGNER&rsquo;S EYE.
            {/* Sketch underline */}
            <svg
              aria-hidden="true"
              className="absolute left-0 -bottom-2 w-full"
              viewBox="0 0 400 12"
              preserveAspectRatio="none"
            >
              <path
                d="M2 8 Q50 2 100 8 Q150 14 200 8 Q250 2 300 8 Q350 14 398 8"
                stroke="var(--accent)"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </motion.h1>
      </motion.div>

      {/* Bottom info strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
        className="relative z-10 w-full border-t border-[#2a2a2a] grid grid-cols-3 items-start px-0"
      >
        {/* Left */}
        <div className="border-r border-[#2a2a2a] p-6">
          <p
            style={{ fontFamily: "var(--font-space)" }}
            className="text-[10px] tracking-[0.2em] text-[#6b6b6b] uppercase mb-3"
          >
            System
          </p>
          <p
            style={{ fontFamily: "var(--font-space)" }}
            className="text-[11px] text-[#888] leading-relaxed"
          >
            [ SYSTEM: BTECH CSE
            <br />
            // BASED IN KERALA, IN ]
          </p>
        </div>

        {/* Center */}
        <div className="border-r border-[#2a2a2a] p-6">
          <p
            style={{ fontFamily: "var(--font-inter)" }}
            className="text-[12px] text-[#6b6b6b] leading-relaxed"
          >
            Full-stack engineer with a designer&rsquo;s precision — building scalable
            systems that perform at every layer, from data to pixel.
          </p>
        </div>

        {/* Right */}
        <div className="p-6">
          <button
            onClick={() =>
              document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
            }
            className="hover-underline text-[12px] tracking-widest uppercase"
            style={{ fontFamily: "var(--font-space)" }}
          >
            View Work ↗
          </button>
        </div>
      </motion.div>
    </section>
  );
}
