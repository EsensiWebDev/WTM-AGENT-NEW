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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const guestFormSchema = z.object({
  name: z.string().min(1, "Guest name is required"),
});

type GuestFormData = z.infer<typeof guestFormSchema>;

interface SelectUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddGuest: (guestName: string) => void;
}

export function SelectUserDialog({
  open,
  onOpenChange,
  onAddGuest,
}: SelectUserDialogProps) {
  const form = useForm<GuestFormData>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleGuestSubmit = (data: GuestFormData) => {
    onAddGuest(data.name);
    form.reset();
    onOpenChange(false);
    toast.success(`Guest "${data.name}" added successfully`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Guest</DialogTitle>
          <DialogDescription>
            Enter the guest information to add them to your booking.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleGuestSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guest Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter guest name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  onOpenChange(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Add Guest</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
