// src/app/admin/products/page.tsx
import { listAllProducts, adminDeleteProduct } from "./actions";

export default async function AdminProductsPage() {
  const items = await listAllProducts();
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">All Products</h1>
      <ul className="space-y-2">
        {items.map(p => (
          <li key={p.id} className="border p-3 rounded">
            <div className="font-medium">{p.title} — ₹{(p.price/100).toFixed(2)}</div>
            <div className="text-sm text-gray-600">Owner: {p.owner?.email ?? p.ownerId}</div>
            <form action={async () => { "use server"; await adminDeleteProduct(p.id); }}>
              <button className="text-red-600 underline mt-1">Delete</button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}