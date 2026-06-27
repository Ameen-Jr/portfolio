"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";

/* ── Wavy canvas background ─────────────────────────────────────────── */
function WavyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frame = 0, animId: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.lineWidth = 0.5;
      for (let y = 0; y < canvas.height; y += 14) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
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
          x === 0 ? ctx.moveTo(x, y + wave) : ctx.lineTo(x, y + wave);
        }
        ctx.stroke();
      }
      frame++;
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden />;
}

/* ── Per-line reveal variant — slides up from behind overflow:hidden mask ── */
const lineVariant = {
  hidden: { y: "115%" },
  visible: (i: number) => ({
    y: "0%",
    transition: {
      duration: 1.0,
      ease: [0.16, 1, 0.3, 1],
      delay: i * 0.11,
    },
  }),
};

/* ── Bottom strip fade variant ── */
const fadeVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.52 },
  },
};

/* ── Masked line wrapper ── */
function RevealLine({
  children,
  index,
  ready,
  extraPb = false,
}: {
  children: React.ReactNode;
  index: number;
  ready: boolean;
  extraPb?: boolean;
}) {
  return (
    <div
      style={{
        overflow: "hidden",
        paddingBottom: extraPb ? "0.35em" : undefined,
        lineHeight: "inherit",
      }}
    >
      <motion.div
        custom={index}
        variants={lineVariant}
        initial="hidden"
        animate={ready ? "visible" : "hidden"}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ── Main component ── */
export default function HeroSection({ ready = false }: { ready?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);

  /* Scroll-driven parallax on the whole heading block */
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const blockY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const blockOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  /* Mouse parallax — spring-smoothed */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spx = useSpring(mx, { stiffness: 40, damping: 18 });
  const spy = useSpring(my, { stiffness: 40, damping: 18 });
  const paraX = useTransform(spx, [-1, 1], [-18, 18]);
  const paraY = useTransform(spy, [-1, 1], [-10, 10]);

  /* Spotlight state */
  const [spot, setSpot] = useState({ x: 50, y: 50 });

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = sectionRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
    setSpot({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      onMouseMove={onMouseMove}
      className="relative w-full min-h-screen bg-[#0f0f0f] overflow-hidden flex flex-col"
    >
      <WavyBackground />

      {/* Mouse spotlight glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle 720px at ${spot.x}% ${spot.y}%, rgba(124,164,141,0.075) 0%, transparent 65%)`,
          transition: "background 0.15s ease-out",
        }}
      />

      {/* ── Stat row ── */}
      <div className="relative z-10 w-full border-b border-[#2a2a2a] mt-[72px] grid grid-cols-3 text-center">
        {["DESIGN ENGINEER", "Based in Kerala, IN", "Open to Work"].map((t, i) => (
          <div key={i} className={`py-3 ${i < 2 ? "border-r border-[#2a2a2a]" : ""}`}>
            <span style={{ fontFamily: "var(--font-space)" }} className="text-[10px] tracking-[0.2em] text-[#6b6b6b] uppercase">
              {t}
            </span>
          </div>
        ))}
      </div>

      {/* ── Heading block (scroll parallax wrapper) ── */}
      <motion.div
        style={{ y: blockY, opacity: blockOpacity }}
        className="relative z-10 flex-1 flex flex-col justify-center px-4 md:px-10 pt-8 pb-4"
      >
        {/* Mouse parallax wrapper — separate from entrance so they don't conflict */}
        <motion.div style={{ x: paraX, y: paraY }} className="will-change-transform">

          {/* Giant display type */}
          <div
            style={{ fontFamily: "var(--font-bebas)" }}
            className="text-[13vw] sm:text-[12vw] md:text-[11vw] leading-[0.9] tracking-tight text-[#f0f0f0] uppercase"
          >
            {/* Line 1 */}
            <RevealLine index={0} ready={ready}>
              ARCHITECTING
            </RevealLine>

            {/* Line 2 — "CLEAN" in accent green */}
            <RevealLine index={1} ready={ready}>
              <span className="text-[var(--accent)]">CLEAN</span>
              {" "}FULL&#8209;STACK
            </RevealLine>

            {/* Line 3 */}
            <RevealLine index={2} ready={ready}>
              LOGIC WITH A
            </RevealLine>

            {/* Line 4 — with wavy SVG underline; extra pb so SVG isn't clipped */}
            <RevealLine index={3} ready={ready} extraPb>
              <span className="relative inline-block">
                DESIGNER&rsquo;S EYE.
                <svg
                  aria-hidden
                  className="absolute left-0 -bottom-1 w-full"
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
            </RevealLine>
          </div>

        </motion.div>
      </motion.div>

      {/* ── Bottom info strip ── */}
      <motion.div
        variants={fadeVariant}
        initial="hidden"
        animate={ready ? "visible" : "hidden"}
        className="relative z-10 w-full border-t border-[#2a2a2a] grid grid-cols-3"
      >
        <div className="border-r border-[#2a2a2a] p-6">
          <p style={{ fontFamily: "var(--font-space)" }} className="text-[10px] tracking-[0.2em] text-[#6b6b6b] uppercase mb-3">
            System
          </p>
          <p style={{ fontFamily: "var(--font-space)" }} className="text-[11px] text-[#888] leading-relaxed">
            [ PRODUCT DEVELOPMENT<br />// BASED IN KERALA, IN ]
          </p>
        </div>
        <div className="border-r border-[#2a2a2a] p-6">
          <p style={{ fontFamily: "var(--font-inter)" }} className="text-[12px] text-[#6b6b6b] leading-relaxed">
            Full-stack engineer with a designer&rsquo;s precision — building scalable
            systems that perform at every layer, from data to pixel.
          </p>
        </div>
        <div className="p-6">
          <button
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
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
