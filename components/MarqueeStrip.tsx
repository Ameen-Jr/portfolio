"use client";

const MARQUEE_TEXT = "AMEEN JAWHAR ✦ FULL STACK BUILDER ✦ DESIGN ENGINEER ✦ ";
const REPEATS = 6; // repeat enough to fill double the viewport width

export default function MarqueeStrip() {
  const text = MARQUEE_TEXT.repeat(REPEATS);

  return (
    <div
      className="w-full overflow-hidden bg-[#0f0f0f] border-t border-b border-[#2a2a2a] py-4 select-none"
      aria-label="Marquee: Ameen Jawhar — Full Stack Builder — Design Engineer"
    >
      {/* Duplicate the text inside .marquee-track so the -50% translateX creates a seamless loop */}
      <div className="marquee-track">
        <span
          style={{ fontFamily: "var(--font-bebas)" }}
          className="text-[clamp(1.8rem,4vw,3rem)] tracking-[0.1em] text-[#f0f0f0] whitespace-nowrap pr-0"
        >
          {text}
          {text}
        </span>
      </div>
    </div>
  );
}
