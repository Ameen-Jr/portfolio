"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MagicBento from "./MagicBento";

/* ── Types ── */
interface Props {
  onClose: () => void;
}

/* ── Screenshot data ── */
const screenshots = [
  { page: "01", label: "Splash Screen" },
  { page: "02", label: "Secure Access" },
  { page: "03", label: "Dashboard" },
  { page: "04", label: "Student Directory" },
  { page: "05", label: "New Admission" },
  { page: "06", label: "Attendance Register" },
  { page: "07", label: "Exam & Results" },
  { page: "08", label: "Class Reports" },
  { page: "09", label: "Student Analytics" },
  { page: "10", label: "Fee Collection Chart" },
  { page: "11", label: "Fee Grid — Student View" },
  { page: "12", label: "Library Management" },
  { page: "13", label: "Custom List Generator" },
  { page: "14", label: "Year-End Promotion Wizard" },
  { page: "15", label: "Software Settings" },
  { page: "16", label: "Data Safety Center" },
  { page: "17", label: "Google Drive Auto-Backup" },
  { page: "18", label: "About — App Info" },
  { page: "19", label: "About — Developer Profile" },
  { page: "20", label: "Terms & Conditions" },
  { page: "21", label: "Privacy Policy" },
];

/* ── Module data ── */
const modules = [
  {
    num: "01",
    title: "Admissions & Student Directory",
    body: "Full registration with photo upload, auto-suggested admission numbers, guardian details, SSLC reg, activities tagging, and Power Search across active and archived students.",
    accent: false,
  },
  {
    num: "02",
    title: "Student Profile Command Center",
    body: "Centralised read/edit hub per student — personal & guardian info, animated attendance bar, full fee payment history, exam mark history, SSLC grade panel, photo lightbox, and discontinue controls with soft-delete archival.",
    accent: true,
  },
  {
    num: "03",
    title: "Dual-Session Attendance Engine",
    body: "Day and Night sessions recorded independently per class and division. Click-to-toggle rows, clean upsert on save, and success animation modal. Attendance feeds directly into per-student progress bars.",
    accent: false,
  },
  {
    num: "04",
    title: "Fee Collection & Mid-Year Rate Engine",
    body: "Month-by-month payment grid with proportional fill animations. Supports two fee rates per class with a configurable switch month — earlier months bill at the legacy rate, later at the new rate. Exemption badges for waived months.",
    accent: true,
  },
  {
    num: "05",
    title: "Examination Control + WhatsApp Dispatch",
    body: "Keyboard-navigable spreadsheet marksheet, bulk upsert save, sort by rank or subject, gender-split print view. Per-student progress card modal dispatched via wa.me deep links with pre-composed result message.",
    accent: false,
  },
  {
    num: "06",
    title: "Analytics Dashboard",
    body: "Zero-dependency custom SVG scatter plot mapping attendance % vs average marks %. Adjustable threshold sliders classify students into At Risk, Needs Attention, and Performing Well zones. Fullscreen mode with drill-down side panel.",
    accent: true,
  },
  {
    num: "07",
    title: "Custom List Generator + Print Engine",
    body: "Admin defines a title, class, division, and arbitrary column headers. The app renders a printable register with all students pre-listed. All reports use dedicated print stylesheets with meaningful PDF filenames.",
    accent: false,
  },
  {
    num: "08",
    title: "Library + Top Readers Hall of Fame",
    body: "Book issue and return workflow with autocomplete student search, accession tracking, and full history. Top 10 readers by academic year calculated automatically with gold, silver, and bronze rank badges.",
    accent: true,
  },
  {
    num: "09",
    title: "Year-End Promotion Wizard",
    body: "Two-step guided promotion: batch discontinue leavers, confirm alumni graduation year, optionally purge fee/exam/attendance records, auto-increment academic year. A local .db snapshot is written automatically before promotion runs.",
    accent: false,
  },
  {
    num: "10",
    title: "Google Drive OAuth2 Auto-Backup",
    body: "OAuth2 Desktop App flow with token.json persistence. On each startup, if 7+ days have elapsed, a ZIP of the SQLite DB and photos folder is uploaded to a configured Drive folder. Backups older than 90 days are auto-deleted.",
    accent: true,
  },
  {
    num: "11",
    title: "First-Launch Lifecycle Wizard",
    body: "Automated onboarding engine triggered dynamically via a setup_completed database state flag. Sequences core environment initializations, local configuration matrices, and regional setting injections securely on startup.",
    accent: false,
  },
  {
    num: "12",
    title: "Secure Identity & Session Control",
    body: "Full-viewport login canvas backed by client-side SHA-256 password hashing. Monitors system integrity via intensive 500ms backend health polling alongside cross-origin iframe sandboxing for Lottie assets.",
    accent: true,
  },
];

