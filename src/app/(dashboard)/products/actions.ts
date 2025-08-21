// src/app/(dashboard)/products/actions.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// const requireUserId = async (): Promise<string> => {
//   const session = await auth();
//   const id = session?.user?.id;
//   if (!id) throw new Error("UNAUTHENTICATED");
//   return id;
// };

const requireUser = async () => {
  const s = await auth();
  if (!s?.user?.id) throw new Error("UNAUTHENTICATED");
  return { id: s.user.id, role: s.user.role ?? "USER" as "USER" | "ADMIN" };
};

// export async function createProduct(formData: FormData) {
//   const userId = await requireUserId();
  
//   // Extract and validate form data
//   const title = formData.get("title") as string;
//   const priceStr = formData.get("price") as string;
//   const description = formData.get("description") as string || undefined;
  
//   if (!title || !priceStr) {
//     throw new Error("Title and price are required");
//   }
  
//   const priceInRupees = parseFloat(priceStr);
//   if (isNaN(priceInRupees) || priceInRupees < 0) {
//     throw new Error("Invalid price");
//   }
  
//   const price = Math.round(priceInRupees * 100); // Convert to paise
  
//   const product = await prisma.product.create({
//     data: {
//       title,
//       description,
//       price,
//       status: "ACTIVE",
//       ownerId: userId,              // ← attach owner
//     },
//   });
  
//   revalidatePath("/myproducts");
//   revalidatePath("/products");
  
//   // Redirect to the products list after successful creation
//   redirect("/products");
// }

export async function createProduct(formData: FormData) {
  const { id } = await requireUser();
  const title = String(formData.get("title") ?? "");
  const priceStr = String(formData.get("price") ?? "");
  const description = (formData.get("description") as string) || undefined;

  if (!title || !priceStr) throw new Error("Title and price are required");
  const price = Math.round(Number(priceStr) * 100);
  if (!Number.isFinite(price) || price < 0) throw new Error("Invalid price");

  await prisma.product.create({
    data: { title, description, price, status: "ACTIVE", ownerId: id },
  });

  revalidatePath("/myproducts");
  revalidatePath("/products");
  redirect("/products");
}

// export async function updateProduct(formData: FormData) {
//   const userId = await requireUserId();
  
//   // Extract form data
//   const idStr = formData.get("id") as string;
//   const title = formData.get("title") as string;
//   const priceStr = formData.get("price") as string;
//   const description = formData.get("description") as string || undefined;
  
//   const id = parseInt(idStr);
//   if (!id || isNaN(id)) {
//     throw new Error("Invalid product ID");
//   }
  
//   if (!title || !priceStr) {
//     throw new Error("Title and price are required");
//   }
  
//   const priceInRupees = parseFloat(priceStr);
//   if (isNaN(priceInRupees) || priceInRupees < 0) {
//     throw new Error("Invalid price");
//   }
  
//   const price = Math.round(priceInRupees * 100); // Convert to paise

//   // guard: must own the product
//   const owned = await prisma.product.findFirst({ where: { id, ownerId: userId } });
//   if (!owned) throw new Error("FORBIDDEN");

//   const product = await prisma.product.update({ 
//     where: { id }, 
//     data: { title, description, price } 
//   });
  
//   revalidatePath("/myproducts");
//   revalidatePath("/products");
//   redirect("/products");
// }

export async function updateProduct(formData: FormData) {
  const { id: userId, role } = await requireUser();

  const idStr = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "");
  const priceStr = String(formData.get("price") ?? "");
  const description = (formData.get("description") as string) || undefined;

  const id = Number(idStr);
  if (!Number.isInteger(id)) throw new Error("Invalid product ID");
  if (!title || !priceStr) throw new Error("Title and price are required");

  const price = Math.round(Number(priceStr) * 100);
  if (!Number.isFinite(price) || price < 0) throw new Error("Invalid price");

  // owner or admin may proceed
  const p = await prisma.product.findUnique({ where: { id } });
  if (!p) throw new Error("Not found");
  if (role !== "ADMIN" && p.ownerId !== userId) throw new Error("FORBIDDEN");

  await prisma.product.update({ where: { id }, data: { title, description, price } });
  revalidatePath("/myproducts");
  revalidatePath("/products");
  redirect("/products");
}

// export async function deleteProduct(id: number) {
//   const userId = await requireUserId();

//   const owned = await prisma.product.findFirst({ where: { id, ownerId: userId } });
//   if (!owned) throw new Error("FORBIDDEN");

//   await prisma.product.delete({ where: { id } });
//   revalidatePath("/myproducts");
//   revalidatePath("/products");
// }

export async function deleteProduct(id: number) {
  const { id: userId, role } = await requireUser();

  const p = await prisma.product.findUnique({ where: { id } });
  if (!p) throw new Error("Not found");
  if (role !== "ADMIN" && p.ownerId !== userId) throw new Error("FORBIDDEN");

  await prisma.product.delete({ where: { id } });
  revalidatePath("/myproducts");
  revalidatePath("/products");
}

export async function listMyProducts(params?: {
  q?: string;
  page?: number;
  pageSize?: number;
}) {
  const { id: userId, role } = await requireUser();

  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 10;
  const q = params?.q?.trim();

  const where = {
    ownerId: userId,
    ...(q && {
      OR: [
        { title: { contains: q, mode: "insensitive" as const } },
        { description: { contains: q, mode: "insensitive" as const } },
      ],
    }),
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total, page, pageSize };
}
