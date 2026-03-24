import { Button } from "@/components/ui/button";
import ctaPattern from "@/assets/landing/cta-pattern.png";

export function CTASection() {
  return (
    <section className="w-full max-w-[1232px] mx-auto px-6 py-24 my-24 relative overflow-hidden rounded-[48px] bg-warning/20 flex flex-col items-center text-center gap-8">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url(${ctaPattern})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 max-w-[672px]">
        <h2 className="font-display font-extrabold text-[60px] leading-[1] text-warning-foreground">
          Your table is set.
          <br />
          Will you share?
        </h2>
        <p className="font-sans font-normal text-[20px] leading-[1.4] text-warning-foreground/80 max-w-[620px]">
          Start your journey as a Mindful Curator today. Registration is free, impact is priceless.
        </p>
      </div>

      <div className="relative z-10 mt-4">
        <Button
          className="h-auto py-5 px-10 rounded-full bg-gradient-to-br from-primary-hover to-primary text-primary-foreground font-display font-bold text-[20px] shadow-[0px_8px_10px_-6px_rgba(0,0,0,0.1),0px_20px_25px_-5px_rgba(0,0,0,0.1)] hover:opacity-95 transition-opacity"
          size="lg"
        >
          Create Your Profile
        </Button>
      </div>
    </section>
  );
}
