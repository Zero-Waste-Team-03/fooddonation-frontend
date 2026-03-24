import { Button } from "@/components/ui/button";
import heroImage from "@/assets/landing/hero-image.png";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex items-center pt-20 overflow-hidden bg-background"
    >
      {/* Background Blob */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] text-primary opacity-[0.08] z-0 pointer-events-none">
        <svg
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full fill-current"
        >
          <path
            d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.3C93.5,8.6,82.2,21.5,71.2,32.6C60.2,43.7,49.5,53,37.6,60.8C25.7,68.6,12.6,74.9,-1.1,76.8C-14.8,78.7,-31.1,76.2,-45.3,69.5C-59.5,62.8,-71.6,51.9,-79.3,38.5C-87,25.1,-90.3,9.2,-87.6,-5.4C-84.9,-20,-76.3,-33.3,-65.4,-44.3C-54.5,-55.3,-41.3,-64,-27.9,-71.6C-14.5,-79.2,-0.9,-85.7,13.2,-87.5L27.3,-89.3"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      <div className="w-full max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center relative z-10">
        {/* Left Content */}
        <div className="flex flex-col items-start max-w-[650px] w-full">
          <h1
            className={cn(
              "font-display font-bold text-[40px] md:text-[60px] leading-[1.1] text-foreground mb-6 transition-all duration-700 ease-out",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <span className="text-primary">Share</span> Food,
            <br />
            Save the Planet
          </h1>

          <p
            className={cn(
              "font-sans text-lg md:text-[20px] leading-[1.5] text-muted-foreground max-w-[580px] mb-8 transition-all duration-700 delay-100 ease-out",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            Join Gasp'Zero, the digital journal for social good. Transform surplus into community
            strength with our curated local exchange platform.
          </p>

          <div
            className={cn(
              "flex flex-col sm:flex-row items-center gap-4 mb-10 w-full sm:w-auto transition-all duration-700 delay-200 ease-out",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <Button
              className="h-[56px] px-8 w-full sm:w-auto rounded-xl bg-primary hover:bg-primary-hover text-white font-sans font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              size="lg"
            >
              Get the App
            </Button>
            <Button
              variant="ghost"
              className="h-[56px] px-8 w-full sm:w-auto rounded-xl text-primary font-sans font-semibold text-base hover:bg-primary/5"
            >
              View Local Map
            </Button>
          </div>

          <div
            className={cn(
              "flex flex-row gap-4 transition-all duration-700 delay-300 ease-out",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
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
                className="h-12 md:h-14 w-auto"
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
                className="h-12 md:h-14 w-auto"
              />
            </a>
          </div>
        </div>

        {/* Right Content / Image */}
        <div
          className={cn(
            "relative w-full max-w-[500px] lg:max-w-none flex justify-center lg:justify-end transition-all duration-1000 delay-300 ease-out",
            mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
          )}
        >
          {/* Main Image Container */}
          <div className="relative z-10 rounded-[32px] overflow-hidden shadow-2xl bg-card border border-border/50">
            <img src={heroImage} alt="App Interface" className="w-full h-auto object-cover" />
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none z-10">
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-16 md:h-20 fill-card"
        >
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </section>
  );
}
