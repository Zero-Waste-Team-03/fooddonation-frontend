import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LocateFixed } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Map, MapMarker, MarkerContent, useMap } from "@/components/ui/map";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { changePasswordDialogOpenAtom, themeAtom, type Theme } from "@/store";
import { AvatarUpload } from "../components/AvatarUpload";
import { ChangePasswordDialog } from "../components/ChangePasswordDialog";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useUpdateProfileInfo } from "../hooks/useUpdateProfileInfo";
import { useUpdateLocation } from "../hooks/useUpdateLocation";
import { useUpdateSettings } from "../hooks/useUpdateSettings";
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
type Coordinates = { latitude: number; longitude: number };

type ReverseLocationIqResponse = {
  address?: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    country?: string;
    suburb?: string;
    neighbourhood?: string;
    quarter?: string;
  };
};

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

function MapClickHandler({ onPick }: { onPick: (coords: Coordinates) => void }) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded) {
      return;
    }

    const handleClick = (event: { lngLat: { lng: number; lat: number } }) => {
      onPick({ latitude: event.lngLat.lat, longitude: event.lngLat.lng });
    };

    map.on("click", handleClick);

    return () => {
      map.off("click", handleClick);
    };
  }, [map, isLoaded, onPick]);

  return null;
}

export function SettingsPage() {
  const [theme, setTheme] = useAtom(themeAtom);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useAtom(changePasswordDialogOpenAtom);
  const { user, loading: userLoading } = useCurrentUser();
  const { handleUpdate: handleUpdateProfile, loading: profileLoading, errorMessage: profileErrorMessage, success: profileSuccess, clearState: clearProfileState } = useUpdateProfileInfo();
  const { handleUpdate: handleUpdateLocation, loading: locationLoading, errorMessage: locationErrorMessage, success: locationSuccess, clearState: clearLocationState } = useUpdateLocation();
  const { handleUpdate: handleUpdateSettings, loading: settingsLoading, errorMessage: settingsErrorMessage, success: settingsSuccess, clearState: clearSettingsState } = useUpdateSettings();
  const [mapErrorMessage, setMapErrorMessage] = useState<string | null>(null);
  const [isResolvingLocation, setIsResolvingLocation] = useState(false);
  const [isLocatingFromDevice, setIsLocatingFromDevice] = useState(false);

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

  const currentCoordinates = useMemo<Coordinates>(() => {
    const latitude = Number(locationForm.watch("latitude"));
    const longitude = Number(locationForm.watch("longitude"));

    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
      return { latitude, longitude };
    }

    return {
      latitude: user?.location?.latitude ?? 48.8566,
      longitude: user?.location?.longitude ?? 2.3522,
    };
  }, [locationForm, user?.location?.latitude, user?.location?.longitude]);

  const reverseGeocode = async (coords: Coordinates) => {
    const locationIqKey = import.meta.env.VITE_LOCATIONIQ_KEY;
    if (!locationIqKey) {
      setMapErrorMessage("LocationIQ key is missing.");
      return;
    }

    setMapErrorMessage(null);
    setIsResolvingLocation(true);
    try {
      const url = new URL("https://us1.locationiq.com/v1/reverse");
      url.searchParams.set("key", locationIqKey);
      url.searchParams.set("lat", String(coords.latitude));
      url.searchParams.set("lon", String(coords.longitude));
      url.searchParams.set("format", "json");

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error("Failed to resolve location");
      }

      const data = (await response.json()) as ReverseLocationIqResponse;
      const address = data.address ?? {};

      const city =
        address.city ?? address.town ?? address.village ?? address.county ?? "";
      const country = address.country ?? "";
      const neighborhood =
        address.neighbourhood ?? address.suburb ?? address.quarter ?? "";

      locationForm.setValue("latitude", String(coords.latitude), {
        shouldDirty: true,
      });
      locationForm.setValue("longitude", String(coords.longitude), {
        shouldDirty: true,
      });
      locationForm.setValue("city", city, { shouldDirty: true });
      locationForm.setValue("country", country, { shouldDirty: true });
      locationForm.setValue("neighborhood", neighborhood, { shouldDirty: true });
    } catch {
      setMapErrorMessage("Could not reverse geocode this location.");
    } finally {
      setIsResolvingLocation(false);
    }
  };

  const handlePickLocation = async (coords: Coordinates) => {
    await reverseGeocode(coords);
  };

  const handleLocateFromDevice = async () => {
    if (!("geolocation" in navigator)) {
      setMapErrorMessage("Geolocation is not supported by this browser.");
      return;
    }

    setMapErrorMessage(null);
    setIsLocatingFromDevice(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        void reverseGeocode(coords);
        setIsLocatingFromDevice(false);
      },
      () => {
        setMapErrorMessage("Unable to retrieve your current location.");
        setIsLocatingFromDevice(false);
      },
    );
  };

  const buildProfilePayload = (profileValues: ProfileValues): UpdateProfileFormValues => ({
    displayName: profileValues.displayName,
    email: profileValues.email,
    description: user?.description ?? "",
    location: {
      city: user?.location?.city ?? undefined,
      country: user?.location?.country ?? undefined,
      neighborhood: user?.location?.neighborhood ?? undefined,
      latitude: user?.location?.latitude ?? undefined,
      longitude: user?.location?.longitude ?? undefined,
    },
    settings: {
      appearance: (user?.settings?.appearance as "DARK" | "LIGHT" | "SYSTEM") ?? "SYSTEM",
      isNewDonationsAlertsEnabled: user?.settings?.isNewDonationsAlertsEnabled ?? false,
      isSystemReports: user?.settings?.isSystemReports ?? false,
      isUrgentAlertsEnabled: user?.settings?.isUrgentAlertsEnabled ?? false,
    },
  });

  const buildLocationPayload = (locationValues: LocationValues): UpdateProfileFormValues => ({
    displayName: user?.displayName ?? "",
    email: user?.email ?? "",
    description: user?.description ?? "",
    location: {
      city: locationValues.city || undefined,
      country: locationValues.country || undefined,
      neighborhood: locationValues.neighborhood || undefined,
      latitude: locationValues.latitude ? Number(locationValues.latitude) : undefined,
      longitude: locationValues.longitude ? Number(locationValues.longitude) : undefined,
    },
    settings: {
      appearance: (user?.settings?.appearance as "DARK" | "LIGHT" | "SYSTEM") ?? "SYSTEM",
      isNewDonationsAlertsEnabled: user?.settings?.isNewDonationsAlertsEnabled ?? false,
      isSystemReports: user?.settings?.isSystemReports ?? false,
      isUrgentAlertsEnabled: user?.settings?.isUrgentAlertsEnabled ?? false,
    },
  });

  const buildPreferencesPayload = (preferencesValues: PreferencesValues): UpdateProfileFormValues => ({
    displayName: user?.displayName ?? "",
    email: user?.email ?? "",
    description: user?.description ?? "",
    location: {
      city: user?.location?.city ?? undefined,
      country: user?.location?.country ?? undefined,
      neighborhood: user?.location?.neighborhood ?? undefined,
      latitude: user?.location?.latitude ?? undefined,
      longitude: user?.location?.longitude ?? undefined,
    },
    settings: {
      appearance: toAppearanceTheme(preferencesValues.appearance),
      isNewDonationsAlertsEnabled: preferencesValues.isNewDonationsAlertsEnabled,
      isSystemReports: preferencesValues.isSystemReports,
      isUrgentAlertsEnabled: preferencesValues.isUrgentAlertsEnabled,
    },
  });

  const handleProfileSubmit = profileForm.handleSubmit(async (values) => {
    clearProfileState();
    await handleUpdateProfile(buildProfilePayload(values));
  });

  const handleLocationSubmit = locationForm.handleSubmit(async (values) => {
    clearLocationState();
    await handleUpdateLocation(buildLocationPayload(values));
  });

  const handlePreferencesSubmit = preferencesForm.handleSubmit(async (values) => {
    clearSettingsState();
    await handleUpdateSettings(buildPreferencesPayload(values));
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
            <div className="mb-6 flex justify-center">
              <AvatarUpload
                currentAvatarUrl={user?.avatar?.url ?? null}
                displayName={user?.displayName ?? null}
                email={user?.email ?? ""}
              />
            </div>
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
                {profileErrorMessage ? <p role="alert" className="text-sm text-destructive">{profileErrorMessage}</p> : null}
                {profileSuccess ? <p className="text-sm text-success">Profile updated successfully.</p> : null}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="h-11 min-h-11 rounded-xl px-6 text-sm font-semibold shadow-card"
                    disabled={profileLoading || userLoading || !profileForm.formState.isDirty}
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
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
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
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
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
                  </div>
                  <div className="space-y-2">
                    <div className="relative h-[340px] overflow-hidden rounded-xl border border-border">
                      <Map
                        key={`${currentCoordinates.latitude}-${currentCoordinates.longitude}`}
                        center={[
                          currentCoordinates.longitude,
                          currentCoordinates.latitude,
                        ]}
                        zoom={12}
                        className="h-full w-full min-h-full"
                        loading={isResolvingLocation}
                      >
                        <MapClickHandler onPick={handlePickLocation} />
                        <MapMarker
                          longitude={currentCoordinates.longitude}
                          latitude={currentCoordinates.latitude}
                          draggable
                          onDragEnd={(lngLat) =>
                            void handlePickLocation({
                              latitude: lngLat.lat,
                              longitude: lngLat.lng,
                            })
                          }
                        >
                          <MarkerContent />
                        </MapMarker>
                      </Map>
                      <Button
                        type="button"
                        size="icon"
                        className="absolute top-3 right-3 z-20 h-9 w-9 rounded-full shadow-card"
                        onClick={() => void handleLocateFromDevice()}
                        disabled={isLocatingFromDevice || isResolvingLocation}
                        aria-label="Use current device location"
                      >
                        <LocateFixed className="h-4 w-4" aria-hidden />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Click the map, drag the marker, or use the location button.
                    </p>
                  </div>
                </div>
                {mapErrorMessage ? <p role="alert" className="text-sm text-destructive">{mapErrorMessage}</p> : null}
                {locationErrorMessage ? <p role="alert" className="text-sm text-destructive">{locationErrorMessage}</p> : null}
                {locationSuccess ? <p className="text-sm text-success">Location updated successfully.</p> : null}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="h-11 min-h-11 rounded-xl px-6 text-sm font-semibold shadow-card"
                    disabled={locationLoading || userLoading || !locationForm.formState.isDirty}
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
                {settingsErrorMessage ? <p role="alert" className="text-sm text-destructive">{settingsErrorMessage}</p> : null}
                {settingsSuccess ? <p className="text-sm text-success">Preferences updated successfully.</p> : null}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="h-11 min-h-11 rounded-xl px-6 text-sm font-semibold shadow-card"
                    disabled={settingsLoading || userLoading || !preferencesForm.formState.isDirty}
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
