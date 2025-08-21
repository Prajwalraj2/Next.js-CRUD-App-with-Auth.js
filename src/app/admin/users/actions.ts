// src/app/admin/users/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const s = await auth();
  if (s?.user?.role !== "ADMIN") throw new Error("FORBIDDEN");
}

export async function listUsers() {
  await requireAdmin();
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function setRole(userId: string, role: "USER" | "ADMIN") {
  await requireAdmin();
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
}
