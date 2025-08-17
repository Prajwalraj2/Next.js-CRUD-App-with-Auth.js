import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

// Next 15: params is async
type Props = { params: Promise<{ id: string }> };

export default async function ProductDetailPage({ params }: Props) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!id || Number.isNaN(id)) notFound();

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <main className="p-6 space-y-3 max-w-2xl">
      <h1 className="text-2xl font-semibold">{product.title}</h1>

      <div className="text-sm opacity-80">
        Status: <span className="font-medium">{product.status}</span>
      </div>

      <div className="text-lg">
        Price: <span className="font-semibold">₹{(product.price / 100).toFixed(2)}</span>
      </div>

      {product.description && (
        <p className="text-sm leading-6 opacity-90 mt-2">{product.description}</p>
      )}

      <hr className="my-4 opacity-20" />

      <div className="text-xs opacity-70">
        Created: {new Date(product.createdAt).toLocaleString()} <br />
        Updated: {new Date(product.updatedAt).toLocaleString()}
      </div>

      <div className="mt-4 flex gap-3">
        <a
          href={`/products/${product.id}/edit`}
          className="rounded bg-white/10 px-3 py-2 hover:bg-white/20 text-sm"
        >
          Edit
        </a>
        <a href="/products" className="text-sm underline opacity-80">Back to list</a>
      </div>
    </main>
  );
}
