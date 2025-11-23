"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import HBLogo from "@/public/hb_logo.png";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const loginSchema = z.object({
  username: z.string().min(1, "Please enter a valid username"),
  password: z.string().min(1, "Password is required"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

type LoginFormProps = React.ComponentProps<"div"> & {
  callbackUrl?: string;
};

export function LoginForm({
  className,
  callbackUrl,
  ...props
}: LoginFormProps) {
  const [isPending, startTransition] = React.useTransition();
  const { setAccessToken } = useAuth();
  const router = useRouter();

  const safeCallbackUrl = React.useMemo(() => {
    if (!callbackUrl) return null;
    const trimmed = callbackUrl.trim();

    if (!trimmed.startsWith("/")) return null;
    if (trimmed.startsWith("//")) return null;
    // Prevent redirecting to logout page after successful login
    if (trimmed === "/logout") return null;

    return trimmed;
  }, [callbackUrl]);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  function onSubmit(input: LoginSchema) {
    startTransition(async () => {
      try {
        const res = await api("/api/auth/login", {
          method: "POST",
          body: JSON.stringify(input),
        });

        setAccessToken(res.data.token);
        toast.success("Login successful");
        router.push(safeCallbackUrl ?? "/home");
      } catch (err: any) {
        toast.error(err.message || "Login Failed");
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
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              className="mt-1 bg-gray-200 text-black"
              placeholder="Enter your username or email"
              {...form.register("username")}
              disabled={isPending}
            />
            {form.formState.errors.username && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.username.message}
              </p>
            )}
          </div>

          <div>
            <PasswordInput
              id="password"
              label="Password"
              className="mt-1 bg-gray-200 text-black"
              placeholder="Enter your password"
              {...form.register("password")}
              disabled={isPending}
              error={form.formState.errors.password?.message}
            />
            <a
              href="/forgot-password"
              className="text-muted-foreground mt-2 block text-right text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Logging in..." : "Login"}
          </Button>

          <Link
            href="/register"
            className="text-muted-foreground block text-center text-sm underline-offset-4 hover:underline"
          >
            Create New Account
          </Link>
        </div>
      </form>
    </div>
  );
}
