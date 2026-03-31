import { StrictMode } from "react";
import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { Provider as JotaiProvider, createStore, useAtomValue } from "jotai";
import { routeTree } from "./routeTree.gen";
import { AuthProvider, useAuthContext } from "@/providers/AuthProvider";
import { ApolloProvider } from "@/providers/ApolloProvider";
import { TokenValidator } from "@/providers/TokenValidator";
import { themeAtom } from "@/store/atoms/ui.atoms";
import "@fontsource-variable/inter";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import "@/index.css";
import "maplibre-gl/dist/maplibre-gl.css";

export const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
});

export const jotaiStore = createStore();

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuthContext();

  return <RouterProvider router={router} context={{ auth }} />;
}

function ThemeApplier() {
  const theme = useAtomValue(themeAtom);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");

    const resolvedTheme =
      theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme;

    root.classList.add(resolvedTheme);
    root.style.colorScheme = resolvedTheme;
  }, [theme]);

  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <JotaiProvider store={jotaiStore}>
      <ApolloProvider>
        <AuthProvider>
          <ThemeApplier />
          <TokenValidator>
            <InnerApp />
          </TokenValidator>
        </AuthProvider>
      </ApolloProvider>
    </JotaiProvider>
  </StrictMode>
);
