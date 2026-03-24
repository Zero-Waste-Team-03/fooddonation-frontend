import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Circle, CircleDot, Gavel, Info, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const createUserSchema = z
  .object({
    accountType: z.enum(["NEW_ADMIN", "NEW_ORGANIZATION"]),
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    role: z.enum(["ADMIN", "USER"]),
    organizationName: z.string().optional(),
    organizationType: z.string().optional(),
    locationAddress: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.accountType !== "NEW_ORGANIZATION") {
      return;
    }

    if (!data.organizationName || data.organizationName.trim().length < 2) {
      ctx.addIssue({
        code: "custom",
        message: "Organization name is required for organization accounts",
        path: ["organizationName"],
      });
    }

    if (!data.organizationType || data.organizationType.trim().length < 2) {
      ctx.addIssue({
        code: "custom",
        message: "Organization type is required for organization accounts",
        path: ["organizationType"],
      });
    }

    if (!data.locationAddress || data.locationAddress.trim().length < 5) {
      ctx.addIssue({
        code: "custom",
        message: "Location address is required for organization accounts",
        path: ["locationAddress"],
      });
    }
  });

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

type CreateUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateUserFormValues) => Promise<void>;
};

const defaultValues: CreateUserFormValues = {
  accountType: "NEW_ADMIN",
  name: "",
  email: "",
  role: "ADMIN",
  organizationName: "",
  organizationType: "",
  locationAddress: "",
};

export function CreateUserDialog({ open, onOpenChange, onSubmit }: CreateUserDialogProps) {
  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues,
  });

  const accountType = form.watch("accountType");
  const isSubmitting = form.formState.isSubmitting;
  const organizationFieldsDisabled = accountType !== "NEW_ORGANIZATION";

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
    console.log("Create user dialog submit", values);
    onOpenChange(false);
    form.reset(defaultValues);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-[calc(100%-2rem)] rounded-4xl border-none bg-card p-0 shadow-modal sm:max-w-218.5"
      >
        <div className="space-y-7 p-8 sm:p-10 sm:pb-14">
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-7">

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="create-user-name" className="text-[13px] font-semibold text-foreground">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="create-user-name"
                          placeholder="e.g. Julian Thorne"
                          className="h-11 rounded-xl border-0 bg-input px-4"
                          {...field}
                        />
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
                      <FormLabel htmlFor="create-user-email" className="text-[13px] font-semibold text-foreground">
                        Official Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="create-user-email"
                          type="email"
                          placeholder="julian@mindfulcurator.org"
                          className="h-11 rounded-xl border-0 bg-input px-4"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-3.5">
                    <FormLabel className="text-[13px] font-semibold text-foreground">Administrative Role</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <Button
                          type="button"
                          variant="ghost"
                          className={
                            field.value === "ADMIN"
                              ? "h-auto min-h-27 w-full items-start justify-between rounded-xl border border-primary/25 bg-primary/10 p-4 text-left sm:p-5"
                              : "h-auto min-h-27 w-full items-start justify-between rounded-xl border border-border/70 bg-muted/70 p-4 text-left sm:p-5"
                          }
                          onClick={() => field.onChange("ADMIN")}
                        >
                          <div className="min-w-0 space-y-1 pr-2">
                            <p className="text-base font-semibold text-primary">Super Admin</p>
                            <p className="text-xs leading-5 text-muted-foreground wrap-break-words">
                              Full system access, including financial records and audit logs.
                            </p>
                          </div>
                          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          className={
                            field.value === "USER"
                              ? "h-auto min-h-27 w-full items-start justify-between rounded-xl border border-primary/25 bg-primary/10 p-4 text-left sm:p-5"
                              : "h-auto min-h-27 w-full items-start justify-between rounded-xl border border-border/70 bg-muted/70 p-4 text-left sm:p-5"
                          }
                          onClick={() => field.onChange("USER")}
                        >
                          <div className="min-w-0 space-y-1 pr-2">
                            <p className="text-base font-semibold text-primary">Moderator</p>
                            <p className="text-xs leading-5 text-muted-foreground wrap-break-words">
                              Manage donations, resolve disputes, and oversee organization profiles.
                            </p>
                          </div>
                          <Gavel className="mt-0.5 size-4 shrink-0 text-primary" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountType"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid grid-cols-1 gap-2 py-0.5 text-sm font-semibold text-muted-foreground sm:grid-cols-2">
                        <Button
                          type="button"
                          variant="ghost"
                          className={
                            field.value === "NEW_ADMIN"
                              ? "h-9 justify-center rounded-lg text-primary"
                              : "h-9 justify-center rounded-lg text-muted-foreground"
                          }
                          onClick={() => field.onChange("NEW_ADMIN")}
                        >
                          {field.value === "NEW_ADMIN" ? (
                            <CircleDot className="mr-2 size-4 text-primary" />
                          ) : (
                            <Circle className="mr-2 size-4 text-muted-foreground" />
                          )}
                          <ShieldCheck className="mr-1 size-4" />
                          New Admin
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className={
                            field.value === "NEW_ORGANIZATION"
                              ? "h-9 justify-center rounded-lg text-primary"
                              : "h-9 justify-center rounded-lg text-muted-foreground"
                          }
                          onClick={() => field.onChange("NEW_ORGANIZATION")}
                        >
                          {field.value === "NEW_ORGANIZATION" ? (
                            <CircleDot className="mr-2 size-4 text-primary" />
                          ) : (
                            <Circle className="mr-2 size-4 text-muted-foreground" />
                          )}
                          <Building2 className="mr-1 size-4" />
                          New Organization
                        </Button>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-2 text-xs text-foreground">
                <Info className="size-3.5 text-muted-foreground" />
                <p>Complete the section below only for multi-user organizational accounts.</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="organizationName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="create-user-organization-name" className="text-[13px] font-semibold text-label">
                          Organization Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="create-user-organization-name"
                            disabled={organizationFieldsDisabled}
                            className="h-11 rounded-xl border-0 bg-input px-4 disabled:opacity-60"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="organizationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="create-user-organization-type" className="text-[13px] font-semibold text-label">
                          Organization Type
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="create-user-organization-type"
                            disabled={organizationFieldsDisabled}
                            placeholder="NGO"
                            className="h-11 rounded-xl border-0 bg-input px-4 disabled:opacity-60"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="locationAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="create-user-location-address" className="text-[13px] font-semibold text-label">
                        Location Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="create-user-location-address"
                          disabled={organizationFieldsDisabled}
                          className="h-11 rounded-xl border-0 bg-input px-4 disabled:opacity-60"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="mt-4 items-center justify-between border-t border-border px-0 pt-7 sm:flex-row">
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="size-2 rounded-full bg-warning" aria-hidden />
                  Pending background verification
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-11 rounded-xl px-6 font-semibold text-primary hover:bg-accent"
                    onClick={() => onOpenChange(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="h-11 min-w-42.5 rounded-xl px-9 font-semibold text-primary-foreground shadow-card"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create Account"}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
