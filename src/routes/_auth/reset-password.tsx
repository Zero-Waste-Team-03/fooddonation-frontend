import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

const resetPasswordSearchSchema = z.object({
  token: z.string().min(1),
});

export const Route = createFileRoute("/_auth/reset-password")({
  validateSearch: (search) => {
    const parsed = resetPasswordSearchSchema.safeParse(search);
    if (!parsed.success) {
      throw redirect({ to: "/forgot-password", search: { redirect: "/dashboard" } });
    }
    return parsed.data;
  },
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { token } = Route.useSearch();
  return <ResetPasswordForm token={token} />;
}
