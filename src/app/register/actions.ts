"use server";

import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { z } from "zod";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";

const RegisterSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80, "Name too long"),
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function registerAction(formData: FormData): Promise<void> {
  const parsed = RegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const err = parsed.error.flatten().fieldErrors;
    const msg =
      err.name?.[0] || err.email?.[0] || err.password?.[0] || "Invalid input";
    redirect(`/register?error=${encodeURIComponent(msg)}`);
  }

  const { name, email, password } = parsed.data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    redirect(`/register?error=${encodeURIComponent("Email already in use")}`);
  }

  const passwordHash = await hash(password, 10);
  await prisma.user.create({ data: { name, email, passwordHash } });

  // Auto sign-in with credentials; this will redirect server-side
  await signIn("credentials", { email, password, redirectTo: "/user" });

  // Fallback (shouldn’t run if signIn redirected)
  redirect("/user");
}
