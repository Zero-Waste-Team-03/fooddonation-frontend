import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForgotPassword } from "../hooks/useForgotPassword";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const { handleForgotPassword, loading, errorMessage, success } = useForgotPassword();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await handleForgotPassword(values.email);
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

        <div className="relative flex flex-col gap-8 rounded-(--radius-login-card) border border-login-card-border bg-card p-10 pt-10 pb-6 shadow-login">
          {success ? (
            <div className="flex flex-col gap-6">
              <h2 className="font-display text-2xl font-bold leading-[1.33] text-foreground">
                Check your email
              </h2>
              <p className="text-sm leading-normal text-label">
                If an account exists for that email, you will receive a password reset link shortly.
                Check your spam folder if you do not see it.
              </p>
              <Link
                to="/login"
                search={{ redirect: "/dashboard" }}
                className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <h2 className="font-display text-2xl font-bold leading-[1.33] text-foreground">
                    Forgot password
                  </h2>
                  <p className="text-sm leading-normal text-label">
                    Enter your email to request a password reset link.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="forgot-email">Admin Email</Label>
                  <Input
                    id="forgot-email"
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

                {errorMessage ? (
                  <p className="text-sm text-destructive" role="alert" aria-live="polite">
                    {errorMessage}
                  </p>
                ) : null}
              </div>

              <Button
                type="submit"
                className="h-12 w-full rounded-(--radius-login-card) text-base font-semibold"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send reset link"}
              </Button>

              <Link
                to="/login"
                search={{ redirect: "/dashboard" }}
                className="text-center text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
              >
                Back to login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
