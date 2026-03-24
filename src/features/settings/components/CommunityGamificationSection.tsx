import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { CommunityGamificationSettings } from "@/types/settings.types";

const communityGamificationSchema = z.object({
  automationMode: z.enum(["MANUAL", "AUTOMATIC"]),
  pointsThreshold: z.string().min(1, "Points threshold is required"),
  autoRevocationEnabled: z.boolean(),
});

type CommunityGamificationFormValues = z.infer<typeof communityGamificationSchema>;

type CommunityGamificationSectionProps = {
  initialValues: CommunityGamificationSettings;
  onSubmit: (data: CommunityGamificationFormValues) => Promise<void>;
};

export function CommunityGamificationSection({
  initialValues,
  onSubmit,
}: CommunityGamificationSectionProps) {
  const form = useForm<CommunityGamificationFormValues>({
    resolver: zodResolver(communityGamificationSchema),
    defaultValues: initialValues,
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
    console.log("Community & Gamification section", data);
  });

  return (
    <section className="rounded-[20px] border border-border bg-card p-6">
      <h2 className="mb-5 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
        <Sparkles className="size-4 text-primary" />
        <span>Community &amp; Gamification</span>
      </h2>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-[14px] border border-primary/20 bg-accent/25 p-4">
            <FormField
              control={form.control}
              name="automationMode"
              render={({ field }) => (
                <FormItem className="mb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <FormLabel className="text-sm font-semibold text-foreground">Food Saver Automation</FormLabel>
                      <p className="text-[11px] text-muted-foreground">Manage how users earn the 'Food Saver' trusted status.</p>
                    </div>
                    <FormControl>
                      <div className="inline-flex rounded-lg bg-muted p-1">
                        <Button
                          type="button"
                          variant="ghost"
                          className={
                            field.value === "MANUAL"
                              ? "h-7 rounded-md border border-border bg-card px-3 text-[11px] font-semibold text-foreground"
                              : "h-7 rounded-md px-3 text-[11px] font-semibold text-muted-foreground"
                          }
                          onClick={() => field.onChange("MANUAL")}
                        >
                          Manual
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className={
                            field.value === "AUTOMATIC"
                              ? "h-7 rounded-md bg-primary px-3 text-[11px] font-semibold text-primary-foreground"
                              : "h-7 rounded-md px-3 text-[11px] font-semibold text-muted-foreground"
                          }
                          onClick={() => field.onChange("AUTOMATIC")}
                        >
                          Automatic
                        </Button>
                      </div>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
              <FormField
                control={form.control}
                name="pointsThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="settings-food-saver-threshold" className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      Points Threshold for Food Saver Status
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input id="settings-food-saver-threshold" className="h-10 rounded-xl border border-primary/20 bg-card pr-9" {...field} />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold uppercase text-muted-foreground">IP</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="autoRevocationEnabled"
                render={({ field }) => (
                  <FormItem className="mb-1 flex flex-row items-center gap-2">
                    <FormControl>
                      <Switch
                        id="settings-auto-revocation"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel htmlFor="settings-auto-revocation" className="max-w-32 text-xs text-foreground">
                      Enable auto-revocation if points drop
                    </FormLabel>
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