/* ── Stack pills ── */
const stack = [
  "React 19", "Vite", "Python FastAPI", "SQLite",
  "Tauri 2 (Rust)", "PyInstaller", "GSAP 3", "Lottie Web",
  "Google Drive API v3", "Custom SVG Charts",
];

/* ── 3D Carousel ── */
function ScreenshotCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);          // ← always-current ref
  const isScrollingRef = useRef(false);
  const CARD_W = 720;
  const GAP = 24;

  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const idx = Math.max(0, Math.min(
      screenshots.length - 1,
      Math.round(track.scrollLeft / (CARD_W + GAP))
    ));
    activeIndexRef.current = idx;            // ← keep ref in sync
    setActiveIndex(idx);
  }, []);

  const scrollTo = useCallback((idx: number) => {
    const track = trackRef.current;
    if (!track) return;
    const target = idx * (CARD_W + GAP);
    track.scrollTo({ left: target, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;

    // Init scroll position to first card centered
    track.scrollLeft = 0;
    track.addEventListener("scroll", handleScroll, { passive: true });

    const onWheel = (e: WheelEvent) => {
      const track = trackRef.current;
      if (!track) return;

      const atStart = track.scrollLeft <= 2;
      const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;

      // Release at edges so page vertical scroll continues
      if ((atStart && e.deltaY < 0) || (atEnd && e.deltaY > 0)) return;

      e.preventDefault();
      e.stopPropagation();

      if (isScrollingRef.current) return;
      isScrollingRef.current = true;

      const direction = e.deltaY > 0 ? 1 : -1;
      // ← Read from ref, not stale closure state
      const next = Math.max(0, Math.min(screenshots.length - 1, activeIndexRef.current + direction));
      activeIndexRef.current = next;         // ← update immediately
      scrollTo(next);

      setTimeout(() => { isScrollingRef.current = false; }, 550);
    };

    section.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      track.removeEventListener("scroll", handleScroll);
      section.removeEventListener("wheel", onWheel);
    };
  }, [handleScroll, scrollTo]);

  const getTransform = (i: number) => {
    const offset = i - activeIndex;
    const absOff = Math.abs(offset);
    if (absOff === 0) return { scale: 1, rotateY: 0, opacity: 1, z: 0 };
    if (absOff === 1) return { scale: 0.88, rotateY: offset > 0 ? 18 : -18, opacity: 0.75, z: -60 };
    if (absOff === 2) return { scale: 0.76, rotateY: offset > 0 ? 32 : -32, opacity: 0.45, z: -120 };
    return { scale: 0.65, rotateY: offset > 0 ? 40 : -40, opacity: 0.2, z: -180 };
  };

  return (
    <div ref={sectionRef} className="w-full" style={{ perspective: "1200px" }}>
      {/* Track */}
      <div
        ref={trackRef}
        style={{
          display: "flex",
          gap: GAP,
          overflowX: "scroll",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          paddingTop: 40,
          paddingBottom: 60,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="hide-scrollbar"
      >
        {/* Leading spacer */}
        <div style={{ flexShrink: 0, width: `calc((100vw - ${CARD_W}px) / 2)` }} />

        {screenshots.map((s, i) => {
          const t = getTransform(i);
          return (
            <div
              key={s.page}
              onClick={() => scrollTo(i)}
              style={{
                flexShrink: 0,
                width: CARD_W,
                scrollSnapAlign: "center",
                transform: `scale(${t.scale}) rotateY(${t.rotateY}deg) translateZ(${t.z}px)`,
                opacity: t.opacity,
                transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.45s ease",
                transformOrigin: "center center",
                transformStyle: "preserve-3d",
                cursor: i !== activeIndex ? "pointer" : "default",
                willChange: "transform",
              }}
            >
              {/* Card */}
              <div
                style={{
                  background: "#111",
                  border: "1px solid #2a2a2a",
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: i === activeIndex
                    ? "0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,164,141,0.3)"
                    : "0 20px 40px rgba(0,0,0,0.4)",
                }}
              >
                {/* Window chrome */}
                <div style={{
                  background: "#1a1a1a",
                  borderBottom: "1px solid #2a2a2a",
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
                  <span style={{
                    marginLeft: "auto",
                    fontFamily: "var(--font-space)",
                    fontSize: 10,
                    color: "#555",
                    letterSpacing: "0.1em",
                  }}>
                    TEZAURA — {s.label.toUpperCase()}
                  </span>
                </div>
                {/* Screenshot */}
                <div style={{ aspectRatio: "1920/1020", background: "#0a0a0a" }}>
                  <img
                    src={`/screenshots/page-${s.page}.png`}
                    alt={s.label}
                    style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
                    loading="lazy"
                    draggable={false}
                  />
                </div>
              </div>

              {/* Label below */}
              <p style={{
                fontFamily: "var(--font-space)",
                fontSize: 10,
                color: i === activeIndex ? "#7ca48d" : "#3a3a3a",
                textAlign: "center",
                marginTop: 16,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                transition: "color 0.3s ease",
              }}>
                {String(i + 1).padStart(2, "0")} — {s.label}
              </p>
            </div>
          );
        })}

        {/* Trailing spacer */}
        <div style={{ flexShrink: 0, width: `calc((100vw - ${CARD_W}px) / 2)` }} />
      </div>

      {/* Dot navigation */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 8 }}>
        {screenshots.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            style={{
              width: i === activeIndex ? 24 : 6,
              height: 6,
              borderRadius: 3,
              background: i === activeIndex ? "#7ca48d" : "#2a2a2a",
              border: "none",
              padding: 0,
              cursor: "pointer",
              transition: "width 0.3s ease, background 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Module card ── */
function ModuleCard({ num, title, body, accent }: typeof modules[0]) {
  return (
    <div style={{
      background: accent ? "#7ca48d" : "#111",
      border: `1px solid ${accent ? "transparent" : "#2a2a2a"}`,
      padding: "2rem",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      transition: "transform 0.3s ease, border-color 0.3s ease",
    }}
      onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <span style={{
        fontFamily: "var(--font-space)",
        fontSize: 10,
        letterSpacing: "0.2em",
        color: accent ? "#1a4035" : "#3a3a3a",
      }}>{num}</span>
      <h3 style={{
        fontFamily: "var(--font-bebas)",
        fontSize: "clamp(1.4rem, 2vw, 1.8rem)",
        lineHeight: 1,
        letterSpacing: "-0.01em",
        color: accent ? "#0f0f0f" : "#f0f0f0",
        textTransform: "uppercase",
      }}>{title}</h3>
      <p style={{
        fontFamily: "var(--font-inter)",
        fontSize: 12,
        lineHeight: 1.7,
        color: accent ? "#1a4035" : "#6b6b6b",
      }}>{body}</p>
    </div>
  );
}

/* ── Section label ── */
function SectionLabel({ label, count }: { label: string; count?: string }) {
  return (
    <div style={{
      borderTop: "1px solid #2a2a2a",
      borderBottom: "1px solid #2a2a2a",
      padding: "14px 40px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}>
      <span style={{ fontFamily: "var(--font-space)", fontSize: 10, letterSpacing: "0.25em", color: "#6b6b6b", textTransform: "uppercase" }}>{label}</span>
      {count && <span style={{ fontFamily: "var(--font-space)", fontSize: 10, letterSpacing: "0.25em", color: "#3a3a3a", textTransform: "uppercase" }}>{count}</span>}
    </div>
  );
}

/* ── Main component ── */
export default function TezauraCaseStudy({ onClose }: Props) {
  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
      document.documentElement.style.overflow = "";
    };
  }, []);

  // Escape key to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: "0%" }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
      onWheel={(e) => e.stopPropagation()}   // ← ADD THIS LINE
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "#0f0f0f",
        overflowY: "auto",
        overflowX: "hidden",
        scrollbarWidth: "thin",
        scrollbarColor: "#2a2a2a #0f0f0f",
      }}
    >
      {/* ── Fixed top bar ── */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "rgba(15,15,15,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #2a2a2a",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        height: 64,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: "var(--font-space)", fontSize: 10, letterSpacing: "0.25em", color: "#6b6b6b", textTransform: "uppercase" }}>
            Case Study
          </span>
          <span style={{ width: 1, height: 16, background: "#2a2a2a" }} />
          <span style={{ fontFamily: "var(--font-bebas)", fontSize: "1.4rem", color: "#7ca48d", letterSpacing: "0.05em" }}>
            TEZAURA
          </span>
        </div>
        <button
          onClick={onClose}
          className="pill-btn"
          style={{ fontSize: 11 }}
          data-cursor-hover
        >
          ✕ CLOSE
        </button>
      </div>

      {/* ── Hero ── */}
      <section style={{ padding: "80px 40px 60px", borderBottom: "1px solid #2a2a2a" }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <p style={{ fontFamily: "var(--font-space)", fontSize: 10, letterSpacing: "0.25em", color: "#7ca48d", textTransform: "uppercase", marginBottom: 24 }}>
            Full-Stack Desktop ERP · 2026
          </p>
          <h1 style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "clamp(3.5rem, 9vw, 8rem)",
            lineHeight: 0.88,
            letterSpacing: "-0.01em",
            color: "#f0f0f0",
            textTransform: "uppercase",
            marginBottom: 48,
          }}>
            REFINING<br />
            <span style={{ color: "#7ca48d" }}>ACADEMIC</span><br />
            LOGISTICS
          </h1>

          {/* Stat row — MagicBento */}
          <MagicBento
            cards={[
              { val: "10+", label: "Modules" },
              { val: "Local-First", label: "Architecture" },
              { val: "React 19+FastAPI", label: "Tech Stack" },
              { val: "Tauri 2 (Rust)", label: "Desktop Shell" },
              { val: "Live", label: "Deployed" },
            ]}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={false}
            enableMagnetism={true}
            clickEffect={true}
            spotlightRadius={420}
            particleCount={10}
            glowColor="124, 164, 141"
          />
        </motion.div>
      </section>

      {/* ── Overview ── */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid #2a2a2a" }}>
        <div style={{ padding: "48px 40px", borderRight: "1px solid #2a2a2a" }}>
          <p style={{ fontFamily: "var(--font-space)", fontSize: 10, letterSpacing: "0.2em", color: "#7ca48d", textTransform: "uppercase", marginBottom: 20 }}>
            The Problem
          </p>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: 13, color: "#888", lineHeight: 1.8 }}>
            Universal Trust tuition centre, Kunnuvazhy, ran entirely on paper registers and fragmented spreadsheets — attendance ledgers, fee books, exam mark sheets, library logs. Data was siloed, error-prone, and impossible to cross-reference. There was no way to spot a student who was both low on attendance and failing exams until it was too late.
          </p>
        </div>
        <div style={{ padding: "48px 40px" }}>
          <p style={{ fontFamily: "var(--font-space)", fontSize: 10, letterSpacing: "0.2em", color: "#7ca48d", textTransform: "uppercase", marginBottom: 20 }}>
            The Solution
          </p>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: 13, color: "#888", lineHeight: 1.8 }}>
            Tezaura is a single-machine, offline-first desktop ERP built on a React 19 frontend served by a Python FastAPI backend, packaged into a native Windows application via Tauri 2. It replaces every paper system with a unified, fast, printable, and analytically capable digital platform — no internet required for any core function.
          </p>
        </div>
      </section>

      {/* ── Screenshots ── */}
      <SectionLabel label="UI Walkthrough" count={`${screenshots.length} Screens`} />
      <section style={{ background: "#080808", paddingTop: 24, paddingBottom: 16, borderBottom: "1px solid #2a2a2a" }}>
        <ScreenshotCarousel />
      </section>

      {/* ── Modules ── */}
      <SectionLabel label="Feature Modules" count="12 Systems" />
      <section style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 0,
        borderBottom: "1px solid #2a2a2a",
      }}>
        {modules.map((m, i) => (
          <div
            key={m.num}
            style={{
              borderRight: (i + 1) % 3 !== 0 ? "1px solid #2a2a2a" : "none",
              borderBottom: i < 7 ? "1px solid #2a2a2a" : "none",
            }}
          >
            <ModuleCard {...m} />
          </div>
        ))}
      </section>

      {/* ── Architecture ── */}
      <SectionLabel label="Technical Architecture" />
      <section style={{
        background: "#0a0a0a",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        borderBottom: "1px solid #2a2a2a",
      }}>
        {/* Stack */}
        <div style={{ padding: "48px 40px", borderRight: "1px solid #2a2a2a" }}>
          <p style={{ fontFamily: "var(--font-space)", fontSize: 10, letterSpacing: "0.2em", color: "#6b6b6b", textTransform: "uppercase", marginBottom: 24 }}>
            Stack
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {stack.map(s => (
              <span key={s} style={{
                fontFamily: "var(--font-space)",
                fontSize: 9,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#6b6b6b",
                border: "1px solid #2a2a2a",
                padding: "6px 12px",
                borderRadius: 999,
                transition: "color 0.2s, border-color 0.2s",
                cursor: "default",
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = "#f0f0f0";
                  (e.currentTarget as HTMLElement).style.borderColor = "#7ca48d";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = "#6b6b6b";
                  (e.currentTarget as HTMLElement).style.borderColor = "#2a2a2a";
                }}
              >{s}</span>
            ))}
          </div>
        </div>

        {/* Diagram */}
        <div style={{ padding: "48px 40px" }}>
          <p style={{ fontFamily: "var(--font-space)", fontSize: 10, letterSpacing: "0.2em", color: "#6b6b6b", textTransform: "uppercase", marginBottom: 24 }}>
            Runtime Architecture
          </p>
          <pre style={{
            fontFamily: "var(--font-space)",
            fontSize: 11,
            color: "#555",
            lineHeight: 2,
            whiteSpace: "pre",
          }}>{`┌─────────────────────────┐
│     Tauri 2 Shell       │  ← Native Windows .exe
│   (Rust, WebView2)      │
└────────────┬────────────┘
             │ spawns
    ┌────────┴──────────┐
    │                   │
    ▼                   ▼
┌──────────┐    ┌──────────────┐
│ React 19 │◄──►│ FastAPI :8000│
│ WebView  │    │  (Python)    │
└──────────┘    └──────┬───────┘
                       │
                       ▼
               ┌───────────────┐
               │  SQLite DB    │
               │  + Photos     │
               └───────────────┘`}
          </pre>
        </div>
      </section>

      {/* ── Key Engineering Decisions ── */}
      <SectionLabel label="Key Engineering Decisions" count="04 Highlights" />
      <section style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        borderBottom: "1px solid #2a2a2a",
      }}>
        {[
          {
            n: "01",
            title: "Local-First by Design",
            body: "No cloud dependency for any core operation. The SQLite database lives on the institution's machine. Connectivity is only needed for optional Google Drive auto-backup.",
          },
          {
            n: "02",
            title: "Mid-Year Fee Rate Engine",
            body: "Two fee rates per class with a configurable cutover month. The system calculates each month's due using the correct rate automatically — no manual overrides needed.",
          },
          {
            n: "03",
            title: "Zero-Library SVG Charts",
            body: "The fee analytics graph — smooth multi-line chart, hover tooltips, toggle legend, defaulters bar — is built entirely in raw SVG with no charting library.",
          },
          {
            n: "04",
            title: "Schema Migration Engine",
            body: "A custom migrate.py runs on startup and applies versioned SQL patches to upgrade older databases, enabling safe field additions without data loss across client installations.",
          },
        ].map((d, i) => (
          <div key={d.n} style={{
            padding: "36px 28px",
            borderRight: i < 3 ? "1px solid #2a2a2a" : "none",
          }}>
            <span style={{ fontFamily: "var(--font-space)", fontSize: 10, color: "#3a3a3a", letterSpacing: "0.2em", display: "block", marginBottom: 16 }}>{d.n}</span>
            <h4 style={{ fontFamily: "var(--font-bebas)", fontSize: "1.2rem", color: "#f0f0f0", textTransform: "uppercase", marginBottom: 10, letterSpacing: "0.02em" }}>{d.title}</h4>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: 11, color: "#6b6b6b", lineHeight: 1.75 }}>{d.body}</p>
          </div>
        ))}
      </section>

      {/* ── CTA footer ── */}
      <section style={{
        background: "#f3f3f3",
        padding: "80px 40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 24,
      }}>
        <p style={{ fontFamily: "var(--font-space)", fontSize: 10, letterSpacing: "0.25em", color: "#999", textTransform: "uppercase" }}>
          Deployed & Operational — Universal Trust Tuition Centre, Kunnuvazhy
        </p>
        <h2 style={{
          fontFamily: "var(--font-bebas)",
          fontSize: "clamp(3rem, 7vw, 6rem)",
          color: "#111",
          letterSpacing: "-0.01em",
          lineHeight: 0.9,
          textTransform: "uppercase",
        }}>
          BUILT FOR THE<br />
          <span style={{ color: "#7ca48d" }}>REAL WORLD.</span>
        </h2>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: 13, color: "#555", maxWidth: 440, lineHeight: 1.7, marginTop: 8 }}>
          Tezaura runs live at the centre, managing 250+ students across 3 classes, with daily attendance, monthly fee collection, and automated cloud backups — on a single laptop, offline.
        </p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", marginTop: 16 }}>
          <a
            href="https://github.com/Ameen-Jr/tezaura"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-space)",
              fontSize: 11,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#111",
              border: "1px solid #333",
              padding: "14px 28px",
              borderRadius: 999,
              textDecoration: "none",
              transition: "background 0.3s, color 0.3s",
              display: "inline-block",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "#111";
              (e.currentTarget as HTMLElement).style.color = "#f0f0f0";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "#111";
            }}
          >
            GitHub ↗
          </a>
          <button
            onClick={onClose}
            data-cursor-hover
            style={{
              fontFamily: "var(--font-space)",
              fontSize: 11,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#f0f0f0",
              background: "#111",
              border: "1px solid #111",
              padding: "14px 28px",
              borderRadius: 999,
              cursor: "none",
              transition: "background 0.3s, color 0.3s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "#333";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "#111";
            }}
          >
            ← Back to Portfolio
          </button>
        </div>
      </section>

      {/* Scrollbar hide helper — injected once */}
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </motion.div>
  );
}
