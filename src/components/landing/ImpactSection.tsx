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
    <div className="flex flex-col gap-6 relative min-w-[200px]">
      {/* Animated Horizontal Rule */}
      <div
        className={cn(
          "h-[2px] bg-primary transition-all duration-1000 ease-out origin-left opacity-30",
          inView ? "w-full scale-x-100" : "w-0 scale-x-0"
        )}
        style={{ transitionDelay: `${delay}ms` }}
      />

      <div
        className={cn(
          "flex flex-col gap-2 transition-all duration-700",
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
        style={{ transitionDelay: `${delay + 200}ms` }}
      >
        <span
          className="leading-none tabular-nums tracking-tighter"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "clamp(64px, 10vw, 120px)",
            color: "var(--color-primary)",
          }}
        >
          {count}
        </span>
        <span
          className="text-sm font-bold uppercase tracking-widest"
          style={{ color: "var(--hero-text-muted)" }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

export function ImpactSection() {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      id="impact"
      className="relative w-full py-32 mt-24 z-10"
      style={{ backgroundColor: "var(--hero-bg)" }}
    >
      {/* Top Wave Divider (Overlaps previous section) */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none z-10 -translate-y-[98%] pointer-events-none">
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-16 md:h-24"
          style={{ fill: "var(--hero-bg)" }}
        >
          <path d="M0,80 C360,80 1080,0 1440,0 L1440,80 L0,80 Z" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-20">
          {/* Text Content */}
          <div className="flex flex-col gap-8 max-w-[500px]">
            <h2
              className={cn(
                "leading-[0.95] transition-all duration-700",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "clamp(40px, 5vw, 72px)",
                color: "var(--hero-text)",
              }}
            >
              Measure the Change
            </h2>
            <p
              className={cn(
                "text-xl leading-relaxed transition-all duration-700 delay-100",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ color: "var(--hero-text-muted)" }}
            >
              Transparency is our core value. See the real-time difference our community curators
              are making worldwide.
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row gap-16 lg:gap-32 w-full lg:w-auto">
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
      </div>

      {/* Bottom Wave Divider (Overlaps next section) */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none z-10 translate-y-[98%] pointer-events-none">
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-16 md:h-24"
          style={{ fill: "var(--hero-bg)" }}
        >
          <path d="M0,0 C360,0 1080,80 1440,80 L1440,0 L0,0 Z" />
        </svg>
      </div>
    </section>
  );
}
