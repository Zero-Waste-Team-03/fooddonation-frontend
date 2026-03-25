import { Button } from "@/components/ui/button";
import heroImage from "@/assets/landing/hero-image.png";
import { GetFromStore } from "./GetFromStore";

export function HeroSection() {
  return (
    <section className="relative w-full max-w-[1280px] mx-auto px-6 py-24 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 mt-[96px]">
      {/* Left Content */}
      <div className="flex flex-col items-start max-w-[650px] w-full z-10">
        <h1 className="font-display font-extrabold text-[72px] leading-[1] tracking-[-0.025em] text-foreground mb-6">
          Share Food,
          <br />
          Save the Planet
        </h1>

        <p className="font-sans text-[20px] leading-[1.4] text-label max-w-[580px] mb-8">
          Join Gasp'Zero, the digital journal for social good. Transform surplus into community
          strength with our curated local exchange platform.
        </p>

        <div className="flex flex-row items-center gap-4 mb-12">
          <Button
            className="h-[60px] px-8 rounded-xl bg-primary text-primary-foreground font-sans font-bold text-lg shadow-lg hover:bg-primary-hover transition-colors"
            size="lg"
          >
            Get the App
          </Button>
          <Button
            variant="ghost"
            className="h-[60px] px-8 rounded-xl text-primary font-sans font-semibold text-base hover:bg-accent"
          >
            View Local Map
          </Button>
        </div>

        <GetFromStore />
      </div>

      {/* Right Content / Image */}
      <div className="relative w-full max-w-[500px] lg:max-w-[450px] xl:max-w-[500px] flex justify-center lg:justify-end">
        {/* Asymmetric accent */}
        <div className="absolute -left-8 top-[350px] w-48 h-48 bg-accent rounded-3xl blur-[40px] z-0" />

        {/* Circular border decoration */}
        <div className="absolute right-[80px] -top-12 w-32 h-32 rounded-full border-2 border-border z-0" />

        {/* Main Image Container */}
        <div className="relative z-10 rounded-[32px] overflow-hidden shadow-card bg-secondary">
          <img src={heroImage} alt="App Interface" className="w-full h-auto object-cover" />
        </div>
      </div>
    </section>
  );
}
