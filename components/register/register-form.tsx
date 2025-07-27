"use client";

import { registerAction } from "@/app/register/action";
import { registerSchema, type RegisterSchema } from "@/app/register/type";
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

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      agentCompany: "",
      email: "",
      phoneNumber: "",
      username: "",
      kakaoTalkId: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(input: RegisterSchema) {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("firstName", input.firstName);
        formData.append("lastName", input.lastName || "");
        formData.append("agentCompany", input.agentCompany || "");
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("username", input.username);
        formData.append("kakaoTalkId", input.kakaoTalkId);
        formData.append("password", input.password);
        formData.append("confirmPassword", input.confirmPassword);
        if (input.agentSelfiePhoto) {
          formData.append("agentSelfiePhoto", input.agentSelfiePhoto);
        }
        if (input.identityCard) {
          formData.append("identityCard", input.identityCard);
        }
        if (input.certificate) {
          formData.append("certificate", input.certificate);
        }
        if (input.nameCard) {
          formData.append("nameCard", input.nameCard);
        }

        const result = await registerAction(formData);

        if (result.success) {
          toast.success(result.message || "Registration successful!");
          router.push("/login");
        } else {
          toast.error(
            result.message || "Registration failed. Please try again.",
          );
        }
      } catch (err) {
        console.error("Registration error:", err);
        toast.error("An error occurred. Please try again.");
      }
    });
  }

  const handleFileChange =
    (field: keyof RegisterSchema) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        form.setValue(field, file);
      }
    };

  return (
    <div className={cn("w-full max-w-2xl space-y-8", className)} {...props}>
      <div className="text-center">
        <Image
          src="/hb_logo.png"
          alt="THE HOTEL BOX Logo"
          width={144}
          height={144}
          className="mx-auto h-36 w-auto"
        />
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Join THE HOTEL BOX as an agent
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Personal Information
            </h3>

            <div>
              <Label htmlFor="firstName">
                First Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                type="text"
                className="mt-1 bg-gray-200 text-black"
                placeholder="Enter your first name"
                {...form.register("firstName")}
                disabled={isPending}
              />
              {form.formState.errors.firstName && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                className="mt-1 bg-gray-200 text-black"
                placeholder="Enter your last name"
                {...form.register("lastName")}
                disabled={isPending}
              />
            </div>

            <div>
              <Label htmlFor="agentCompany">Agent Company</Label>
              <Input
                id="agentCompany"
                type="text"
                className="mt-1 bg-gray-200 text-black"
                placeholder="Enter your company name"
                {...form.register("agentCompany")}
                disabled={isPending}
              />
            </div>

            <div>
              <Label htmlFor="email">
                Email<span className="text-red-500">*</span>
              </Label>
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
              <Label htmlFor="phoneNumber">
                Phone Number<span className="text-red-500">*</span>
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                className="mt-1 bg-gray-200 text-black"
                placeholder="Enter your phone number"
                {...form.register("phoneNumber")}
                disabled={isPending}
              />
              {form.formState.errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.phoneNumber.message}
                </p>
              )}
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Account Information
            </h3>

            <div>
              <Label htmlFor="username">
                Username<span className="text-red-500">*</span>
              </Label>
              <Input
                id="username"
                type="text"
                className="mt-1 bg-gray-200 text-black"
                placeholder="Choose a username"
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
              <Label htmlFor="kakaoTalkId">
                KakaoTalk ID<span className="text-red-500">*</span>
              </Label>
              <Input
                id="kakaoTalkId"
                type="text"
                className="mt-1 bg-gray-200 text-black"
                placeholder="Enter your KakaoTalk ID"
                {...form.register("kakaoTalkId")}
                disabled={isPending}
              />
              {form.formState.errors.kakaoTalkId && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.kakaoTalkId.message}
                </p>
              )}
            </div>

            <div>
              <PasswordInput
                id="password"
                label="Password *"
                className="mt-1 bg-gray-200 text-black"
                placeholder="Create a password"
                {...form.register("password")}
                disabled={isPending}
                error={form.formState.errors.password?.message}
              />
            </div>

            <div>
              <PasswordInput
                id="confirmPassword"
                label="Confirm Password *"
                className="mt-1 bg-gray-200 text-black"
                placeholder="Confirm your password"
                {...form.register("confirmPassword")}
                disabled={isPending}
                error={form.formState.errors.confirmPassword?.message}
              />
            </div>
          </div>
        </div>

        {/* Document Uploads */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Required Documents
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="agentSelfiePhoto">
                Agent Selfie Photo<span className="text-red-500">*</span>
              </Label>
              <div className="mt-1">
                <Input
                  id="agentSelfiePhoto"
                  type="file"
                  accept="image/*"
                  className="bg-gray-200 text-black"
                  onChange={handleFileChange("agentSelfiePhoto")}
                  disabled={isPending}
                />
              </div>
              {form.formState.errors.agentSelfiePhoto && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.agentSelfiePhoto.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="identityCard">
                Identity Card<span className="text-red-500">*</span>
              </Label>
              <div className="mt-1">
                <Input
                  id="identityCard"
                  type="file"
                  accept="image/*"
                  className="bg-gray-200 text-black"
                  onChange={handleFileChange("identityCard")}
                  disabled={isPending}
                />
              </div>
              {form.formState.errors.identityCard && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.identityCard.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="certificate">Certificate</Label>
              <div className="mt-1">
                <Input
                  id="certificate"
                  type="file"
                  accept="image/*"
                  className="bg-gray-200 text-black"
                  onChange={handleFileChange("certificate")}
                  disabled={isPending}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="nameCard">
                Name Card<span className="text-red-500">*</span>
              </Label>
              <div className="mt-1">
                <Input
                  id="nameCard"
                  type="file"
                  accept="image/*"
                  className="bg-gray-200 text-black"
                  onChange={handleFileChange("nameCard")}
                  disabled={isPending}
                />
              </div>
              {form.formState.errors.nameCard && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.nameCard.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Creating account..." : "Create Account"}
          </Button>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Already have an account?{" "}
            </span>
            <a
              href="/login"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
