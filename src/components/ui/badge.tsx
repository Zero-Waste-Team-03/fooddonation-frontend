import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border border-transparent px-2 py-1 text-xs font-semibold leading-none",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary dark:bg-primary/25 dark:text-primary-foreground",
        secondary: "bg-muted text-muted-foreground dark:bg-muted/80 dark:text-foreground",
        success: "bg-success/10 text-success dark:bg-success/25 dark:text-success",
        warning: "bg-warning/10 text-warning dark:bg-warning/25 dark:text-warning",
        destructive: "bg-destructive/10 text-destructive dark:bg-destructive/25 dark:text-destructive",
        info: "bg-info/10 text-info dark:bg-info/25 dark:text-info",
        outline: "border-border text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
