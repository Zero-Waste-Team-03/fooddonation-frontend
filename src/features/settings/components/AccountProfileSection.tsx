import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { AccountProfileSettings } from "@/types/settings.types";

const accountProfileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
});

type AccountProfileFormValues = z.infer<typeof accountProfileSchema>;

type AccountProfileSectionProps = {
  initialValues: AccountProfileSettings;
  onSubmit: (data: AccountProfileFormValues) => Promise<void>;
};

export function AccountProfileSection({ initialValues, onSubmit }: AccountProfileSectionProps) {
  const form = useForm<AccountProfileFormValues>({
    resolver: zodResolver(accountProfileSchema),
    defaultValues: initialValues,
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
    console.log("Account Profile section", data);
  });

  return (
    <section className="rounded-[20px] bg-card p-6 shadow-card">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
          <UserRound className="size-4 text-primary" />
          <span>Account Profile</span>
        </h2>
        <Button type="button" variant="ghost" className="h-8 rounded-xl px-3 text-xs font-semibold text-primary">
          Edit Info
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-[90px_minmax(0,1fr)] gap-4">
            <div className="space-y-1">
              <div className="relative flex size-[78px] items-end justify-end overflow-hidden rounded-[12px] bg-[#f3a786]">
                <UserRound className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 text-card" />
                <button
                  type="button"
                  className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full border border-card bg-primary text-primary-foreground"
                  aria-label="Update avatar"
                >
                  <Camera className="size-3" />
                </button>
              </div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Avatar (JPG, PNG)</p>
            </div>

            <div className="grid min-w-0 grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="settings-full-name" className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input id="settings-full-name" className="h-8 rounded-xl border-0 bg-input text-sm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="settings-email" className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input id="settings-email" type="email" className="h-8 rounded-xl border-0 bg-input text-sm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel htmlFor="settings-role" className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      Role
                    </FormLabel>
                    <FormControl>
                      <Input id="settings-role" readOnly className="h-8 rounded-xl border-0 bg-input text-sm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
}
