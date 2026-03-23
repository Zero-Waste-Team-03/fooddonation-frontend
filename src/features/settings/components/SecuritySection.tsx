import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, KeyRound, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { SecuritySettings } from "@/types/settings.types";

const securitySchema = z.object({
  passwordHint: z.string().min(1, "Password metadata is required"),
});

type SecurityFormValues = z.infer<typeof securitySchema>;

type SecuritySectionProps = {
  initialValues: SecuritySettings;
  onSubmit: (data: SecurityFormValues) => Promise<void>;
};

export function SecuritySection({ initialValues, onSubmit }: SecuritySectionProps) {
  const form = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: initialValues,
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
    console.log("Security section", data);
  });

  return (
    <section className="rounded-[20px] border border-border bg-card p-6 shadow-card">
      <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
        <Shield className="size-4 text-primary" />
        <span>Security</span>
      </h2>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <FormField
            control={form.control}
            name="passwordHint"
            render={({ field }) => (
              <FormItem className="rounded-xl bg-muted/50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-card">
                      <KeyRound className="size-4 text-primary" />
                    </span>
                    <div>
                      <FormLabel htmlFor="settings-password-hint" className="text-sm text-foreground">
                        Change Password
                      </FormLabel>
                      <p id="settings-password-hint" className="text-xs text-muted-foreground">
                        {field.value}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </section>
  );
}
