import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { LoginForm } from "@/features/auth/components/LoginForm";

const loginSearchSchema = z.object({
  reset: z.literal("success").optional(),
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/_auth/login")({
  validateSearch: loginSearchSchema,
  component: LoginPage,
});

function LoginPage() {
  const { reset } = Route.useSearch();
  return <LoginForm showResetSuccess={reset === "success"} />;
}
