

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const ProductSchema = z.object({
  title: z.string().min(2).max(120),
  priceInRupees: z.coerce.number().nonnegative(),
  description: z.string().max(1000).optional(),
});

// create product
export async function createProduct(formData: FormData): Promise<void> {
  // 1) read & validate
  const parsed = ProductSchema.safeParse({
    title: formData.get("title"),
    priceInRupees: formData.get("price"),
    description: formData.get("description") || undefined,
  });
  if (!parsed.success) {
    // For now, keep it simple. Later we can show field errors on the page.
    throw new Error("Validation failed");
  }

  const { title, priceInRupees, description } = parsed.data;
  const price = Math.round(priceInRupees * 100); // rupees -> paise

  // 2) write
  await prisma.product.create({
    data: { title, price, description, status: "ACTIVE" },
  });

  // 3) refresh cache & navigate back to the list
  revalidatePath("/products");
  redirect("/products");
}


// update product
export async function updateProduct(formData: FormData): Promise<void> {
  
  const id = Number(formData.get("id"));
  if (!id || Number.isNaN(id)) throw new Error("Invalid id");

  // reuse the same validation, but read from form again
  const parsed = ProductSchema.safeParse({
    title: formData.get("title"),
    priceInRupees: formData.get("price"),
    description: formData.get("description") || undefined,
  });
  if (!parsed.success) throw new Error("Validation failed");

  const { title, priceInRupees, description } = parsed.data;
  const price = Math.round(priceInRupees * 100);

  await prisma.product.update({
    where: { id },
    data: { title, price, description },
  });

  revalidatePath("/products");
  redirect("/products");
}


// delete product
export async function deleteProduct(id: number): Promise<void> {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/products");
}