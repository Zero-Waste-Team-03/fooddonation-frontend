import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";
import { Leaf } from "lucide-react";
import missionImage from "@/assets/landing/mission-image.png";

export function MissionSection() {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.2 });

  return (
    <section ref={ref} id="mission" className="relative w-full bg-card py-24 overflow-hidden">
      {/* Organic shape background */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary opacity-[0.03] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 flex flex-col gap-20 relative z-10">
        {/* Top Content - Right Aligned */}
        <div
          className={cn(
            "flex flex-col items-end gap-6 w-full max-w-[800px] ml-auto reveal-right",
            inView && "in-view"
          )}
        >
          <h2 className="font-display font-bold text-4xl md:text-5xl text-primary tracking-tight text-right">
            Our Mission
          </h2>
          <p className="font-sans text-2xl md:text-[30px] leading-[1.3] text-foreground text-right font-light">
            "We believe every meal has a home. By bridging the gap between surplus and need, we
            cultivate an ecosystem of radical generosity."
          </p>
          <div className="w-24 h-1.5 bg-primary/20 rounded-full" />
        </div>

        {/* Bottom Content - 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Image */}
          <div
            className={cn(
              "relative rounded-2xl overflow-hidden shadow-xl bg-muted aspect-video w-full reveal-left",
              inView && "in-view"
            )}
            style={{ transitionDelay: "200ms" }}
          >
            {/* Image accent border */}
            <div className="absolute inset-0 border-[6px] border-background/20 z-10 rounded-2xl pointer-events-none" />
            <img
              src={missionImage}
              alt="Community food sharing"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Right Column - Content */}
          <div
            className={cn("flex flex-col gap-6 reveal-right", inView && "in-view")}
            style={{ transitionDelay: "400ms" }}
          >
            <h3 className="font-display font-bold text-3xl text-foreground">
              Cultivating Local Impact
            </h3>
            <p className="font-sans font-normal text-lg leading-[1.7] text-muted-foreground">
              Gasp'Zero is more than an app; it's a movement. We reduce food waste by 40% in
              participating neighborhoods by enabling instant, trustworthy food sharing. No
              complicated logistics, just neighbors feeding neighbors.
            </p>

            <div className="flex items-center gap-4 mt-4 p-4 bg-background rounded-xl border border-border shadow-sm">
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <Leaf className="w-6 h-6" />
              </div>
              <span className="font-sans font-medium text-lg text-foreground">
                Carbon-neutral distribution network
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none z-10 translate-y-[1px]">
        <svg
          viewBox="0 0 1440 60"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-12 md:h-16 fill-background"
        >
          <path d="M0,0 C360,40 1080,40 1440,0 L1440,60 L0,60 Z" />
        </svg>
      </div>
    </section>
  );
}
