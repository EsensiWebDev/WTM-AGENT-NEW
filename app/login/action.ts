"use server";

import { LoginSchema } from "@/components/login/login-form";

export async function loginAction(input: LoginSchema) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log({ input });

  return {
    success: false,
    message: "Invalid email or password",
    user: null,
  };

  // // Check if password is correct
  // if (password === "abc123!@#") {
  //   // Return success response
  //   return {
  //     success: true,
  //     message: "Login successful",
  //     user: {
  //       id: "riza11",
  //       email: email,
  //       name: "admin dummy",
  //     },
  //   };
  // } else {
  //   // Return error response
  //   return {
  //     success: false,
  //     message: "Invalid email or password",
  //     user: null,
  //   };
  // }
}
