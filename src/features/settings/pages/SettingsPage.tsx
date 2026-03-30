import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { changePasswordDialogOpenAtom, themeAtom, type Theme } from "@/store";
import { ChangePasswordDialog } from "../components/ChangePasswordDialog";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import type { UpdateProfileFormValues } from "@/types/user.types";

const appearanceValues = ["DARK", "LIGHT", "SYSTEM"] as const;

const appearanceLabels: Record<(typeof appearanceValues)[number], string> = {
  DARK: "Dark",
  LIGHT: "Light",
  SYSTEM: "System default",
};

const profileSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

const locationSchema = z.object({
  city: z.string().optional(),
  country: z.string().optional(),
  neighborhood: z.string().optional(),
  latitude: z
    .string()
    .optional()
    .refine((value) => !value || !Number.isNaN(Number(value)), "Latitude must be a valid number"),
  longitude: z
    .string()
    .optional()
    .refine((value) => !value || !Number.isNaN(Number(value)), "Longitude must be a valid number"),
});

const preferencesSchema = z.object({
  appearance: z.enum(appearanceValues),
  isNewDonationsAlertsEnabled: z.boolean(),
  isSystemReports: z.boolean(),
  isUrgentAlertsEnabled: z.boolean(),
});

type ProfileValues = z.infer<typeof profileSchema>;
type LocationValues = z.infer<typeof locationSchema>;
type PreferencesValues = z.infer<typeof preferencesSchema>;

const toThemeAtom = (v: string): Theme => v.toLowerCase() as Theme;
const toAppearanceTheme = (v: string): "DARK" | "LIGHT" | "SYSTEM" => v.toUpperCase() as "DARK" | "LIGHT" | "SYSTEM";

