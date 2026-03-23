import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "../hooks/useLogin";
import { Route } from "@/routes/_auth/login";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type LoginFormProps = {
  showResetSuccess?: boolean;
};

export function LoginForm({ showResetSuccess = false }: LoginFormProps) {
  const { redirect } = Route.useSearch();
  const { handleLogin, loading, errorMessage } = useLogin(redirect);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await handleLogin({
      email: values.email,
      password: values.password,
    });
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
              {showResetSuccess ? (
                <p role="status" aria-live="polite" className="text-center text-sm text-success">
                  Your password has been reset. You can now log in.
                </p>
              ) : null}
              <h2 className="font-display text-2xl font-bold leading-[1.33] text-foreground">
                Welcome back
              </h2>
              <p className="text-sm leading-normal text-label">
                Please enter your administrative credentials.
              </p>
            </div>
            <div className="flex flex-col gap-6 pb-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="login-email">Admin Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={Boolean(form.formState.errors.email)}
                  {...form.register("email")}
                />
                {form.formState.errors.email ? (
                  <p className="text-sm text-destructive" role="alert">
                    {form.formState.errors.email.message}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  aria-invalid={Boolean(form.formState.errors.password)}
                  {...form.register("password")}
                />
                {form.formState.errors.password ? (
                  <p className="text-sm text-destructive" role="alert">
                    {form.formState.errors.password.message}
                  </p>
                ) : null}
                <Link
                  to="/forgot-password"
                  className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                >
                  Forgot password?
                </Link>
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
            {loading ? "Signing in..." : "Sign In to Dashboard"}
          </Button>
          <div className="flex flex-col gap-6 border-t border-sidebar-section-border pt-6">
            <p className="text-center text-xs leading-normal text-label">
              Protected by enterprise-grade security protocols.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <span className="size-2 rounded-full bg-success" aria-hidden />
                <span>Secure End-to-End Encryption</span>
              </div>
            </div>
            <Button
              type="button"
              variant="link"
              className="text-sm font-normal text-label"
            >
              Return to Public Site
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
