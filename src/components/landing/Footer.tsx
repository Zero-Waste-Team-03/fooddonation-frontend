import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer
      className="relative pt-32 pb-12 mt-24 w-full"
      style={{ backgroundColor: "var(--hero-bg)", color: "var(--hero-text)" }}
    >
      {/* Wave Divider */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none z-10 -translate-y-[98%] pointer-events-none">
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-16 md:h-24"
          style={{ fill: "var(--hero-bg)" }}
        >
          <path d="M0,80 C360,80 1080,0 1440,0 L1440,80 L0,80 Z" />
        </svg>
      </div>

      <div className="container mx-auto px-6 flex flex-col gap-16 relative z-10">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div className="flex flex-col gap-4">
            <span
              className="font-bold text-3xl tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Gasp’Zero
            </span>
            <p
              className="text-sm leading-relaxed max-w-[300px]"
              style={{ color: "var(--hero-text-muted)" }}
            >
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
        <div
          className="flex flex-wrap justify-center gap-8 pt-10 border-t"
          style={{ borderColor: "rgba(240, 247, 236, 0.1)" }}
        >
          <Link
            to="/"
            className="text-sm transition-colors hover:text-white"
            style={{ color: "var(--hero-text-muted)" }}
          >
            Privacy Policy
          </Link>
          <Link
            to="/"
            className="text-sm transition-colors hover:text-white"
            style={{ color: "var(--hero-text-muted)" }}
          >
            Terms of Service
          </Link>
          <Link
            to="/"
            className="text-sm transition-colors hover:text-white"
            style={{ color: "var(--hero-text-muted)" }}
          >
            Donor Guidelines
          </Link>
          <Link
            to="/dashboard"
            className="text-sm transition-colors hover:text-white"
            style={{ color: "var(--hero-text-muted)" }}
          >
            Admin Portal
          </Link>
        </div>

        {/* Copyright Section */}
        <div className="w-full text-center">
          <p className="text-sm" style={{ color: "rgba(240, 247, 236, 0.4)" }}>
            © 2026 Gasp’Zero. An Organic Editorial Initiative.
          </p>
        </div>
      </div>
    </footer>
  );
}
