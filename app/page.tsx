"use client";

import { useState } from "react";
import CustomCursor from "@/components/CustomCursor";
import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import MarqueeStrip from "@/components/MarqueeStrip";
import TriplePillar from "@/components/TriplePillar";
import FeaturedWork from "@/components/FeaturedWork";
import ContactSection from "@/components/ContactSection";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import LoadingScreen from "@/components/LoadingScreen";
import TezauraCaseStudy from "@/components/TezauraCaseStudy";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [showCaseStudy, setShowCaseStudy] = useState(false);

  return (
    <SmoothScrollProvider>
      <CustomCursor />
      {showCaseStudy && (
        <TezauraCaseStudy onClose={() => setShowCaseStudy(false)} />
      )}

      {/* Preloader — unmounts itself after animation */}
      <LoadingScreen onComplete={() => setLoaded(true)} />

      {/* Main site fades in after preloader exits */}
      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.6s ease 0.1s",
          visibility: loaded ? "visible" : "hidden",
        }}
      >
        <NavBar />
        <main>
          <HeroSection ready={loaded} />
          <MarqueeStrip />
          <TriplePillar />
          <FeaturedWork onCaseStudyOpen={() => setShowCaseStudy(true)} />
          <ContactSection />
        </main>
      </div>
    </SmoothScrollProvider>
  );
}
