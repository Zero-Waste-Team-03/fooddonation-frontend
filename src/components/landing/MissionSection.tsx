import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";
import { Heart, Users, Leaf } from "lucide-react";

const STEPS = [
  {
    id: "01",
    title: "Our Mission",
    description:
      "We believe every meal has a home. By bridging the gap between surplus and need, we cultivate an ecosystem of radical generosity.",
    icon: Heart,
  },
  {
    id: "02",
    title: "Cultivating Local Impact",
    description:
      "Gasp'Zero is more than an app; it's a movement. We reduce food waste by 40% in participating neighborhoods by enabling instant, trustworthy food sharing. No complicated logistics, just neighbors feeding neighbors.",
    icon: Users,
  },
  {
    id: "03",
    title: "Carbon-Neutral",
    description: "Distribution network.",
    icon: Leaf,
  },
];

export function MissionSection() {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.15 });

  return (
    <section ref={ref} id="mission" className="relative w-full py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Desktop Journey (Horizontal Scroll) */}
        <div className="hidden md:flex overflow-x-auto snap-x snap-mandatory gap-0 pb-12 pt-4 -mx-6 px-6 [&::-webkit-scrollbar]:hidden scrollbar-none">
          {STEPS.map((step, index) => (
            <div
              key={step.id}
              className="relative min-w-[400px] lg:min-w-[500px] snap-start flex flex-col pr-16 group"
            >
              {/* Connector Line (except last item) */}
              {index !== STEPS.length - 1 && (
                <div className="absolute top-[60px] left-[80px] right-0 h-[2px] overflow-hidden pointer-events-none">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 2">
                    <line
                      x1="0"
                      y1="1"
                      x2="100"
                      y2="1"
                      stroke="var(--color-primary)"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      className={cn(
                        "transition-all duration-1000 ease-out",
                        inView ? "opacity-40" : "opacity-0"
                      )}
                      style={{
                        strokeDashoffset: inView ? 0 : 100,
                        transitionDelay: `${index * 300 + 500}ms`,
                      }}
                    />
                  </svg>
                </div>
              )}

              {/* Number */}
              <div
                className={cn(
                  "font-display font-black text-[120px] leading-none text-transparent select-none transition-all duration-700",
                  inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                )}
                style={{
                  WebkitTextStroke: "2px color-mix(in srgb, var(--color-primary), transparent 90%)",
                  transitionDelay: `${index * 200}ms`,
                }}
              >
                {step.id}
              </div>

              {/* Content Container - Overlapping Number */}
              <div
                className={cn(
                  "relative -mt-16 pl-4 flex flex-col gap-6 transition-all duration-700",
                  inView ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                )}
                style={{ transitionDelay: `${index * 200 + 100}ms` }}
              >
                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <step.icon className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="font-display font-bold text-[28px] text-foreground mb-4">
                    {step.title}
                  </h3>
                  <p className="font-sans text-lg text-muted-foreground leading-relaxed max-w-[360px]">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Spacer for right padding in scroll container */}
          <div className="min-w-[100px] snap-start" />
        </div>

        {/* Mobile Timeline (Vertical) */}
        <div className="md:hidden relative flex flex-col gap-12 pl-6">
          {/* Timeline Line */}
          <div
            className={cn(
              "absolute left-[3px] top-4 bottom-0 w-[3px] bg-primary/20 rounded-full origin-top transition-transform duration-1000",
              inView ? "scale-y-100" : "scale-y-0"
            )}
          />

          {STEPS.map((step, index) => (
            <div
              key={step.id}
              className={cn("relative flex flex-col gap-4 anim-fade-right", inView && "visible")}
              style={{
                animationDelay: `${index * 200}ms`,
              }}
            >
              {/* Timeline Dot */}
              <div className="absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-background" />

              <div className="flex items-center gap-3">
                <span className="font-display font-bold text-4xl text-primary/20">{step.id}</span>
                <h3 className="font-display font-bold text-2xl text-foreground">{step.title}</h3>
              </div>

              <p className="font-sans text-lg text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
