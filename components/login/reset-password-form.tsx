"use client";

import { resetPasswordAction } from "@/app/reset-password/actions";
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
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  IconAlertCircleFilled,
  IconCircleCheckFilled,
} from "@tabler/icons-react";
import HBLogo from "@/public/hb_logo.png";
import Image from "next/image";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

type ResetPasswordFormProps = React.ComponentProps<"div">;

type DialogState = {
  open: boolean;
  type: "success" | "error";
  title: string;
  message: string;
};

export function ResetPasswordForm({
  className,
  ...props
}: ResetPasswordFormProps) {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [dialog, setDialog] = React.useState<DialogState>({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(input: ResetPasswordSchema) {
    if (!token) {
      setDialog({
        open: true,
        type: "error",
        title: "Error",
        message: "Invalid reset link. Please request a new password reset.",
      });
      return;
    }

    startTransition(async () => {
      try {
        const result = await resetPasswordAction(token, input.password);

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
            result.message || "Your password has been reset successfully.",
        });
        form.reset();
      } catch (err) {
        console.error("Reset password error:", err);
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
          className="mx-auto h-36 w-auto"
        />
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              className="mt-1 bg-gray-200 text-black"
              placeholder="Enter your new password"
              {...form.register("password")}
              disabled={isPending}
            />
            {form.formState.errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              className="mt-1 bg-gray-200 text-black"
              placeholder="Confirm your new password"
              {...form.register("confirmPassword")}
              disabled={isPending}
            />
            {form.formState.errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Resetting..." : "Reset Password"}
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
            {dialog.type === "success" ? (
              <Button
                onClick={() => {
                  setDialog({ ...dialog, open: false });
                  router.push("/login");
                }}
              >
                Go to Login
              </Button>
            ) : (
              <Button onClick={() => setDialog({ ...dialog, open: false })}>
                Close
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
