import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="w-full relative bg-foreground text-background pt-32 pb-10 flex flex-col gap-12 mt-24">
      {/* Wave Divider */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none z-10 -translate-y-[99%]">
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-16 md:h-24 fill-foreground"
        >
          <path d="M0,80 C360,80 1080,0 1440,0 L1440,80 L0,80 Z" />
        </svg>
      </div>

      {/* Top Section */}
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        <div className="flex flex-col gap-4">
          <span className="font-display font-bold text-3xl text-primary">Gasp’Zero</span>
          <p className="font-sans text-sm leading-relaxed text-background/60 max-w-[300px]">
            An Organic Editorial Initiative focused on radical generosity and food sustainability.
          </p>
        </div>

        <div className="flex flex-row gap-4">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download on Google Play"
            className="hover:opacity-80 transition-opacity"
          >
            <img
              src="/badges/google-play.svg"
              alt="Get it on Google Play"
              className="h-10 w-auto"
            />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download on the App Store"
            className="hover:opacity-80 transition-opacity"
          >
            <img
              src="/badges/app-store.svg"
              alt="Download on the App Store"
              className="h-10 w-auto"
            />
          </a>
        </div>
      </div>

      {/* Links Section */}
      <div className="flex flex-wrap justify-center gap-8 px-6 border-t border-background/10 pt-10 mx-6 md:mx-auto w-full max-w-[1280px]">
        <Link
          to="/"
          className="font-sans text-sm text-background/60 hover:text-background transition-colors"
        >
          Privacy Policy
        </Link>
        <Link
          to="/"
          className="font-sans text-sm text-background/60 hover:text-background transition-colors"
        >
          Terms of Service
        </Link>
        <Link
          to="/"
          className="font-sans text-sm text-background/60 hover:text-background transition-colors"
        >
          Donor Guidelines
        </Link>
        <Link
          to="/dashboard"
          className="font-sans text-sm text-background/60 hover:text-background transition-colors"
        >
          Admin Portal
        </Link>
      </div>

      {/* Copyright Section */}
      <div className="w-full text-center px-6">
        <p className="font-sans text-sm text-background/40">
          © 2026 Gasp’Zero. An Organic Editorial Initiative.
        </p>
      </div>
    </footer>
  );
}
