import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResetPassword } from "../hooks/useResetPassword";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const { handleResetPassword, loading, errorMessage } = useResetPassword();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await handleResetPassword({ token, password: values.password });
  });

  return (
    <div className="flex min-h-screen flex-row flex-wrap items-center justify-center gap-0 bg-muted px-6 py-20">
      <div className="flex w-full max-w-md flex-col gap-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-card shadow-card">
            <span className="font-display text-2xl font-bold text-primary">G</span>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-3xl font-bold leading-none tracking-[-0.025em] text-primary-hover">
              Gasp&apos;Zero
            </h1>
            <p className="text-sm font-normal leading-normal tracking-[0.025em] text-label uppercase">
              Administrative Portal
            </p>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="relative flex flex-col gap-8 rounded-[var(--radius-login-card)] border border-login-card-border bg-card p-10 pt-10 pb-6 shadow-login"
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h2 className="font-display text-2xl font-bold leading-[1.33] text-foreground">
                Reset password
              </h2>
              <p className="text-sm leading-normal text-label">
                Enter your new password below.
              </p>
            </div>

            <div className="flex flex-col gap-6 pb-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="reset-password">New password</Label>
                <Input
                  id="reset-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  aria-invalid={Boolean(form.formState.errors.password)}
                  {...form.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="w-fit text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                >
                  {showPassword ? "Hide password" : "Show password"}
                </button>
                {form.formState.errors.password ? (
                  <p className="text-sm text-destructive" role="alert">
                    {form.formState.errors.password.message}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="reset-confirm-password">Confirm password</Label>
                <Input
                  id="reset-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  aria-invalid={Boolean(form.formState.errors.confirmPassword)}
                  {...form.register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="w-fit text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                >
                  {showConfirmPassword ? "Hide password" : "Show password"}
                </button>
                {form.formState.errors.confirmPassword ? (
                  <p className="text-sm text-destructive" role="alert">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                ) : null}
              </div>
            </div>

            {errorMessage ? (
              <p className="text-sm text-destructive" role="alert" aria-live="polite">
                {errorMessage}
              </p>
            ) : null}
          </div>

          <Button
            type="submit"
            className="h-12 w-full rounded-[var(--radius-login-card)] text-base font-semibold"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset password"}
          </Button>

          <Link
            to="/login"
            search={{ redirect: "/dashboard" }}
            className="text-center text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
          >
            Back to login
          </Link>
        </form>
      </div>
    </div>
  );
}
