// src/app/admin/products/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const s = await auth();
  if (s?.user?.role !== "ADMIN") throw new Error("FORBIDDEN");
}

export async function listAllProducts() {
  await requireAdmin();
  return prisma.product.findMany({
    include: { owner: { select: { id: true, email: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function adminDeleteProduct(id: number) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
}
