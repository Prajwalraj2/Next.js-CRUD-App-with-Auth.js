// src/app/domains/[domain]/[sub]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ domain: string; sub: string }> };

export default async function SubCategoryPage({ params }: Props) {
  const { domain, sub } = await params;

  const sc = await prisma.subCategory.findFirst({
    where: {
      slug: sub,
      isPublic: true,
      domain: { slug: domain, isPublic: true },
    },
    include: {
      domain: true,
      modules: {
        where: { isPublic: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!sc) return notFound();

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-sm opacity-70">
        <Link href="/domains" className="underline">Domains</Link>
        {" / "}
        <Link href={`/domains/${sc.domain.slug}`} className="underline">
          {sc.domain.name}
        </Link>
        {" / "}
        <span>{sc.name}</span>
      </div>

      <h1 className="text-3xl font-bold">{sc.name}</h1>

      {sc.modules.length === 0 ? (
        <p className="opacity-75">No modules yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {sc.modules.map((m) => (
            <Link
              key={m.id}
              href={`/domains/${sc.domain.slug}/${sc.slug}/${m.slug}`}
              className="rounded-2xl border p-4 hover:opacity-90"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{m.title}</h2>
                <span className="text-xs opacity-60">#{m.order}</span>
              </div>
              {m.summary && (
                <p className="text-sm opacity-80 mt-1 line-clamp-2">
                  {m.summary}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
