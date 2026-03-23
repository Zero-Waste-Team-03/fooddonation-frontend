import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginForm } from "@/features/auth/components/LoginForm";


export const Route = createFileRoute("/login")({
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || '/',
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect })
    }
  },
  component: LoginPage,
});

function LoginPage() {
  return <LoginForm />;
}
