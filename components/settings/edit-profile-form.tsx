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
import { Loader } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const profileSchema = z.object({
  username: z.string().min(1, "Username is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  agentCompany: z.string().min(1, "Agent company is required"),
  email: z.string().optional(), // Display only field
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^(\+62|62|0)?8[1-9][0-9]{6,9}$/,
      "Please enter a valid phone number",
    ),
  kakaoTalkId: z.string().min(1, "KakaoTalk ID is required"),
});

type ProfileSchema = z.infer<typeof profileSchema>;

interface EditProfileFormProps {
  defaultValues: AccountProfile;
}

const EditProfileForm = ({ defaultValues }: EditProfileFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: defaultValues.username,
      firstName: defaultValues.firstName,
      lastName: defaultValues.lastName,
      agentCompany: defaultValues.agentCompany,
      email: defaultValues.email || "",
      phoneNumber: defaultValues.phoneNumber,
      kakaoTalkId: defaultValues.kakaoTalkId || "",
    },
  });

  function onSubmit(values: ProfileSchema) {
    setIsLoading(true);
    // Exclude email from submission as it's display-only
    const { email, ...submitValues } = values;
    toast.promise(updateAccountProfile(submitValues), {
      loading: "Saving profile changes...",
      success: (data) => {
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
              name="username"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="text-sm font-medium">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter username"
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
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    First Name
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
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Last Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter last name"
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
              name="agentCompany"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="text-sm font-medium">
                    Agent Company
                  </FormLabel>
                  <FormControl>
                    <Input
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
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="text-sm font-medium">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter phone number"
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
              name="kakaoTalkId"
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
