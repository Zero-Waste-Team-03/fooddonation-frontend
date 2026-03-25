import { lazy, Suspense, useEffect, useState } from "react";
import { HeroCanvas } from "./HeroCanvas";
import { Button } from "@/components/ui/button";

const Hero3DScene = lazy(() =>
  import("@/features/landing/components/Hero3DScene").then((m) => ({
    default: m.Hero3DScene,
  }))
);

export function HeroSection() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden w-full"
      style={{ background: "var(--hero-bg)" }}
    >
      <Suspense fallback={null}>
        <Hero3DScene reducedMotion={reducedMotion} />
      </Suspense>

      <HeroCanvas />

      <div className="relative z-10 container mx-auto px-6 py-32">
        <div className="max-w-4xl">
          {/* Main headline */}
          <h1
            className="mb-8 leading-none"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(52px, 8vw, 96px)",
              color: "var(--hero-text)",
              letterSpacing: "-0.03em",
            }}
          >
            <em style={{ fontStyle: "italic", color: "var(--color-primary)" }}>Share</em> Food,
            <br />
            <span className="relative inline-block">
              Save the Planet
              <svg
                aria-hidden="true"
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                preserveAspectRatio="none"
                style={{ height: "10px" }}
              >
                <path
                  d="M0,6 C50,2 100,10 150,6 C200,2 250,10 300,6"
                  fill="none"
                  stroke="var(--color-primary)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.5"
                />
              </svg>
            </span>
          </h1>

          {/* Subheading */}
          <p
            className="text-xl mb-12 max-w-2xl leading-relaxed"
            style={{ color: "var(--hero-text-muted)" }}
          >
            Join Gasp'Zero, the digital journal for social good. Transform surplus into community
            strength with our curated local exchange platform.
          </p>

          {/* Store badges and CTA */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <a
                href="#download"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download on Google Play"
                className="hover:opacity-80 transition-opacity"
              >
                <img
                  src="/badges/google-play.svg"
                  alt="Get it on Google Play"
                  className="h-12 w-auto"
                />
              </a>
              <a
                href="#download"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download on the App Store"
                className="hover:opacity-80 transition-opacity"
              >
                <img
                  src="/badges/app-store.svg"
                  alt="Download on the App Store"
                  className="h-12 w-auto"
                />
              </a>
            </div>

            <Button
              variant="ghost"
              className="h-[56px] px-8 rounded-xl text-[#f0f7ec] font-sans font-semibold text-base hover:bg-white/10"
            >
              View Local Map
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        style={{ color: "var(--hero-text-muted)" }}
        aria-hidden="true"
      >
        <span className="text-xs tracking-widest uppercase font-medium">Scroll</span>
        <div
          className="w-px h-16 origin-top"
          style={{
            background: "linear-gradient(to bottom, var(--color-primary), transparent)",
            animation: "scrollLine 2s ease-in-out infinite",
          }}
        />
      </div>
    </section>
  );
}
