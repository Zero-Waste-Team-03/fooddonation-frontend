import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CTASection() {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.2 });

  return (
    <section ref={ref} id="download" className="relative w-full py-32 overflow-hidden">
      {/* Animated Blob Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] min-w-[800px] aspect-square pointer-events-none z-0">
        <svg
          viewBox="0 0 1000 1000"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          style={{
            fill: "var(--color-primary)",
            opacity: 0.06,
            animation: "blob-spin 40s linear infinite",
            transformOrigin: "center center",
          }}
        >
          <path d="M856,667Q764,834,586,881Q408,928,266,794Q124,660,157,472Q190,284,364,183Q538,82,743,166Q948,250,948,475Q948,700,856,667Z" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center gap-10">
        {/* Headline */}
        <h2
          className={cn(
            "leading-[0.9] transition-all duration-700",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "clamp(40px, 6vw, 72px)",
            color: "var(--color-foreground)",
          }}
        >
          Your table is set.
          <br />
          <span style={{ color: "var(--color-primary)" }}>Will you share?</span>
        </h2>

        {/* Subheading */}
        <p
          className={cn(
            "text-xl leading-relaxed text-muted-foreground max-w-[620px] transition-all duration-700 delay-100",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          Start your journey as a Mindful Curator today. Registration is free, impact is priceless.
        </p>

        {/* CTA & Badges */}
        <div
          className={cn(
            "flex flex-col items-center gap-8 transition-all duration-700 delay-200",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {/* Existing CTA Button */}
          <Button
            className="h-[60px] px-10 rounded-xl bg-primary hover:bg-primary-hover text-white font-sans font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
            size="lg"
          >
            Create Your Profile
          </Button>

          {/* Store Badges */}
          <div className="flex items-center gap-4">
            <a
              href="#"
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
              href="#"
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
        </div>

        {/* Social Proof Micro-stats */}
        <div
          className={cn(
            "flex flex-wrap justify-center gap-2 text-sm font-medium text-muted-foreground transition-all duration-700 delay-300",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <span>4.8 ★ on App Store</span>
          <span>·</span>
          <span>10k+ downloads</span>
          <span>·</span>
          <span>Available in Algeria</span>
        </div>
      </div>

      <style>{`
        @keyframes blob-spin {
          from { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
          to { transform: rotate(360deg) scale(1); }
        }
      `}</style>
    </section>
  );
}
