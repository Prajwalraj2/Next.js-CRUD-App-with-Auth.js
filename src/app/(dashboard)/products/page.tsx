import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteProduct } from "./actions";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link
          href="/products/new"
          className="rounded bg-white/10 px-3 py-2 hover:bg-white/20"
        >
          New
        </Link>
      </div>

      <ul className="space-y-2">
        {products.map((p) => (
          <li key={p.id} className="rounded border p-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                {/* <div className="font-medium">{p.title}</div> */}
                <Link href={`/products/${p.id}`} className="font-medium hover:underline">
                  {p.title}
                </Link>
                <div className="text-sm opacity-80">
                  ₹{(p.price / 100).toFixed(2)} • {p.status}
                </div>
                {p.description && <div className="text-sm mt-1">{p.description}</div>}
              </div>

              <div className="flex items-center gap-2">
                <Link
                    href={`/products/${p.id}/edit`}
                    className="rounded bg-white/10 px-3 py-1 text-sm hover:bg-white/20"
                >
                    Edit
                </Link>
              {/* Delete via server action */}
              <form action={deleteProduct.bind(null, p.id)}>
                <button
                  type="submit"
                  className="rounded bg-red-600/80 px-3 py-1 text-sm hover:bg-red-600 cursor-pointer"
                >
                  Delete
                </button>
              </form>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {products.length === 0 && (
        <pre className="text-sm bg-gray-100 p-3 rounded text-black">[]</pre>
      )}
    </main>
  );
}
