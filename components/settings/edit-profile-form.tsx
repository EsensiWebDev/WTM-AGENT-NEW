"use client";

import { updateAccountProfile } from "@/app/(protected)/settings/actions";
import { AccountProfile } from "@/app/(protected)/settings/types";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Option } from "@/types/data-table";
import { usePhoneInput } from "@/hooks/use-phone-input";
import React from "react";
import { PhoneInput } from "../ui/phone-input";

const profileSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  agent_company: z.string().optional(),
  email: z.string().email("Please enter a valid email").optional(), // Display only field
  phone: z
    .string()
    .min(8, "Phone number must be at least 8 characters")
    .max(15, "Phone number must be at most 15 characters"),
  kakao_talk_id: z.string().min(1, "KakaoTalk ID is required"),
});

export type ProfileSchema = z.infer<typeof profileSchema>;

interface EditProfileFormProps {
  defaultValues: AccountProfile;
  countryOptions: Option[];
}

const EditProfileForm = ({
  defaultValues,
  countryOptions,
}: EditProfileFormProps) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: defaultValues?.full_name || "",
      agent_company: defaultValues?.agent_company || "",
      email: defaultValues?.email || "",
      phone: defaultValues?.phone || "",
      kakao_talk_id: defaultValues?.kakao_talk_id || "",
    },
  });

  const phoneInput = usePhoneInput({
    initialPhone: defaultValues.phone || "",
    countryOptions,
  });

  async function onSubmit(values: ProfileSchema) {
    setIsLoading(true);
    try {
      const response = await updateAccountProfile(values);
      if (response.success) {
        queryClient.invalidateQueries({
          queryKey: ["profile"],
        });
        toast.success(response.message || "Profile updated successfully");
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="text-sm font-medium">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter first name"
                      className="bg-gray-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="agent_company"
              disabled
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="text-sm font-medium">
                    Agent Company
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      readOnly
                      placeholder="Enter agent company"
                      className="bg-gray-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="text-sm font-medium">E-mail</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      className="bg-gray-200"
                      disabled
                      readOnly
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
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
                        disabled
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
            <FormField
              control={form.control}
              name="kakao_talk_id"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="text-sm font-medium">
                    KakaoTalk.id
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter KakaoTalk ID"
                      className="bg-gray-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className="mt-2" type="submit" disabled={isLoading}>
            {isLoading && (
              <Loader
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditProfileForm;
