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

const profileSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  agent_company: z.string().optional(),
  email: z.string().email("Please enter a valid email").optional(), // Display only field
  phone: z
    .string()
    .min(8, "Phone number must be at least 8 characters")
    .regex(
      /^\+\d+$/,
      "Phone number must start with a country code (e.g., +62) followed by digits only",
    )
    .optional(),
  kakao_talk_id: z.string().min(1, "KakaoTalk ID is required"),
});

export type ProfileSchema = z.infer<typeof profileSchema>;

interface EditProfileFormProps {
  defaultValues: AccountProfile;
}

const EditProfileForm = ({ defaultValues }: EditProfileFormProps) => {
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

  function onSubmit(values: ProfileSchema) {
    setIsLoading(true);
    toast.promise(updateAccountProfile(values), {
      loading: "Saving profile changes...",
      success: (data) => {
        queryClient.invalidateQueries({
          queryKey: ["profile"],
        });
        setIsLoading(false);
        return data.message || "Profile updated successfully";
      },
      error: (error) => {
        setIsLoading(false);
        return error.message || "Failed to update profile";
      },
    });
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
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="text-sm font-medium">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter phone number"
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
