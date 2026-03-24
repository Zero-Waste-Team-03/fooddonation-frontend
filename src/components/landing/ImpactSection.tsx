import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";
import { cn } from "@/lib/utils";

type StatCardProps = {
  end: number;
  suffix?: string;
  prefix?: string;
  label: string;
  decimals?: number;
  inView: boolean;
  delay?: number;
};

function StatCard({
  end,
  suffix = "",
  prefix = "",
  label,
  decimals = 0,
  inView,
  delay = 0,
}: StatCardProps) {
  const count = useCountUp(inView, { end, suffix, prefix, decimals, duration: 2500 });

  return (
    <div
      className={cn(
        "flex flex-col gap-2 pl-8 border-l-4 border-primary/20 reveal",
        inView && "in-view"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span className="font-display font-bold text-5xl md:text-6xl text-primary leading-none tabular-nums">
        {count}
      </span>
      <span className="font-sans font-bold text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export function ImpactSection() {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.3 });

  return (
    <section ref={ref} id="impact" className="w-full bg-card py-24 relative overflow-hidden">
      {/* Background Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary opacity-[0.04] rounded-full blur-3xl pointer-events-none" />

      {/* Top Wave Divider (Transition from Background) */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none z-10 -translate-y-[1px] rotate-180">
        <svg
          viewBox="0 0 1440 60"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-12 md:h-16 fill-card"
        >
          <path d="M0,60 C360,20 1080,20 1440,60 L1440,60 L0,60 Z" />
        </svg>
      </div>

      <div className="container mx-auto px-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-16 relative z-10">
        {/* Left Content */}
        <div className={cn("flex flex-col gap-8 max-w-[600px] reveal", inView && "in-view")}>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground leading-tight">
            Measure the Change
          </h2>
          <p className="font-sans font-normal text-xl leading-relaxed text-muted-foreground">
            Transparency is our core value. See the real-time difference our community curators are
            making worldwide.
          </p>
        </div>

        {/* Right Stats */}
        <div className="flex flex-col sm:flex-row gap-12 w-full lg:w-auto">
          <StatCard end={42890} label="KG Food Saved" inView={inView} delay={200} />
          <StatCard
            end={12.4}
            suffix="k"
            decimals={1}
            label="Active Donors"
            inView={inView}
            delay={400}
          />
        </div>
      </div>

      {/* Bottom Wave Divider (Transition to Background) */}
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
