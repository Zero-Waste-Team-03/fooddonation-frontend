import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-md border border-border bg-input px-4 py-2.5 text-sm leading-[1.21] text-card-foreground outline-none transition-[color,box-shadow] placeholder:text-placeholder focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30",
        className
      )}
      {...props}
    />
  );
}

export { Input };
