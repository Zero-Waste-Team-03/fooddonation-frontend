import { Link } from "@tanstack/react-router";
import { GetFromStore } from "./GetFromStore";

export function Footer() {
  return (
    <footer className="w-full bg-muted pt-20 pb-10 flex flex-col gap-12">
      {/* Top Section */}
      <div className="w-full max-w-[1280px] mx-auto px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-10 border-t border-border pt-10">
        <div className="flex flex-col gap-2">
          <span className="font-display font-extrabold text-[30px] tracking-[-0.025em] text-primary">
            Gasp’Zero
          </span>
          <p className="font-sans font-normal text-sm leading-[1.625] tracking-[0.025em] text-muted-foreground max-w-[300px]">
            An Organic Editorial Initiative focused on radical generosity and food sustainability.
          </p>
        </div>

        <GetFromStore />
      </div>

      {/* Links Section */}
      <div className="flex flex-wrap justify-center gap-8 px-6">
        <Link
          to="/"
          className="font-sans font-normal text-sm tracking-[0.025em] text-muted-foreground hover:text-foreground transition-colors"
        >
          Privacy Policy
        </Link>
        <Link
          to="/"
          className="font-sans font-normal text-sm tracking-[0.025em] text-muted-foreground hover:text-foreground transition-colors"
        >
          Terms of Service
        </Link>
        <Link
          to="/"
          className="font-sans font-normal text-sm tracking-[0.025em] text-muted-foreground hover:text-foreground transition-colors"
        >
          Donor Guidelines
        </Link>
        <Link
          to="/dashboard"
          className="font-sans font-normal text-sm tracking-[0.025em] text-muted-foreground hover:text-foreground transition-colors"
        >
          Admin Portal
        </Link>
      </div>

      {/* Copyright Section */}
      <div className="w-full text-center px-6">
        <p className="font-sans font-normal text-sm tracking-[0.025em] text-muted-foreground">
          © 2026 Gasp’Zero. An Organic Editorial Initiative.
        </p>
      </div>
    </footer>
  );
}
