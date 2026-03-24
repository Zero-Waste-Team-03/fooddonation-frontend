import { useState, useEffect, useRef } from "react";

const navLinks = [
  { label: "Mission", href: "#mission" },
  { label: "Features", href: "#features" },
  { label: "Impact", href: "#impact" },
  { label: "Download", href: "#download" },
];

export function Navbar() {
  const [activeHref, setActiveHref] = useState("");
  const [heroScrolled, setHeroScrolled] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [isFirstRender, setIsFirstRender] = useState(true);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      setHeroScrolled(window.scrollY > heroHeight * 0.6);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHref(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    navLinks.forEach((link) => {
      const el = document.querySelector(link.href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const index = navLinks.findIndex((l) => l.href === activeHref);
    if (index !== -1 && itemsRef.current[index]) {
      const el = itemsRef.current[index];
      if (el) {
        setIndicatorStyle({
          left: el.offsetLeft,
          width: el.offsetWidth,
          opacity: 1,
        });
      }
    } else if (activeHref === "" && isFirstRender && itemsRef.current[0]) {
      // Initialize under first item hidden if nothing active yet, to prevent jumping
      const el = itemsRef.current[0];
      if (el) {
        setIndicatorStyle({
          left: el.offsetLeft,
          width: el.offsetWidth,
          opacity: 0,
        });
      }
    }
  }, [activeHref, isFirstRender]);

  useEffect(() => {
    // Enable animations after a brief delay
    const timer = setTimeout(() => setIsFirstRender(false), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <nav
      style={{
        background: heroScrolled
          ? "color-mix(in srgb, var(--color-background), transparent 8%)"
          : "transparent",
        backdropFilter: heroScrolled ? "blur(16px)" : "none",
        borderBottom: `1px solid ${heroScrolled ? "var(--color-border)" : "transparent"}`,
        height: "80px",
        transition: "all 300ms ease",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-6 h-full flex items-center justify-between relative">
        <a
          href="#"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "24px",
            letterSpacing: "-0.03em",
            color: heroScrolled ? "var(--color-foreground)" : "var(--hero-text)",

            transition: "color 300ms ease",
            textDecoration: "none",
          }}
          aria-label="Gasp'Zero Home"
        >
          Gasp’Zero
        </a>

        <div className="hidden md:flex items-center gap-8 relative">
          {/* Active Indicator */}
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: "-4px",
              height: "2px",
              borderRadius: "999px",
              backgroundColor: "var(--color-primary)",
              left: 0,
              width: `${indicatorStyle.width}px`,
              transform: `translateX(${indicatorStyle.left}px)`,
              opacity: indicatorStyle.opacity,
              transition: isFirstRender
                ? "none"
                : "transform 300ms cubic-bezier(0.16, 1, 0.3, 1), width 300ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms ease",
              pointerEvents: "none",
            }}
          />

          {navLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              ref={(el) => {
                itemsRef.current[index] = el;
              }}
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color:
                  activeHref === link.href
                    ? "var(--color-primary)"
                    : heroScrolled
                      ? "var(--color-foreground)"
                      : "var(--hero-text)",
                opacity: activeHref === link.href ? 1 : heroScrolled ? 0.7 : 0.9,
                transition: "color 200ms ease, opacity 200ms ease",
                textDecoration: "none",
                padding: "8px 0",
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
