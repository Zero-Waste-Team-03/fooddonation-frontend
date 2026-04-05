import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PackageCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { CreateDonationInput } from "@/gql/graphql";
import { DonationUrgencyValues } from "@/gql/graphql";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useDonationActions } from "../hooks/useDonationActions";
import { useDonationFilterCategories } from "../hooks/useDonationFilterCategories";
import { DONATION_URGENCIES, donationUrgencyLabels } from "./DonationFilters";

const createDonationFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  mainAttachmentId: z.string().min(1, "Main attachment ID is required"),
  quantity: z
    .string()
    .min(1, "Quantity is required")
    .refine((s) => /^\d+$/.test(s) && parseInt(s, 10) > 0, {
      message: "Quantity must be a positive integer",
    }),
  expiryDate: z.string().min(1, "Expiry date is required"),
  urgency: z.nativeEnum(DonationUrgencyValues).optional(),
  safetyChecklistCompleted: z.boolean().optional(),
  listingExpiresAt: z.string().optional(),
  locationId: z.string().optional(),
  specification: z
    .string()
    .optional()
    .refine(
      (v) => {
        if (v == null || v.trim() === "") return true;
        try {
          JSON.parse(v) as unknown;
          return true;
        } catch {
          return false;
        }
      },
      { message: "Specification must be valid JSON" }
    ),
});

type CreateDonationFormValues = z.infer<typeof createDonationFormSchema>;

type CreateDonationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const defaultValues: CreateDonationFormValues = {
  title: "",
  description: "",
  category: "",
  mainAttachmentId: "",
  quantity: "1",
  expiryDate: "",
  urgency: undefined,
  safetyChecklistCompleted: false,
  listingExpiresAt: "",
  locationId: "",
  specification: "",
};

function buildCreateDonationInput(values: CreateDonationFormValues): CreateDonationInput {
  const input: CreateDonationInput = {
    title: values.title,
    description: values.description,
    categoryId: values.category,
    mainAttachmentId: values.mainAttachmentId,
    quantity: parseInt(values.quantity, 10),
    expiryDate: new Date(values.expiryDate).toISOString(),
  };
  if (values.urgency) {
    input.urgency = values.urgency;
  }
  if (values.safetyChecklistCompleted === true) {
    input.safetyChecklistCompleted = true;
  }
  if (values.listingExpiresAt != null && values.listingExpiresAt.trim() !== "") {
    input.listingExpiresAt = new Date(values.listingExpiresAt).toISOString();
  }
  if (values.locationId != null && values.locationId.trim() !== "") {
    input.locationId = values.locationId.trim();
  }
  if (values.specification != null && values.specification.trim() !== "") {
    input.specification = JSON.parse(values.specification) as Record<string, unknown>;
  }
  return input;
}

export function CreateDonationDialog({ open, onOpenChange }: CreateDonationDialogProps) {
  const [createdTitle, setCreatedTitle] = useState("");
  const { handleCreate, loading, errorMessage, clearError } = useDonationActions();
  const { categories } = useDonationFilterCategories();
  const [success, setSuccess] = useState(false);

  const form = useForm<CreateDonationFormValues>({
    resolver: zodResolver(createDonationFormSchema),
    defaultValues,
  });

  const handleClose = () => {
    form.reset(defaultValues);
    setCreatedTitle("");
    setSuccess(false);
    clearError();
    onOpenChange(false);
  };

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      handleClose();
      return;
    }
    onOpenChange(true);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    setCreatedTitle(values.title);
    setSuccess(false);
    const input = buildCreateDonationInput(values);
    const ok = await handleCreate(input);
    if (ok) {
      setSuccess(true);
    }
  });

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent
        className="w-full max-w-[calc(100%-2rem)] p-0 sm:max-w-2xl max-h-[90vh] overflow-y-auto"
        showCloseButton={false}
      >
        <div className="space-y-6 p-8">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-xl font-semibold text-foreground">New donation</DialogTitle>
          </DialogHeader>

          {success ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div
                className="h-12 w-12 rounded-full flex items-center justify-center"
                style={{ background: "var(--color-success)", opacity: 0.15 }}
              >
                <PackageCheck className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="font-medium text-foreground">Donation created</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {createdTitle} has been added to the listings.
                </p>
              </div>
              <Button
                variant="outline"
                className="h-11 min-h-11 rounded-xl px-6 text-sm font-semibold"
                onClick={handleClose}
              >
                Done
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Donation title" className="h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Describe the donation" className="h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          value={field.value.length > 0 ? field.value : undefined}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mainAttachmentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main attachment ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Cover photo UUID" className="h-11 font-mono text-sm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} className="h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" className="h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="urgency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Urgency (optional)</FormLabel>
                      <Select
                        value={field.value ?? "none"}
                        onValueChange={(v) => field.onChange(v === "none" ? undefined : v)}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select urgency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {DONATION_URGENCIES.map((u) => (
                            <SelectItem key={u} value={u}>
                              {donationUrgencyLabels[u]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="listingExpiresAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Listing expires (optional)</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" className="h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="locationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location ID (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Pickup location UUID" className="h-11 font-mono text-sm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specification JSON (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="{}" className="h-11 font-mono text-sm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="safetyChecklistCompleted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value ?? false}
                          onCheckedChange={(c) => field.onChange(c === true)}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">Safety checklist completed</FormLabel>
                    </FormItem>
                  )}
                />
                {errorMessage ? (
                  <p role="alert" className="text-sm text-destructive">
                    {errorMessage}
                  </p>
                ) : null}
                <DialogFooter className="items-center justify-end gap-2 pt-2 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 min-h-11 rounded-xl px-6 text-sm font-semibold"
                    onClick={handleClose}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="h-11 min-h-11 rounded-xl px-6 text-sm font-semibold shadow-card"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Create donation
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
