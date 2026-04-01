import type { ReactNode } from "react";

export type PageWrapperProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function PageWrapper({
  title,
  description,
  actions,
  children,
}: PageWrapperProps) {
  return (
    <div className="flex flex-col gap-8 overflow-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="font-display text-2xl font-bold leading-[1.33] text-page-title">
            {title}
          </h1>
          {description ? (
            <p className="max-w-2xl text-sm leading-normal text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
        ) : null}
      </div>
      {children}
    </div>
  );
}