const formatLastChangedDate = (value?: string | null) => {
  if (!value) {
    return "Never changed";
  }
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

export function SettingsPage() {
  const [theme, setTheme] = useAtom(themeAtom);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useAtom(changePasswordDialogOpenAtom);
  const { user, loading: userLoading } = useCurrentUser();
  const { handleUpdate, loading: updateLoading, errorMessage, success, clearState } = useUpdateProfile();

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { displayName: "", email: "" },
  });

  const locationForm = useForm<LocationValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: { city: "", country: "", neighborhood: "", latitude: "", longitude: "" },
  });

  const preferencesForm = useForm<PreferencesValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      appearance: toAppearanceTheme(theme),
      isNewDonationsAlertsEnabled: false,
      isSystemReports: false,
      isUrgentAlertsEnabled: false,
    },
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    profileForm.reset({
      displayName: user.displayName ?? "",
      email: user.email,
    });

    locationForm.reset({
      city: user.location?.city ?? "",
      country: user.location?.country ?? "",
      neighborhood: user.location?.neighborhood ?? "",
      latitude: user.location?.latitude?.toString() ?? "",
      longitude: user.location?.longitude?.toString() ?? "",
    });

    preferencesForm.reset({
      appearance: user.settings?.appearance ?? toAppearanceTheme(theme),
      isNewDonationsAlertsEnabled: user.settings?.isNewDonationsAlertsEnabled ?? false,
      isSystemReports: user.settings?.isSystemReports ?? false,
      isUrgentAlertsEnabled: user.settings?.isUrgentAlertsEnabled ?? false,
    });
  }, [user, theme, profileForm, locationForm, preferencesForm]);

  const buildPayload = (
    profileValues: ProfileValues,
    locationValues: LocationValues,
    preferencesValues: PreferencesValues
  ): UpdateProfileFormValues => ({
    displayName: profileValues.displayName,
    email: profileValues.email,
    description: user?.description ?? "",
    location: {
      city: locationValues.city || undefined,
      country: locationValues.country || undefined,
      neighborhood: locationValues.neighborhood || undefined,
      latitude: locationValues.latitude ? Number(locationValues.latitude) : undefined,
      longitude: locationValues.longitude ? Number(locationValues.longitude) : undefined,
    },
    settings: {
      appearance: toAppearanceTheme(preferencesValues.appearance),
      isNewDonationsAlertsEnabled: preferencesValues.isNewDonationsAlertsEnabled,
      isSystemReports: preferencesValues.isSystemReports,
      isUrgentAlertsEnabled: preferencesValues.isUrgentAlertsEnabled,
    },
  });

  const handleProfileSubmit = profileForm.handleSubmit(async (values) => {
    clearState();
    await handleUpdate(buildPayload(values, locationForm.getValues(), preferencesForm.getValues()));
  });

  const handleLocationSubmit = locationForm.handleSubmit(async (values) => {
    clearState();
    await handleUpdate(buildPayload(profileForm.getValues(), values, preferencesForm.getValues()));
  });

  const handlePreferencesSubmit = preferencesForm.handleSubmit(async (values) => {
    clearState();
    await handleUpdate(buildPayload(profileForm.getValues(), locationForm.getValues(), values));
  });

  return (
    <PageWrapper
      title="Settings"
      description="Manage your profile, preferences, and account security."
    >
      <div className="space-y-6 pb-8">
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={profileForm.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                          <Input className="h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" className="h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {errorMessage ? <p role="alert" className="text-sm text-destructive">{errorMessage}</p> : null}
                {success ? <p className="text-sm text-success">Profile updated successfully.</p> : null}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="h-11 min-h-11 rounded-xl px-6 text-sm font-semibold shadow-card"
                    disabled={updateLoading || userLoading}
                  >
                    Save Profile
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...locationForm}>
              <form onSubmit={handleLocationSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={locationForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input className="h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={locationForm.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input className="h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={locationForm.control}
                    name="neighborhood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Neighborhood</FormLabel>
                        <FormControl>
                          <Input className="h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={locationForm.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude</FormLabel>
                        <FormControl>
                          <Input type="number" step="any" className="h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={locationForm.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                          <Input type="number" step="any" className="h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {errorMessage ? <p role="alert" className="text-sm text-destructive">{errorMessage}</p> : null}
                {success ? <p className="text-sm text-success">Location updated successfully.</p> : null}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="h-11 min-h-11 rounded-xl px-6 text-sm font-semibold shadow-card"
                    disabled={updateLoading || userLoading}
                  >
                    Save Location
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...preferencesForm}>
              <form onSubmit={handlePreferencesSubmit} className="space-y-4">
                <FormField
                  control={preferencesForm.control}
                  name="appearance"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                      <FormLabel>Appearance</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(toAppearanceTheme(value));
                            setTheme(toThemeAtom(value));
                          }}
                        >
                          <SelectTrigger className="h-11 max-w-sm">
                            <SelectValue placeholder="Select appearance" />
                          </SelectTrigger>
                          <SelectContent>
                            {appearanceValues.map((value) => (
                              <SelectItem key={value} value={value}>
                                {appearanceLabels[value]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-3">
                  <FormField
                    control={preferencesForm.control}
                    name="isNewDonationsAlertsEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-md border border-border p-3">
                        <FormLabel className="mb-0">New Donations Alerts</FormLabel>
                        <FormControl className="mb-0">
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={preferencesForm.control}
                    name="isSystemReports"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-md border border-border p-3">
                        <FormLabel className="mb-0">System Reports</FormLabel>
                        <FormControl className="mb-0">
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={preferencesForm.control}
                    name="isUrgentAlertsEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-md border border-border p-3">
                        <FormLabel className="mb-0">Urgent Alerts</FormLabel>
                        <FormControl className="mb-0">
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                {errorMessage ? <p role="alert" className="text-sm text-destructive">{errorMessage}</p> : null}
                {success ? <p className="text-sm text-success">Preferences updated successfully.</p> : null}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="h-11 min-h-11 rounded-xl px-6 text-sm font-semibold shadow-card"
                    disabled={updateLoading || userLoading}
                  >
                    Save Preferences
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border p-4">
              <div>
                <p className="font-medium text-foreground">Password</p>
                <p className="text-sm text-muted-foreground">
                  Last changed: {formatLastChangedDate(user?.lastChangedPasswordDate)}
                </p>
              </div>
              <Button
                variant="outline"
                className="h-11 min-h-11 rounded-xl px-6 text-sm font-semibold"
                onClick={() => setChangePasswordDialogOpen(true)}
              >
                Change Password
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-md border border-border p-4">
              <p className="font-medium text-foreground">Email verification</p>
              <Badge variant={user?.isMailVerified ? "success" : "warning"}>
                {user?.isMailVerified ? "Verified" : "Not verified"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      <ChangePasswordDialog open={changePasswordDialogOpen} onOpenChange={setChangePasswordDialogOpen} />
    </PageWrapper>
  );
}
