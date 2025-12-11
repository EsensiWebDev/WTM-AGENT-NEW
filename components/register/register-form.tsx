"use client";

import { registerAction } from "@/app/register/action";
import { registerSchema, type RegisterSchema } from "@/app/register/type";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { cn } from "@/lib/utils";
import HBText from "@/public/hb_text.png";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUp, Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Card } from "../ui/card";
import { usePhoneInput } from "@/hooks/use-phone-input";
import { Option } from "@/types/data-table";
import { PhoneInput } from "../ui/phone-input";

export function RegisterForm({
  countryOptions,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  countryOptions: Option[];
}) {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const phoneInput = usePhoneInput({
    initialPhone: "",
    countryOptions,
  });

  // State for image previews
  const [previews, setPreviews] = React.useState({
    agentSelfiePhoto: null as string | null,
    identityCard: null as string | null,
    certificate: null as string | null,
    nameCard: null as string | null,
  });

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
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
        formData.append("full_name", input.fullName);
        formData.append("agent_company", input.agentCompany || "");
        formData.append("email", input.email);
        formData.append("phone", input.phoneNumber);
        formData.append("username", input.username);
        formData.append("kakao_talk_id", input.kakaoTalkId);
        formData.append("password", input.password);
        if (input.agentSelfiePhoto) {
          formData.append("photo_selfie", input.agentSelfiePhoto);
        }
        if (input.identityCard) {
          formData.append("photo_id_card", input.identityCard);
        }
        if (input.certificate) {
          formData.append("certificate", input.certificate);
        }
        if (input.nameCard) {
          formData.append("name_card", input.nameCard);
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

        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews((prev) => ({
            ...prev,
            [field]: reader.result as string,
          }));
        };
        reader.readAsDataURL(file);
      } else {
        // Clear preview if file is removed
        setPreviews((prev) => ({
          ...prev,
          [field]: null,
        }));
        form.setValue(field, undefined as unknown as File);
      }
    };

  // Clean up preview URLs
  React.useEffect(() => {
    return () => {
      Object.values(previews).forEach((preview) => {
        if (preview) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, []);

  // Render thumbnail with placeholder logic
  const renderThumbnail = (preview: string | null, alt: string) => {
    if (preview) {
      return (
        <Image
          src={preview}
          alt={alt}
          width={64}
          height={64}
          className="h-16 w-16 rounded-md object-cover"
        />
      );
    }

    // Default placeholder
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-md bg-gray-200">
        <ImageUp className="h-8 w-8 text-gray-500" />
      </div>
    );
  };

  return (
    <div className={cn("w-full max-w-6xl space-y-8", className)} {...props}>
      <div className="text-center">
        <Image
          src={HBText}
          alt="THE HOTEL BOX Logo"
          width={144}
          height={144}
          className="mx-auto h-11 w-auto"
        />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left side - 2 columns for form fields */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Full Name - Full Width */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>
                        Full Name<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="rounded bg-gray-200 text-black"
                          placeholder="Enter your full name"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Agent Company - Full Width */}
                <FormField
                  control={form.control}
                  name="agentCompany"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Agent Company</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="rounded bg-gray-200 text-black"
                          placeholder="Enter your company name"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email, Phone Number */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>
                        Email<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          className="rounded bg-gray-200 text-black"
                          placeholder="m@example.com"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Phone Number<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          className="rounded bg-gray-200 text-black"
                          placeholder="Enter your phone number"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => {
                    // Update form value when phone input changes
                    React.useEffect(() => {
                      field.onChange(phoneInput.fullPhoneValue);
                    }, [phoneInput.fullPhoneValue]);

                    return (
                      <FormItem className="col-span-2">
                        <FormLabel className="text-sm font-medium">
                          Phone Number<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <PhoneInput
                            classNameCombobox="rounded bg-gray-200 text-black"
                            classNameInput="rounded bg-gray-200 text-black"
                            countryOptions={countryOptions}
                            selectedCountryCode={phoneInput.selectedCountryCode}
                            phoneNumber={phoneInput.phoneNumber}
                            onCountryCodeChange={(code) => {
                              phoneInput.setSelectedCountryCode(code);
                            }}
                            onPhoneNumberChange={(number) => {
                              phoneInput.setPhoneNumber(number);
                            }}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                {/* Username, KakaoTalk ID */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Username<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="rounded bg-gray-200 text-black"
                          placeholder="Choose a username"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="kakaoTalkId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        KakaoTalk ID<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="rounded bg-gray-200 text-black"
                          placeholder="Enter your KakaoTalk ID"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password - Full Width */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>
                        Password<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          className="rounded bg-gray-200 text-black"
                          placeholder="Create a password"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password - Full Width */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>
                        Confirm Password<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          className="rounded bg-gray-200 text-black"
                          placeholder="Confirm your password"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Right side - 1 column for document uploads */}
            <div className="space-y-6">
              <Card className="h-full rounded px-6">
                <FormField
                  control={form.control}
                  name="agentSelfiePhoto"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>
                        Agent Selfie Photo
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {renderThumbnail(
                            previews.agentSelfiePhoto,
                            "Agent selfie preview",
                          )}
                        </div>
                        <div className="flex-grow">
                          <FormControl>
                            <Input
                              type="file"
                              accept="image/*"
                              className="bg-gray-200 text-black"
                              onChange={handleFileChange("agentSelfiePhoto")}
                              disabled={isPending}
                              {...fieldProps}
                            />
                          </FormControl>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="identityCard"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>
                        Identity Card<span className="text-red-500">*</span>
                      </FormLabel>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {renderThumbnail(
                            previews.identityCard,
                            "Identity card preview",
                          )}
                        </div>
                        <div className="flex-grow">
                          <FormControl>
                            <Input
                              type="file"
                              accept="image/*"
                              className="bg-gray-200 text-black"
                              onChange={handleFileChange("identityCard")}
                              disabled={isPending}
                              {...fieldProps}
                            />
                          </FormControl>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="certificate"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Certificate</FormLabel>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {renderThumbnail(
                            previews.certificate,
                            "Certificate preview",
                          )}
                        </div>
                        <div className="flex-grow">
                          <FormControl>
                            <Input
                              type="file"
                              accept="image/*"
                              className="rounded bg-gray-200 text-black"
                              onChange={handleFileChange("certificate")}
                              disabled={isPending}
                              {...fieldProps}
                            />
                          </FormControl>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nameCard"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>
                        Name Card<span className="text-red-500">*</span>
                      </FormLabel>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {renderThumbnail(
                            previews.nameCard,
                            "Name card preview",
                          )}
                        </div>
                        <div className="flex-grow">
                          <FormControl>
                            <Input
                              type="file"
                              accept="image/*"
                              className="rounded bg-gray-200 text-black"
                              onChange={handleFileChange("nameCard")}
                              disabled={isPending}
                              {...fieldProps}
                            />
                          </FormControl>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            <Button type="submit" disabled={isPending} className="rounded">
              {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Creating account..." : "Create Account"}
            </Button>

            <Link
              href="/login"
              className="ml-6 text-sm text-gray-600 hover:underline"
            >
              Already have an account?
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
