import { useAtom } from "jotai";
import type { ReactNode } from "react";

import { sidebarCollapsedAtom } from "@/store/atoms";
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
        <main className="flex-1 overflow-x-hidden overflow-y-auto px-(--page-padding-x) py-(--page-padding-y)">
          {children}
        </main>
      </div>
    </div>
  );
}
