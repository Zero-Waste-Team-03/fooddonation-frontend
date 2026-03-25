import missionImage from "@/assets/landing/mission-image.png";
import missionIcon from "@/assets/landing/mission-icon.svg";

export function MissionSection() {
  return (
    <section className="w-full bg-secondary py-24">
      <div className="max-w-[1280px] mx-auto px-6 flex flex-col gap-20">
        {/* Top Content - Right Aligned */}
        <div className="flex flex-col items-end gap-6 w-full max-w-[768px] ml-auto">
          <h2 className="font-display font-bold text-4xl text-primary tracking-[-0.025em] text-right">
            Our Mission
          </h2>
          <p className="font-display font-normal text-[30px] leading-[1.2] text-foreground text-right">
            "We believe every meal has a home. By bridging the gap between surplus and need, we
            cultivate an ecosystem of radical generosity."
          </p>
          <div className="w-24 h-1 bg-primary rounded-full" />
        </div>

        {/* Bottom Content - 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Column - Image */}
          <div className="relative rounded-xl overflow-hidden shadow-card bg-card aspect-video w-full">
            <img
              src={missionImage}
              alt="Community food sharing"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Column - Content */}
          <div className="flex flex-col gap-6">
            <h3 className="font-display font-bold text-xl text-foreground">
              Cultivating Local Impact
            </h3>
            <p className="font-sans font-normal text-lg leading-[1.625] text-label">
              Gasp'Zero is more than an app; it's a movement. We reduce food waste by 40% in
              participating neighborhoods by enabling instant, trustworthy food sharing. No
              complicated logistics, just neighbors feeding neighbors.
            </p>

            <div className="flex items-center gap-4 mt-2">
              <img src={missionIcon} alt="" className="w-[48px] h-[48px]" />
              <span className="font-sans font-medium text-base text-primary">
                Carbon-neutral distribution network
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
