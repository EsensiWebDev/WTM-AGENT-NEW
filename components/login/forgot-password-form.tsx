"use client";

import { forgotPasswordAction } from "@/app/forgot-password/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  IconAlertCircleFilled,
  IconCircleCheckFilled,
} from "@tabler/icons-react";
import HBLogo from "@/public/hb_logo.png";
import Image from "next/image";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
});

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

type ForgotPasswordFormProps = React.ComponentProps<"div">;

type DialogState = {
  open: boolean;
  type: "success" | "error";
  title: string;
  message: string;
};

export function ForgotPasswordForm({
  className,
  ...props
}: ForgotPasswordFormProps) {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
  const [dialog, setDialog] = React.useState<DialogState>({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(input: ForgotPasswordSchema) {
    startTransition(async () => {
      try {
        const result = await forgotPasswordAction(input.email);

        if (!result.success) {
          setDialog({
            open: true,
            type: "error",
            title: "Error",
            message: result.message || "An error occurred. Please try again.",
          });
          return;
        }

        setDialog({
          open: true,
          type: "success",
          title: "Success",
          message:
            result.message || "Password reset link has been sent to your email",
        });
        form.reset();
      } catch (err) {
        console.error("Forgot password error:", err);
        setDialog({
          open: true,
          type: "error",
          title: "Error",
          message: "An error occurred. Please try again.",
        });
      }
    });
  }

  return (
    <div className={cn("w-full max-w-md space-y-8", className)} {...props}>
      <div className="text-center">
        <Image
          src={HBLogo}
          alt="THE HOTEL BOX Logo"
          width={144}
          height={144}
          className="mx-auto mb-12 h-36 w-auto"
        />
        <span className="text-3xl font-bold">Reset Password Request</span>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              className="mt-1 bg-gray-200 text-black"
              placeholder="Enter your email address"
              {...form.register("email")}
              disabled={isPending}
            />
            {form.formState.errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Sending..." : "Send Reset Link"}
          </Button>

          <Link
            href="/login"
            className="text-muted-foreground block text-center text-sm underline-offset-4 hover:underline"
          >
            Back to login
          </Link>
        </div>
      </form>

      <Dialog
        open={dialog.open}
        onOpenChange={(open) => setDialog({ ...dialog, open })}
      >
        <DialogContent className="text-center" showCloseButton={false}>
          <DialogHeader className="flex flex-col items-center gap-4">
            <div>
              {dialog.type === "success" ? (
                <IconCircleCheckFilled className="mx-auto h-12 w-12 text-green-600" />
              ) : (
                <IconAlertCircleFilled className="mx-auto h-12 w-12 text-red-600" />
              )}
            </div>
            <DialogTitle
              className={
                dialog.type === "success" ? "text-green-600" : "text-red-600"
              }
            >
              {dialog.title}
            </DialogTitle>
            <DialogDescription>{dialog.message}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <Button onClick={() => setDialog({ ...dialog, open: false })}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
