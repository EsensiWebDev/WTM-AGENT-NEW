"use client";

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

const guestItemSchema = z.object({
  honorific: z.enum(["Mr", "Mrs", "Miss"], {
    required_error: "Please select an honorific",
  }),
  name: z.string().min(1, "Guest name is required"),
  category: z.enum(["Adult", "Child"], {
    required_error: "Please select a category",
  }),
  age: z.number().int().min(1).max(15).optional(),
});

const guestFormSchema = z.object({
  guests: z
    .array(guestItemSchema)
    .min(1, "At least one guest is required")
    .refine(
      (guests) => {
        return guests.every((guest) => {
          if (guest.category === "Child") {
            return guest.age !== undefined && guest.age >= 1 && guest.age <= 15;
          }
          return true;
        });
      },
      {
        message: "Age is required for children (1-15 years)",
      },
    ),
});

type GuestFormData = z.infer<typeof guestFormSchema>;
type GuestItem = z.infer<typeof guestItemSchema>;

interface SelectUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddGuest: (guests: GuestItem[]) => void;
}

export function SelectUserDialog({
  open,
  onOpenChange,
  onAddGuest,
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

  const watchedGuests = form.watch("guests");

  const handleGuestSubmit = (data: GuestFormData) => {
    onAddGuest(data.guests);
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

  const addGuestRow = () => {
    append({
      honorific: "Mr",
      name: "",
      category: "Adult",
      age: undefined,
    });
  };

  const removeGuestRow = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    } else {
      toast.error("At least one guest is required");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Guest(s)</DialogTitle>
          <DialogDescription>
            Enter the guest information to add them to your booking. You can add
            multiple guests at once.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleGuestSubmit)}
            className="space-y-4"
          >
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {fields.map((field, index) => {
                const category = watchedGuests[index]?.category;
                const isChild = category === "Child";

                return (
                  <div
                    key={field.id}
                    className="rounded-lg border border-gray-200 p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-900">
                        Guest {index + 1}
                      </h4>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeGuestRow(index)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name={`guests.${index}.honorific`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Honorific</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select honorific" />
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
                            <FormLabel>Guest Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter guest name"
                                {...field}
                              />
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
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
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

                      {isChild && (
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
                );
              })}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={addGuestRow}
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
                  onOpenChange(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Add Guest(s)</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
