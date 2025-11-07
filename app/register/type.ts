import { z } from "zod";

// Validation schema for register form
export const registerSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    agentCompany: z.string().optional(),
    email: z.string().email("Please enter a valid email"),
    phoneNumber: z
      .string()
      .min(8, "Phone number must be at least 8 characters")
      .regex(
        /^\+\d+$/,
        "Phone number must start with a country code (e.g., +62) followed by digits only",
      ),
    username: z.string().min(1, "Username is required"),
    kakaoTalkId: z.string().min(1, "KakaoTalk ID is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agentSelfiePhoto: z.union([
      z
        .instanceof(File)
        .refine((file) => file.size > 0, "Agent selfie photo is required")
        .refine(
          (file) => file.size <= 1024 * 1024,
          "Image must be less than 1MB",
        ),
      z.undefined().refine(() => false, "Agent selfie photo is required"),
    ]),
    identityCard: z.union([
      z
        .instanceof(File)
        .refine((file) => file.size > 0, "Identity card is required")
        .refine(
          (file) => file.size <= 1024 * 1024,
          "Image must be less than 1MB",
        ),
      z.undefined().refine(() => false, "Identity card is required"),
    ]),
    certificate: z
      .instanceof(File)
      .refine((file) => file.size <= 1024 * 1024, "Image must be less than 1MB")
      .optional()
      .or(z.undefined()),
    nameCard: z.union([
      z
        .instanceof(File)
        .refine((file) => file.size > 0, "Name card is required")
        .refine(
          (file) => file.size <= 1024 * 1024,
          "Image must be less than 1MB",
        ),
      z.undefined().refine(() => false, "Name card is required"),
    ]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;

export interface RegisterResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
    username: string;
    phoneNumber: string;
    kakaoTalkId: string;
    agentCompany?: string;
  };
  errors?: z.ZodError["errors"];
}
