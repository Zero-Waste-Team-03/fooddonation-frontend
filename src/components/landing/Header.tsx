import { Button } from "@/components/ui/button";
import { themeAtom } from "@/store";
import { Link } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { MoonStar, Sun } from "lucide-react";

export function Header() {
  const [theme, setTheme] = useAtom(themeAtom);

  const handleToggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-header-surface backdrop-blur-xl border-b border-[var(--color-header-border)] h-header">
      <div className="flex items-center gap-2">
        <span className="font-sans text-[30px] font-extrabold tracking-tighter text-primary leading-tight">
          Gasp’Zero
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-8">
        <Link
          to="/"
          className="font-display text-base font-semibold text-primary border-b-2 border-primary pb-1"
        >
          Our Mission
        </Link>
        <Link
          to="/"
          className="font-display text-base font-normal text-primary/70 hover:text-primary transition-colors"
        >
          How it Works
        </Link>
        <Link
          to="/"
          className="font-display text-base font-normal text-primary/70 hover:text-primary transition-colors"
        >
          Impact
        </Link>
        <Link
          to="/"
          className="font-display text-base font-normal text-primary/70 hover:text-primary transition-colors"
        >
          Support
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-10 rounded-md"
          aria-label="Toggle theme"
          onClick={handleToggleTheme}
        >
          {theme === "dark" ? (
            <Sun className="size-5" aria-hidden />
          ) : (
            <MoonStar className="size-5" aria-hidden />
          )}
        </Button>
        <Button className="rounded-xl bg-primary hover:bg-primary-hover text-white font-display font-semibold px-6 h-10 shadow-none">
          Get the App
        </Button>
      </div>
    </header>
  );
}
