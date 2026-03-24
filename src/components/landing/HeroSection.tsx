import { Button } from "@/components/ui/button";
import heroImage from "@/assets/landing/hero-image.png";
import appStoreIcon from "@/assets/landing/app-store-icon.svg";
import playStoreIcon from "@/assets/landing/play-store-icon.svg";

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
            className="h-[60px] px-8 rounded-xl bg-gradient-to-br from-primary-hover to-primary text-white font-sans font-bold text-lg shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)] hover:opacity-90 transition-opacity"
            size="lg"
          >
            Get the App
          </Button>
          <Button
            variant="ghost"
            className="h-[60px] px-8 rounded-xl text-primary-hover font-sans font-semibold text-base hover:bg-accent"
          >
            View Local Map
          </Button>
        </div>

        <div className="flex flex-row gap-4">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-foreground rounded-xl hover:bg-foreground/90 transition-colors">
            <img src={appStoreIcon} alt="App Store" className="w-6 h-6" />
            <div className="flex flex-col items-start">
              <span className="text-[10px] uppercase text-background opacity-70 leading-none mb-1">
                Download on the
              </span>
              <span className="font-display font-bold text-sm text-background leading-none">
                App Store
              </span>
            </div>
          </button>

          <button className="flex items-center gap-2 px-5 py-2.5 bg-foreground rounded-xl hover:bg-foreground/90 transition-colors">
            <img src={playStoreIcon} alt="Google Play" className="w-6 h-6" />
            <div className="flex flex-col items-start">
              <span className="text-[10px] uppercase text-background opacity-70 leading-none mb-1">
                Get it on
              </span>
              <span className="font-display font-bold text-sm text-background leading-none">
                Google Play
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Right Content / Image */}
      <div className="relative w-full max-w-[500px] lg:max-w-[450px] xl:max-w-[500px] flex justify-center lg:justify-end">
        {/* Asymmetric accent */}
        <div className="absolute -left-8 top-[350px] w-48 h-48 bg-[#FFDCC5] rounded-3xl opacity-40 blur-[40px] z-0" />

        {/* Circular border decoration */}
        <div className="absolute right-[80px] -top-12 w-32 h-32 rounded-full border-2 border-primary-hover/10 z-0" />

        {/* Main Image Container */}
        <div className="relative z-10 rounded-[32px] overflow-hidden shadow-[0px_32px_64px_-12px_rgba(25,28,28,0.06)] bg-secondary">
          <img src={heroImage} alt="App Interface" className="w-full h-auto object-cover" />
        </div>
      </div>
    </section>
  );
}
