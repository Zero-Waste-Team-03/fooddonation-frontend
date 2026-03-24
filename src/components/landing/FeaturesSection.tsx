import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";
import { Check, ShoppingBasket, MapPin } from "lucide-react";
import avatar1 from "@/assets/landing/avatar-1.png";
import avatar2 from "@/assets/landing/avatar-2.png";
import avatar3 from "@/assets/landing/avatar-3.png";

export function FeaturesSection() {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.1 });

  return (
    <section ref={ref} id="features" className="w-full bg-background py-24 relative">
      <div className="container mx-auto px-6 flex flex-col gap-16">
        {/* Section Header */}
        <div className={cn("flex flex-col gap-2 reveal", inView && "in-view")}>
          <span className="font-sans font-bold text-xs uppercase tracking-[0.1em] text-primary">
            Curated Experience
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl leading-[1.1] text-foreground">
            The Curator's Toolkit
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Large Card (Top Left) */}
          <div
            className={cn(
              "lg:col-span-2 relative flex flex-col justify-between p-10 bg-card rounded-[32px] shadow-card border-l-4 border-l-primary/20 overflow-hidden min-h-[400px] reveal",
              inView && "in-view"
            )}
            style={{ transitionDelay: "100ms" }}
          >
            <div>
              <div className="w-14 h-14 flex items-center justify-center bg-primary/10 text-primary rounded-2xl mb-5">
                <ShoppingBasket className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-[30px] leading-[1.2] text-card-foreground mb-4">
                Donate Easily
              </h3>
              <p className="font-sans font-normal text-lg text-muted-foreground max-w-[450px]">
                Upload your surplus items in seconds. Our smart-tagging system alerts neighbors
                looking for exactly what you have.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
              {["Smart Notifications", "Batch Upload", "Auto-Expiration"].map((tag) => (
                <div key={tag} className="px-4 py-2 bg-muted rounded-full">
                  <span className="font-sans font-medium text-sm text-foreground">{tag}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tall Card (Top Right) - Orange */}
          <div
            className={cn(
              "lg:col-span-1 flex flex-col justify-between p-10 bg-warning rounded-[32px] min-h-[400px] reveal",
              inView && "in-view"
            )}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="flex flex-col gap-4">
              <div className="w-10 h-10 text-warning-foreground">
                <MapPin className="w-full h-full" />
              </div>
              <h3 className="font-display font-bold text-2xl text-warning-foreground">
                Find Local Food
              </h3>
              <p className="font-sans font-normal text-lg leading-[1.625] text-warning-foreground opacity-90">
                Browse a live feed of fresh, quality surplus items within 2km of your location.
              </p>
            </div>

            <div className="flex flex-col gap-4 pt-8 border-t border-warning-foreground/10">
              <div className="flex items-center -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-warning bg-card overflow-hidden">
                  <img src={avatar1} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-warning bg-card overflow-hidden">
                  <img src={avatar2} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-warning bg-card overflow-hidden">
                  <img src={avatar3} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-warning bg-input flex items-center justify-center">
                  <span className="font-sans font-bold text-xs text-foreground">+12</span>
                </div>
              </div>
              <span className="font-sans font-semibold text-sm text-warning-foreground">
                Active in your area
              </span>
            </div>
          </div>

          {/* Bottom Horizontal Card */}
          <div
            className={cn(
              "lg:col-span-3 flex flex-col md:flex-row items-center gap-10 p-10 bg-muted rounded-[32px] border border-border reveal",
              inView && "in-view"
            )}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="flex flex-col gap-4 flex-1">
              <h3 className="font-display font-bold text-2xl text-foreground">Build Reputation</h3>
              <p className="font-sans font-normal text-lg leading-[1.625] text-muted-foreground max-w-[500px]">
                Every share earns you "Curator Points." Unlock badges that verify your commitment to
                sustainability and community trust.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {[
                { label: "Verified", icon: true },
                { label: "Top Donor", icon: true },
                { label: "Pioneer", icon: true },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex flex-col items-center justify-center gap-2 bg-card rounded-2xl px-6 py-4 min-w-[120px] shadow-sm"
                >
                  <div className="text-primary">
                    <Check className="w-5 h-5" />
                  </div>
                  <span className="font-sans font-bold text-[10px] uppercase tracking-wider text-foreground">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
