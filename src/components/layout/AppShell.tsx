import { useAtom } from "jotai";
import type { ReactNode } from "react";

import { sidebarCollapsedAtom } from "@/store";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed] = useAtom(sidebarCollapsedAtom);
  return (
    <div className="flex h-screen overflow-hidden bg-muted">
      <Sidebar />
      <div
        className="flex min-w-0 flex-1 flex-col overflow-hidden transition-[margin] duration-200"
        style={{
          marginLeft: collapsed
            ? "var(--sidebar-width-collapsed)"
            : "var(--sidebar-width)",
        }}
      >
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto px-[var(--page-padding-x)] py-[var(--page-padding-y)]">
          {children}
        </main>
      </div>
    </div>
  );
}
