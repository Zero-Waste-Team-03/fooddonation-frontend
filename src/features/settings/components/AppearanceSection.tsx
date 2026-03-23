import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { MoonStar, Sun } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { themeModeAtom } from "@/store";
import type { AppearanceSettings } from "@/types/settings.types";

const appearanceSchema = z.object({
  appearanceTheme: z.enum(["ETHOS_LIGHT", "FOREST_DARK"]),
});

type AppearanceFormValues = z.infer<typeof appearanceSchema>;

type AppearanceSectionProps = {
  initialValues: AppearanceSettings;
  onSubmit: (data: AppearanceFormValues) => Promise<void>;
};

export function AppearanceSection({ initialValues, onSubmit }: AppearanceSectionProps) {
  const [themeMode, setThemeMode] = useAtom(themeModeAtom);

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceSchema),
    defaultValues: {
      ...initialValues,
      appearanceTheme: themeMode === "dark" ? "FOREST_DARK" : "ETHOS_LIGHT",
    },
  });

  const theme = form.watch("appearanceTheme");

  const handleSubmit = form.handleSubmit(async (data) => {
    setThemeMode(data.appearanceTheme === "FOREST_DARK" ? "dark" : "light");
    await onSubmit(data);
    console.log("Appearance section", data);
  });

  return (
    <section className="rounded-[20px] border border-border bg-card p-6 shadow-card">
      <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Appearance</h2>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            control={form.control}
            name="appearanceTheme"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-label">Theme</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-1 gap-2 rounded-xl bg-muted p-1 sm:grid-cols-2">
                    <Button
                      type="button"
                      variant="ghost"
                      className={
                        theme === "ETHOS_LIGHT"
                          ? "h-10 justify-start rounded-lg border border-primary bg-card px-3 font-semibold text-primary"
                          : "h-10 justify-start rounded-lg px-3 text-muted-foreground"
                      }
                      onClick={() => {
                        field.onChange("ETHOS_LIGHT");
                        setThemeMode("light");
                      }}
                    >
                      <Sun className="mr-2 size-4" />
                      Ethos Light
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className={
                        theme === "FOREST_DARK"
                          ? "h-10 justify-start rounded-lg bg-primary px-3 font-semibold text-primary-foreground hover:bg-primary-hover"
                          : "h-10 justify-start rounded-lg px-3 text-muted-foreground"
                      }
                      onClick={() => {
                        field.onChange("FOREST_DARK");
                        setThemeMode("dark");
                      }}
                    >
                      <MoonStar className="mr-2 size-4" />
                      Forest Dark
                    </Button>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="button" variant="ghost" className="h-9 w-full rounded-xl border border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive/10">
            Deactivate Admin Account
          </Button>
        </form>
      </Form>
    </section>
  );
}
