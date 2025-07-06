"use server";

export async function loginAction(formData: FormData) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Check if password is correct
  if (password === "abc123!@#") {
    // Return success response
    return {
      success: true,
      message: "Login successful",
      user: {
        id: "riza11",
        email: email,
        name: "admin dummy",
      },
    };
  } else {
    // Return error response
    return {
      success: false,
      message: "Invalid email or password",
      user: null,
    };
  }
}
