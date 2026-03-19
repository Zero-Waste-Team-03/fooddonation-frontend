import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { AuthProvider, useAuthContext } from "@/providers/AuthProvider";
import { ApolloProvider } from "@/providers/ApolloProvider";
import "@/index.css";

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
    <ApolloProvider>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </ApolloProvider>
  </StrictMode>
);
