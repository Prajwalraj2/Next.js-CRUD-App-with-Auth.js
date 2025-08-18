// src/app/myproducts/page.tsx
import Link from "next/link";
import { listMyProducts, deleteProduct } from "@/app/(dashboard)/products/actions";

export default async function MyProductsPage({ searchParams }: { searchParams?: { q?: string; page?: string } }) {
  const q = (await searchParams)?.q ?? "";
  const page = Number((await searchParams)?.page ?? 1);

  const { items, total, pageSize } = await listMyProducts({ q, page });

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Products</h1>
        <Link className="rounded px-3 py-2 bg-blue-600 text-white" href="/products/new">New Product</Link>
      </div>

      <form className="mb-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search my products…"
          className="border rounded px-3 py-2 w-full max-w-md"
        />
      </form>

      <ul className="divide-y border rounded">
        {items.map((p) => (
          <li key={p.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{p.title}</div>
              {p.description && <div className="text-sm text-gray-500">{p.description}</div>}
            </div>
            <div className="flex gap-2">
              <Link className="px-3 py-1 rounded border" href={`/products/${p.id}/edit`}>Edit</Link>
              <form
                action={async () => {
                  "use server";
                  await deleteProduct(p.id);
                }}
              >
                <button className="px-3 py-1 rounded border text-red-600">Delete</button>
              </form>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex gap-3 pt-2">
        {page > 1 && <Link href={`/myproducts?page=${page - 1}&q=${encodeURIComponent(q)}`}>Prev</Link>}
        {page * pageSize < total && (
          <Link href={`/myproducts?page=${page + 1}&q=${encodeURIComponent(q)}`}>Next</Link>
        )}
      </div>
    </main>
  );
}
