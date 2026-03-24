import { Button } from "@/components/ui/button";
export function AppearanceSection() {
  return (
    <section className="rounded-[20px] border border-border bg-card p-6 shadow-card">
      <Button type="button" variant="ghost" className="h-9 w-full rounded-xl border border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive/10">
        Deactivate Admin Account
      </Button>
    </section>
  );
}
