export function ImpactSection() {
  return (
    <section className="w-full bg-primary-hover py-24 relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-16">
        {/* Left Content */}
        <div className="flex flex-col gap-8 max-w-[600px] z-10">
          <h2 className="font-display font-extrabold text-[48px] text-primary-foreground leading-none">
            Measure the Change
          </h2>
          <p className="font-sans font-normal text-[20px] leading-[1.625] text-primary-foreground">
            Transparency is our core value. See the real-time difference our community curators are
            making worldwide.
          </p>
        </div>

        {/* Right Stats */}
        <div className="flex flex-col sm:flex-row gap-8 w-full lg:w-auto z-10">
          <div className="flex flex-col gap-2 pl-8 border-l border-primary-foreground">
            <span className="font-display font-extrabold text-[48px] text-primary-foreground leading-none">
              42,890
            </span>
            <span className="font-sans font-bold text-xs uppercase tracking-[0.1em] text-primary-foreground">
              KG Food Saved
            </span>
          </div>

          <div className="flex flex-col gap-2 pl-8 border-l border-primary-foreground">
            <span className="font-display font-extrabold text-[48px] text-primary-foreground leading-none">
              12.4k
            </span>
            <span className="font-sans font-bold text-xs uppercase tracking-[0.1em] text-primary-foreground">
              Active Donors
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
