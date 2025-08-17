"use server";

import { signIn } from "@/auth";

export async function loginWithCredentials(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  // Rely on NextAuth credentials authorize() to validate
  await signIn("credentials", {
    email,
    password,
    redirectTo: "/user",
  });
}
