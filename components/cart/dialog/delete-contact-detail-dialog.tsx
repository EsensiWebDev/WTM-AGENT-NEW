"use client";

import { deleteContactDetail } from "@/app/(protected)/cart/actions";
import { ContactDetail } from "@/app/(protected)/cart/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

interface DeleteContactDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactDetail: ContactDetail | null;
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteContactDetailDialog({
  open,
  onOpenChange,
  contactDetail,
  showTrigger = true,
  onSuccess,
}: DeleteContactDetailDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!contactDetail) return;
    startTransition(async () => {
      const result = await deleteContactDetail(contactDetail.id);
      if (result.success) {
        toast.success(result.message);
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Guest</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{contactDetail?.name}</span>? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? (
              <Loader className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
