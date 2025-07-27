"use client";

import { loginAction } from "@/app/login/action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginSchema = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(input: LoginSchema) {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("email", input.email);
        formData.append("password", input.password);

        const result = await loginAction(formData);

        if (result.success) {
          toast.success(result.message || "Login successful");
          router.push("/home");
        } else {
          toast.error(result.message || "Login failed. Please try again.");
        }
      } catch (err) {
        console.error("Login error:", err);
        toast.error("An error occurred. Please try again.");
      }
    });
  }

  return (
    <div className={cn("w-full max-w-md space-y-8", className)} {...props}>
      <div className="text-center">
        <Image
          src="/hb_logo.png"
          alt="THE HOTEL BOX Logo"
          width={144}
          height={144}
          className="mx-auto h-36 w-auto"
        />
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              className="mt-1 bg-gray-200 text-black"
              placeholder="m@example.com"
              {...form.register("email")}
              disabled={isPending}
            />
            {form.formState.errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.email.message}
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
              href="#"
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

          <a
            href="/register"
            className="text-muted-foreground block text-center text-sm underline-offset-4 hover:underline"
          >
            Create New Account
          </a>
        </div>
      </form>
    </div>
  );
}
