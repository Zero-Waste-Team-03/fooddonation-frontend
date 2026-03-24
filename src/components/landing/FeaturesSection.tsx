import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";
import { ShoppingBasket, MapPin, Trophy } from "lucide-react";

const FEATURES = [
  {
    title: "Donate Easily",
    description:
      "Upload your surplus items in seconds. Our smart-tagging system alerts neighbors looking for exactly what you have.",
    icon: ShoppingBasket,
    span: "md:col-span-7",
    opacity: 1,
  },
  {
    title: "Find Local Food",
    description: "Browse a live feed of fresh, quality surplus items within 2km of your location.",
    icon: MapPin,
    span: "md:col-span-5",
    opacity: 0.6,
  },
  {
    title: "Build Reputation",
    description:
      'Every share earns you "Curator Points." Unlock badges that verify your commitment to sustainability and community trust.',
    icon: Trophy,
    span: "md:col-span-7",
    opacity: 0.4,
  },
];

export function FeaturesSection() {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.1 });

  return (
    <section ref={ref} id="features" className="w-full bg-background py-32 relative">
      <div className="container mx-auto px-6 flex flex-col gap-16">
        {/* Section Header */}
        <div
          className={cn(
            "flex flex-col gap-4 max-w-2xl",
            inView ? "anim-fade-up visible" : "anim-fade-up"
          )}
        >
          <span className="font-sans font-bold text-xs uppercase tracking-[0.15em] text-primary">
            Curated Experience
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl leading-[1.1] text-foreground">
            The Curator's Toolkit
          </h2>
        </div>

        {/* Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-min">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.title}
              className={cn(
                "group relative flex flex-col gap-6 p-8 bg-card rounded-[24px] shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow duration-300",
                feature.span,
                inView ? "anim-scale-in visible" : "anim-scale-in"
              )}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Top Colored Band */}
              <div
                className="absolute top-0 left-0 right-0 h-2 bg-primary"
                style={{ opacity: feature.opacity }}
              />

              <div className="flex flex-col gap-6 mt-2">
                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <feature.icon className="w-8 h-8" />
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="font-display text-[22px] leading-tight text-foreground">
                    {feature.title}
                  </h3>
                  <p className="font-sans text-base leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
