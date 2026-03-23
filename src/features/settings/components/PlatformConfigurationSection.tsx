import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Flag, Settings2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { PlatformConfigurationSettings } from "@/types/settings.types";

const platformConfigurationSchema = z.object({
  defaultDonationExpirationHours: z.string().min(1, "Expiration value is required"),
  communityCurrencyValue: z.enum(["IMPACT_POINTS", "GREEN_CREDITS"]),
  monthlyTargetKg: z.string().min(1, "Monthly target is required"),
  donationCountGoal: z.string().min(1, "Donation goal is required"),
  communityGuidelinesPreview: z.string().min(10, "Guidelines preview must be at least 10 characters"),
});

type PlatformConfigurationFormValues = z.infer<typeof platformConfigurationSchema>;

type PlatformConfigurationSectionProps = {
  initialValues: PlatformConfigurationSettings;
  onSubmit: (data: PlatformConfigurationFormValues) => Promise<void>;
};

export function PlatformConfigurationSection({
  initialValues,
  onSubmit,
}: PlatformConfigurationSectionProps) {
  const form = useForm<PlatformConfigurationFormValues>({
    resolver: zodResolver(platformConfigurationSchema),
    defaultValues: initialValues,
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
    console.log("Platform Configuration section", data);
  });

  return (
    <section className="rounded-[20px] bg-card p-6 shadow-card">
      <h2 className="mb-5 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
        <Settings2 className="size-4 text-primary" />
        <span>Platform Configuration</span>
      </h2>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="defaultDonationExpirationHours"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-1 flex items-center gap-2">
                    <FormLabel htmlFor="settings-default-expiration" className="text-xs font-semibold text-foreground">
                      Default Donation Expiration
                    </FormLabel>
                    <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      {field.value}
                    </span>
                  </div>
                  <div className="h-1.5 w-40 rounded-full bg-muted">
                    <div className="h-full w-2/3 rounded-full bg-success" />
                  </div>
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    System-wide default time before a listed item is marked as expired if not claimed.
                  </p>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="communityCurrencyValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="settings-community-currency" className="text-xs font-semibold text-foreground">
                    Community Currency Value
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="settings-community-currency" className="h-10 w-full rounded-xl border-0 bg-input px-4 text-sm">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IMPACT_POINTS">Impact Points (IP)</SelectItem>
                        <SelectItem value="GREEN_CREDITS">Green Credits</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="border-t border-border/70" />

          <div className="rounded-xl border border-border/70 bg-card p-4">
            <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Flag className="size-3.5 text-primary" />
              Community Impact Goal
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="monthlyTargetKg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="settings-monthly-target" className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      Monthly Target (Kg of Food)
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input id="settings-monthly-target" className="h-10 rounded-xl border-0 bg-input pr-10" {...field} />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold uppercase text-muted-foreground">KG</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="donationCountGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="settings-donation-goal" className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      Donation Count Goal
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input id="settings-donation-goal" className="h-10 rounded-xl border-0 bg-input pr-14" {...field} />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold uppercase text-muted-foreground">ITEMS</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <p className="mt-3 text-[11px] text-muted-foreground">
              These goals power the progress bars on the public landing page and community dashboard.
            </p>
          </div>

          <FormField
            control={form.control}
            name="communityGuidelinesPreview"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="settings-guidelines-preview" className="text-sm text-label">
                  Community Guidelines Preview
                </FormLabel>
                <FormControl>
                  <textarea
                    id="settings-guidelines-preview"
                    className="min-h-28 w-full rounded-xl border-0 bg-input px-4 py-3 text-sm text-foreground placeholder:text-placeholder focus-visible:outline-none"
                    {...field}
                  />
                </FormControl>
                <button type="button" className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                  <FileText className="size-3.5" />
                  Full Editor
                </button>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </section>
  );
}
