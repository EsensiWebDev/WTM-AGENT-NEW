"use client";

import { GuestPayload, GuestHonorific, GuestCategory } from "@/app/(protected)/cart/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";

const guestFormSchema = z
  .object({
    guests: z
      .array(
        z.object({
          honorific: z.enum(["Mr", "Mrs", "Miss"], {
            required_error: "Honorific is required",
          }),
          name: z.string().min(1, "Guest name is required"),
          category: z.enum(["Adult", "Child"], {
            required_error: "Category is required",
          }),
          age: z.number().optional(),
        }),
      )
      .min(1, "At least one guest is required"),
  })
  .superRefine((data, ctx) => {
    // Validate age for children
    data.guests.forEach((guest, index) => {
      if (guest.category === "Child") {
        if (!guest.age || guest.age < 1 || guest.age > 15) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Age must be between 1 and 15 for children",
            path: [index, "age"],
          });
        }
      }
    });

    // Check for duplicates within the form
    const seen = new Set<string>();
    data.guests.forEach((guest, index) => {
      const key = `${guest.honorific}-${guest.name}`;
      if (seen.has(key)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Duplicate guest detected",
          path: [index, "name"],
        });
      }
      seen.add(key);
    });
  });

type GuestFormData = z.infer<typeof guestFormSchema>;
type GuestItem = GuestFormData["guests"][number];

interface SelectUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddGuest: (guestData: GuestPayload[]) => void;
  existingGuests?: GuestPayload[];
}

export function SelectUserDialog({
  open,
  onOpenChange,
  onAddGuest,
  existingGuests = [],
}: SelectUserDialogProps) {
  const form = useForm<GuestFormData>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: {
      guests: [
        {
          honorific: "Mr",
          name: "",
          category: "Adult",
          age: undefined,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "guests",
  });

  const handleGuestSubmit = async (data: GuestFormData) => {
    // Check for duplicates against existing guests
    const duplicateGuests: string[] = [];
    data.guests.forEach((guest) => {
      const key = `${guest.honorific}-${guest.name}`;
      const isDuplicate = existingGuests.some(
        (existing) => `${existing.honorific}-${existing.name}` === key,
      );
      if (isDuplicate) {
        duplicateGuests.push(`${guest.honorific} ${guest.name}`);
      }
    });

    if (duplicateGuests.length > 0) {
      toast.error(
        `The following guests already exist: ${duplicateGuests.join(", ")}`,
      );
      return;
    }

    // Convert to GuestPayload format
    const guestPayloads: GuestPayload[] = data.guests.map((guest) => ({
      name: guest.name,
      honorific: guest.honorific,
      category: guest.category,
      age: guest.category === "Child" ? guest.age : undefined,
    }));

    onAddGuest(guestPayloads);
    form.reset({
      guests: [
        {
          honorific: "Mr",
          name: "",
          category: "Adult",
          age: undefined,
        },
      ],
    });
    onOpenChange(false);
  };

  const handleSubmitError = () => {
    const errors = form.formState.errors;
    if (errors.guests && Array.isArray(errors.guests)) {
      errors.guests.forEach((guestError, index) => {
        if (guestError?.name) {
          toast.error(`Guest ${index + 1}: ${guestError.name.message}`);
        }
        if (guestError?.age) {
          toast.error(`Guest ${index + 1}: ${guestError.age.message}`);
        }
      });
    }
    if (errors.guests && !Array.isArray(errors.guests) && errors.guests.message) {
      toast.error(errors.guests.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Guest(s)</DialogTitle>
          <DialogTitle>Add Guest(s)</DialogTitle>
          <DialogDescription>
            Enter guest information. You can add multiple guests at once.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleGuestSubmit, handleSubmitError)}
            className="space-y-4"
          >
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-lg border p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">
                      Guest {index + 1}
                    </h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name={`guests.${index}.honorific`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Honorific</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Mr">Mr</SelectItem>
                              <SelectItem value="Mrs">Mrs</SelectItem>
                              <SelectItem value="Miss">Miss</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`guests.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter guest name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`guests.${index}.category`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              // Reset age when category changes
                              if (value === "Adult") {
                                form.setValue(`guests.${index}.age`, undefined);
                              }
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Adult">Adult</SelectItem>
                              <SelectItem value="Child">Child</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch(`guests.${index}.category`) === "Child" && (
                      <FormField
                        control={form.control}
                        name={`guests.${index}.age`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age</FormLabel>
                            <Select
                              onValueChange={(value) =>
                                field.onChange(Number(value))
                              }
                              value={field.value?.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select age" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Array.from({ length: 15 }, (_, i) => i + 1).map(
                                  (age) => (
                                    <SelectItem
                                      key={age}
                                      value={age.toString()}
                                    >
                                      {age} {age === 1 ? "year" : "years"}
                                    </SelectItem>
                                  ),
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  honorific: "Mr",
                  name: "",
                  category: "Adult",
                  age: undefined,
                })
              }
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Another Guest
            </Button>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset({
                    guests: [
                      {
                        honorific: "Mr",
                        name: "",
                        category: "Adult",
                        age: undefined,
                      },
                    ],
                  });
                  form.reset({
                    guests: [
                      {
                        honorific: "Mr",
                        name: "",
                        category: "Adult",
                        age: undefined,
                      },
                    ],
                  });
                  onOpenChange(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Add Guest(s)</Button>
              <Button type="submit">Add Guest(s)</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
