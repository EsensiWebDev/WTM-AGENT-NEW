"use server";

import { registerSchema, type RegisterResponse } from "./type";

export async function registerAction(
  formData: FormData,
): Promise<RegisterResponse> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Extract form data
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const agentCompany = formData.get("agentCompany") as string;
    const email = formData.get("email") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const username = formData.get("username") as string;
    const kakaoTalkId = formData.get("kakaoTalkId") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Handle file uploads
    const agentSelfiePhoto = formData.get("agentSelfiePhoto") as File;
    const identityCard = formData.get("identityCard") as File;
    const certificate = formData.get("certificate") as File | null;
    const nameCard = formData.get("nameCard") as File;

    // Validate the data
    const validationResult = registerSchema.safeParse({
      firstName,
      lastName,
      agentCompany,
      email,
      phoneNumber,
      username,
      kakaoTalkId,
      password,
      confirmPassword,
      agentSelfiePhoto,
      identityCard,
      certificate: certificate || undefined,
      nameCard,
    });

    if (!validationResult.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validationResult.error.errors,
      };
    }

    // Here you would typically:
    // 1. Check if email/username already exists
    // 2. Hash the password
    // 3. Upload files to storage
    // 4. Save user data to database
    // 5. Send verification email

    // Simulate checking if user already exists
    if (email === "existing@example.com") {
      return {
        success: false,
        message: "User with this email already exists",
      };
    }

    console.log({
      id: "user_" + Date.now(),
      email: email,
      firstName: firstName,
      lastName: lastName,
      username: username,
      phoneNumber: phoneNumber,
      kakaoTalkId: kakaoTalkId,
      agentCompany: agentCompany,
    });

    // Simulate successful registration
    return {
      success: true,
      message:
        "Registration successful! Please check your email for verification.",
      user: {
        id: "user_" + Date.now(),
        email: email,
        firstName: firstName,
        lastName: lastName,
        username: username,
        phoneNumber: phoneNumber,
        kakaoTalkId: kakaoTalkId,
        agentCompany: agentCompany,
      },
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "An error occurred during registration. Please try again.",
    };
  }
}
