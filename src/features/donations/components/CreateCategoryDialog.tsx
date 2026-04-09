import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PackageCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CategorySensitivityValues, type CreateCategoryInput } from "@/gql/graphql";
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
import { useCategoryActions } from "../hooks/useCategoryActions";

const createCategoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sensitivity: z.enum(CategorySensitivityValues),
});

type CreateCategoryFormValues = z.infer<typeof createCategoryFormSchema>;

type CreateCategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const defaultValues: CreateCategoryFormValues = {
  name: "",
  sensitivity: CategorySensitivityValues.Low,
};

function buildCreateCategoryInput(values: CreateCategoryFormValues): CreateCategoryInput {
  const input: CreateCategoryInput = {
    name: values.name.trim(),
    sensitivity: values.sensitivity,
  };
  return input;
}

export function CreateCategoryDialog({ open, onOpenChange }: CreateCategoryDialogProps) {
  const [createdName, setCreatedName] = useState("");
  const [success, setSuccess] = useState(false);
  const { handleCreate, loading, errorMessage, clearError } = useCategoryActions();

  const form = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(createCategoryFormSchema),
    defaultValues,
  });

  const handleClose = () => {
    form.reset(defaultValues);
    setCreatedName("");
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
    setCreatedName(values.name);
    setSuccess(false);
    const ok = await handleCreate(buildCreateCategoryInput(values));
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
            <DialogTitle className="text-xl font-semibold text-foreground">New category</DialogTitle>
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
                <p className="font-medium text-foreground">Category created</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {createdName} has been added to donation categories.
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
                  name="sensitivity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sensitivity</FormLabel>
                      <Select
                        value={field.value ?? CategorySensitivityValues.Low}
                        onValueChange={(value) =>
                          field.onChange(value as CategorySensitivityValues)
                        }
                      >
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select sensitivity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="z-[2100]">
                          <SelectItem value={CategorySensitivityValues.Low}>Low</SelectItem>
                          <SelectItem value={CategorySensitivityValues.Medium}>Medium</SelectItem>
                          <SelectItem value={CategorySensitivityValues.High}>High</SelectItem>
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
                    Create category
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
