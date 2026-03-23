import { zodResolver } from "@hookform/resolvers/zod";
import { Bell } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import type { NotificationSettings } from "@/types/settings.types";

const notificationsSchema = z.object({
  newDonations: z.boolean(),
  urgentAlerts: z.boolean(),
  systemReports: z.boolean(),
});

type NotificationsFormValues = z.infer<typeof notificationsSchema>;

type NotificationsSectionProps = {
  initialValues: NotificationSettings;
  onSubmit: (data: NotificationsFormValues) => Promise<void>;
};

export function NotificationsSection({ initialValues, onSubmit }: NotificationsSectionProps) {
  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: initialValues,
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
    console.log("Notifications section", data);
  });

  return (
    <section className="rounded-[20px] bg-card p-6 shadow-card">
      <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
        <Bell className="size-4 text-primary" />
        <span>Notifications</span>
      </h2>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            control={form.control}
            name="newDonations"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div>
                  <FormLabel htmlFor="settings-new-donations" className="text-sm font-semibold text-foreground">
                    New Donations
                  </FormLabel>
                  <p className="text-[11px] text-muted-foreground">Email &amp; Push</p>
                </div>
                <FormControl>
                  <Switch id="settings-new-donations" checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="urgentAlerts"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div>
                  <FormLabel htmlFor="settings-urgent-alerts" className="text-sm font-semibold text-warning">
                    Urgent Alerts
                  </FormLabel>
                  <p className="text-[11px] text-muted-foreground">SMS notification</p>
                </div>
                <FormControl>
                  <Switch id="settings-urgent-alerts" checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="systemReports"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between opacity-60">
                <div>
                  <FormLabel htmlFor="settings-system-reports" className="text-sm font-semibold text-foreground">
                    System Reports
                  </FormLabel>
                  <p className="text-[11px] text-muted-foreground">Weekly digest</p>
                </div>
                <FormControl>
                  <Switch id="settings-system-reports" checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

        </form>
      </Form>
    </section>
  );
}
