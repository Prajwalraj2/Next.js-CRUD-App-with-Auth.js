import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { updateProduct } from "../../actions";
import { getCurrentUser } from "@/session";

// Next 15: params is async
type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const user = await getCurrentUser();

  // Page-level auth check (backup protection + better UX)
  if (!user) {
    redirect("/login");
  }

  const { id: idParam } = await params;   // ✅ await params once
  const id = Number(idParam);             // ✅ use the awaited value
  if (!id || Number.isNaN(id)) notFound();

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <main className="max-w-2xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600 mt-2">Update product information</p>
        </div>

        <form action={updateProduct} className="space-y-6">
          <input type="hidden" name="id" value={product.id} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Title
            </label>
            <input
              name="title"
              defaultValue={product.title}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (₹)
            </label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              defaultValue={(product.price / 100).toFixed(2)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              defaultValue={product.description ?? ""}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={4}
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <a
              href={`/products/${product.id}`}
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              ← Back to Product
            </a>
            
            <div className="flex space-x-3">
              <a
                href="/products"
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
              >
                Cancel
              </a>
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
