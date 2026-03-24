import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CTASection() {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.2 });

  return (
    <section ref={ref} id="download" className="w-full py-24 px-6">
      <div className="container mx-auto">
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-[48px] bg-primary/5 border border-primary/10 flex flex-col items-center text-center gap-10 py-20 px-6 reveal",
            inView && "in-view"
          )}
        >
          {/* Organic Blob Background */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-warning/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-6 max-w-[700px]">
            <h2 className="font-display font-bold text-5xl md:text-6xl leading-[1.1] text-foreground">
              Your table is set.
              <br />
              <span className="text-primary">Will you share?</span>
            </h2>
            <p className="font-sans font-normal text-xl leading-relaxed text-muted-foreground max-w-[620px]">
              Start your journey as a Mindful Curator today. Registration is free, impact is
              priceless.
            </p>
          </div>

          <div className="relative z-10 mt-4">
            <Button
              className="h-[60px] px-10 rounded-xl bg-primary hover:bg-primary-hover text-white font-sans font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
              size="lg"
            >
              Create Your Profile
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
