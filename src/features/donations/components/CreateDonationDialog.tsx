import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PackageCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { CreateDonationInput } from "@/gql/graphql";
import { DonationUrgencyValues } from "@/gql/graphql";
import { Button } from "@/components/ui/button";
import { LocationMapPicker } from "@/components/map/LocationMapPicker";
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
import { useCategories } from "../hooks/useCategories";
import { DONATION_URGENCIES, donationUrgencyLabels } from "./DonationFilters";
import { DonationImageUpload } from "./DonationImageUpload";

const createDonationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().min(1, "Category is required"),
  mainAttachmentId: z.string().min(1, "Image attachment is required"),
  quantity: z
    .string()
    .min(1, "Quantity is required")
    .refine((value) => /^\d+$/.test(value) && Number.parseInt(value, 10) > 0, {
      message: "Quantity must be a positive integer",
    }),
  foodWeightKg: z
    .string()
    .min(1, "Food weight is required")
    .refine((value) => Number.isFinite(Number.parseFloat(value)) && Number.parseFloat(value) > 0, {
      message: "Food weight must be greater than 0",
    }),
  expiryDate: z.string().min(1, "Expiry date is required"),
  urgency: z.nativeEnum(DonationUrgencyValues).optional(),
  safetyChecklistCompleted: z.boolean().optional(),
  listingExpiresAt: z.string().optional(),
  specification: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value || value.trim() === "") {
          return true;
        }
        try {
          JSON.parse(value) as unknown;
          return true;
        } catch {
          return false;
        }
      },
      { message: "Specification must be valid JSON" },
    ),
  latitude: z
    .string()
    .min(1, "Latitude is required")
    .refine((value) => Number.isFinite(Number.parseFloat(value)), {
      message: "Latitude is required",
    }),
  longitude: z
    .string()
    .min(1, "Longitude is required")
    .refine((value) => Number.isFinite(Number.parseFloat(value)), {
      message: "Longitude is required",
    }),
});

type CreateDonationFormValues = z.infer<typeof createDonationSchema>;

type CreateDonationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const defaultValues: CreateDonationFormValues = {
  title: "",
  description: "",
  categoryId: "",
  mainAttachmentId: "",
  quantity: "1",
  foodWeightKg: "1",
  expiryDate: "",
  urgency: undefined,
  safetyChecklistCompleted: false,
  listingExpiresAt: "",
  specification: "",
  latitude: "",
  longitude: "",
};

function buildCreateDonationInput(values: CreateDonationFormValues): CreateDonationInput {
  const input: CreateDonationInput = {
    title: values.title.trim(),
    description: values.description.trim(),
    categoryId: values.categoryId,
    mainAttachmentId: values.mainAttachmentId,
    quantity: Number.parseInt(values.quantity, 10),
    foodWeightKg: Number.parseFloat(values.foodWeightKg),
    expiryDate: new Date(values.expiryDate).toISOString(),
    locationInput: {
      latitude: Number.parseFloat(values.latitude),
      longitude: Number.parseFloat(values.longitude),
    },
  };

  if (values.urgency) {
    input.urgency = values.urgency;
  }

  if (values.safetyChecklistCompleted === true) {
    input.safetyChecklistCompleted = true;
  }

  if (values.listingExpiresAt && values.listingExpiresAt.trim() !== "") {
    input.listingExpiresAt = new Date(values.listingExpiresAt).toISOString();
  }

  if (values.specification && values.specification.trim() !== "") {
    input.specification = JSON.parse(values.specification) as Record<string, unknown>;
  }

  return input;
}

export function CreateDonationDialog({ open, onOpenChange }: CreateDonationDialogProps) {
  const [createdTitle, setCreatedTitle] = useState("");
  const [success, setSuccess] = useState(false);
  const { handleCreate, loading, errorMessage, clearError } = useDonationActions();
  const { categories } = useCategories();

  const form = useForm<CreateDonationFormValues>({
    resolver: zodResolver(createDonationSchema),
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
    const ok = await handleCreate(buildCreateDonationInput(values));
    if (ok) {
      setSuccess(true);
    }
  });

  const latitude = form.watch("latitude");
  const longitude = form.watch("longitude");

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent
        className="w-full max-w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto p-0 sm:max-w-3xl"
        showCloseButton={false}
      >
        <div className="space-y-6 p-8">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-xl font-semibold text-foreground">New donation</DialogTitle>
          </DialogHeader>

          {success ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
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
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Basic information</h3>
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
                      name="categoryId"
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
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
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
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="foodWeightKg"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Food weight (kg)</FormLabel>
                          <FormControl>
                            <Input type="number" min={0.1} step={0.1} className="h-11" {...field} />
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
                          onValueChange={(value) => field.onChange(value === "none" ? undefined : value)}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select urgency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {DONATION_URGENCIES.map((urgency) => (
                              <SelectItem key={urgency} value={urgency}>
                                {donationUrgencyLabels[urgency]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
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
                  </div>
                  <FormField
                    control={form.control}
                    name="safetyChecklistCompleted"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value ?? false}
                            onCheckedChange={(checked) => field.onChange(checked === true)}
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer font-normal">Safety checklist completed</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Image</h3>
                  <DonationImageUpload
                    currentAttachmentId={form.watch("mainAttachmentId")}
                    onUploadComplete={(attachmentId) => {
                      form.setValue("mainAttachmentId", attachmentId, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                      form.clearErrors("mainAttachmentId");
                    }}
                    onUploadError={(message) => {
                      form.setError("mainAttachmentId", {
                        type: "manual",
                        message,
                      });
                    }}
                  />
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Location</h3>
                  <LocationMapPicker
                    latitude={latitude ? Number.parseFloat(latitude) : null}
                    longitude={longitude ? Number.parseFloat(longitude) : null}
                    onChange={(lat, lng) => {
                      form.setValue("latitude", String(lat), {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                      form.setValue("longitude", String(lng), {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                  />
                </div>

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
