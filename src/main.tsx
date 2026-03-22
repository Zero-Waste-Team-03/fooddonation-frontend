import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { Provider } from "jotai";
import { routeTree } from "./routeTree.gen";
import { AuthProvider, useAuthContext } from "@/providers/AuthProvider";
import { ApolloProvider } from "@/providers/ApolloProvider";
import "@fontsource-variable/inter";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import "@/index.css";
import "maplibre-gl/dist/maplibre-gl.css";

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuthContext();
  return <RouterProvider router={router} context={{ auth }} />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <ApolloProvider>
        <AuthProvider>
          <InnerApp />
        </AuthProvider>
      </ApolloProvider>
    </Provider>
  </StrictMode>
);
