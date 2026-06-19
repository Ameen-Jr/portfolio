import CustomCursor from "@/components/CustomCursor";
import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import MarqueeStrip from "@/components/MarqueeStrip";
import TriplePillar from "@/components/TriplePillar";
import FeaturedWork from "@/components/FeaturedWork";
import ContactSection from "@/components/ContactSection";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

export default function Home() {
  return (
    <SmoothScrollProvider>
      {/* Custom cursor — renders portal-style on top of everything */}
      <CustomCursor />

      {/* Navigation */}
      <NavBar />

      {/* Main content */}
      <main>
        {/* 01 — Hero */}
        <HeroSection />

        {/* 02 — Infinite marquee */}
        <MarqueeStrip />

        {/* 03 — Triple pillar disciplines */}
        <TriplePillar />

        {/* 04 — Pinned featured work */}
        <FeaturedWork />

        {/* 05 — Contact / Footer */}
        <ContactSection />
      </main>
    </SmoothScrollProvider>
  );
}
