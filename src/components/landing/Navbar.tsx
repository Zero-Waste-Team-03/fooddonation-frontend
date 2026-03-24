import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Mission", href: "#mission" },
  { label: "Features", href: "#features" },
  { label: "Impact", href: "#impact" },
  { label: "Download", href: "#download" },
];

export function Navbar() {
  const [activeHref, setActiveHref] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const sections = navLinks.map((l) => document.querySelector(l.href));
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
    sections.forEach((s) => s && observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300",
        "bg-background/85 backdrop-blur-md",
        scrolled ? "border-b border-border" : "border-b border-transparent"
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        <a
          href="#"
          className="font-display font-bold text-xl text-primary tracking-tight"
          aria-label="Gasp'Zero Home"
        >
          Gasp’Zero
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "relative text-sm font-medium transition-colors duration-200",
                activeHref === link.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
              <span
                className={cn(
                  "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-200",
                  activeHref === link.href ? "w-full" : "w-0"
                )}
              />
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
