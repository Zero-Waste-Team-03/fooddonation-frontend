import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { MissionSection } from "@/components/landing/MissionSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { ImpactSection } from "@/components/landing/ImpactSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center w-full landing-page-theme">
      <Header />
      <HeroSection />
      <MissionSection />
      <FeaturesSection />
      <ImpactSection />
      <CTASection />
      <Footer />
    </main>
  );
}
