// src/app/domains/[domain]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ domain: string }> }; // Next 15 async params

export default async function DomainPage({ params }: Props) {
  const { domain } = await params;

  const data = await prisma.domain.findUnique({
    where: { slug: domain },
    include: {
      subCategories: {
        where: { isPublic: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!data || !data.isPublic) return notFound();

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">{data.name}</h1>

      {data.subCategories.length === 0 ? (
        <p className="opacity-75">No sub‑categories yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
            {data.subCategories.map((sc) => (
            <Link
              key={sc.id}
              href={`/domains/${data.slug}/${sc.slug}`}
              className="rounded-2xl border p-4 hover:opacity-90"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{sc.name}</h2>
                <span className="text-xs opacity-60">#{sc.order}</span>
              </div>
              <p className="text-sm opacity-80 mt-1">
                View modules inside “{sc.name}”
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
