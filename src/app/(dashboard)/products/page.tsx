import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/session";
import DeleteProductButton from "@/components/delete-product-button";

export default async function ProductsPage() {
  const user = await getCurrentUser();
  const products = await prisma.product.findMany({ 
    orderBy: { createdAt: "desc" },
    include: {
      owner: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });

  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        {user && (
          <Link
            href="/products/new"
            className="rounded bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-medium transition-colors"
          >
            New Product
          </Link>
        )}
      </div>

      <ul className="space-y-2">
        {products.map((p) => {
          // Check if current user owns this product
          const isOwner = user && (user as any).id === p.ownerId;
          
          return (
            <li key={p.id} className="rounded border p-3 bg-white shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Link href={`/products/${p.id}`} className="font-medium hover:underline text-lg text-gray-900">
                    {p.title}
                  </Link>
                  <div className="text-sm text-gray-600 mt-1">
                    ₹{(p.price / 100).toFixed(2)} • {p.status}
                  </div>
                  {p.description && (
                    <div className="text-sm text-gray-700 mt-2">{p.description}</div>
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    By: {p.owner.name || p.owner.email}
                  </div>
                </div>

                {/* Only show edit/delete buttons if user owns the product */}
                {isOwner && (
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/products/${p.id}/edit`}
                      className="rounded bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 text-sm font-medium transition-colors"
                    >
                      Edit
                    </Link>
                    
                    {/* Delete with confirmation */}
                    <DeleteProductButton productId={p.id} productTitle={p.title} />
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {products.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No products found</p>
          {user && (
            <Link
              href="/products/new"
              className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              Create Your First Product
            </Link>
          )}
        </div>
      )}
    </main>
  );
}
