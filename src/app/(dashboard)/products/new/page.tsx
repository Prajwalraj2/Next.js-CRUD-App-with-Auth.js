import { createProduct } from "../actions";
import { getCurrentUser } from "@/session";
import { redirect } from "next/navigation";

export default async function NewProductPage() {
  const user = await getCurrentUser();

  // Page-level auth check (backup protection + better UX)
  if (!user) {
    redirect("/login");
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
          <p className="text-gray-600 mt-2">Add a new product to your inventory</p>
        </div>

        {/* This posts to the server action directly */}
        <form action={createProduct} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Title
            </label>
            <input
              name="title"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="e.g., Mechanical Keyboard"
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
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="4999.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Product description, features, specifications..."
              rows={4}
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <a
              href="/products"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              ← Back to Products
            </a>
            
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              Create Product
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
