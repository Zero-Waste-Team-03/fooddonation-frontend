import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { z } from "zod";

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/_auth/login")({
  validateSearch: loginSearchSchema,
  component: LoginPage,
});

function LoginPage() {
  return <LoginForm />;
}
