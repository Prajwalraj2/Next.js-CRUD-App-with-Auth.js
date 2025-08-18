"use client";

import { deleteProduct } from "@/app/(dashboard)/products/actions";

interface DeleteProductButtonProps {
  productId: number;
  productTitle: string;
}

export default function DeleteProductButton({ productId, productTitle }: DeleteProductButtonProps) {
  const handleDelete = async () => {
    const confirmed = confirm(`Are you sure you want to delete "${productTitle}"?`);
    if (confirmed) {
      await deleteProduct(productId);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="rounded bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 text-sm font-medium transition-colors"
    >
      Delete
    </button>
  );
}
