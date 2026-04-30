import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PackageCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CategorySensitivity } from "@/gql/graphql";
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
import type { Category } from "@/types/donation.types";
import { useCategoryActions } from "../hooks/useCategoryActions";

const editCategoryFormSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "Category name is required"),
  reputationGain: z
    .number()
    .int("Score points must be a whole number")
    .min(0, "Score points cannot be negative"),
  sensitivity: z.nativeEnum(CategorySensitivity),
});

type EditCategoryFormValues = z.infer<typeof editCategoryFormSchema>;

type EditCategoryDialogProps = {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const defaultValues: EditCategoryFormValues = {
  id: "",
  name: "",
  reputationGain: 0,
  sensitivity: CategorySensitivity.Low,
};

export function EditCategoryDialog({ category, open, onOpenChange }: EditCategoryDialogProps) {
  const [updatedName, setUpdatedName] = useState("");
  const [success, setSuccess] = useState(false);
  const { handleUpdate, loading, errorMessage, clearError } = useCategoryActions();

  const form = useForm<EditCategoryFormValues>({
    resolver: zodResolver(editCategoryFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (category) {
      form.reset({
        id: category.id,
        name: category.name,
        reputationGain: category.reputationGain ?? 0,
        sensitivity: category.sensitivity ?? CategorySensitivity.Low,
      });
    }
  }, [category, form]);

  const handleClose = () => {
    form.reset(defaultValues);
    setUpdatedName("");
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
    setUpdatedName(values.name);
    setSuccess(false);
    const ok = await handleUpdate(values);
    if (ok) {
      setSuccess(true);
    }
  });

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent
        className="w-full max-w-[calc(100%-2rem)] p-0 sm:max-w-xl max-h-[90vh] overflow-y-auto"
        showCloseButton={false}
      >
        <div className="space-y-6 p-8">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-xl font-semibold text-foreground">Edit category</DialogTitle>
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
                <p className="font-medium text-foreground">Category updated</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {updatedName} has been updated.
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Category name" className="h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reputationGain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Score points</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          step={1}
                          placeholder="0"
                          className="h-11"
                          {...field}
                          onChange={(event) =>
                            field.onChange(parseInt(event.target.value, 10) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sensitivity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sensitivity</FormLabel>
                      <Select
                        value={field.value ?? CategorySensitivity.Low}
                        onValueChange={(value) =>
                          field.onChange(value as CategorySensitivity)
                        }
                      >
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select sensitivity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="z-[2100]">
                          <SelectItem value={CategorySensitivity.Low}>Low</SelectItem>
                          <SelectItem value={CategorySensitivity.Medium}>Medium</SelectItem>
                          <SelectItem value={CategorySensitivity.High}>High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
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
                    Save changes
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
