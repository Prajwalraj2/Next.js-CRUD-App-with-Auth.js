// src/app/domains/[domain]/[sub]/[module]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ domain: string; sub: string; module: string }> };

export default async function ModulePage({ params }: Props) {
  const { domain, sub, module } = await params;

  const mod = await prisma.resourceModule.findFirst({
    where: {
      slug: module,
      isPublic: true,
      subCategory: {
        slug: sub,
        isPublic: true,
        domain: { slug: domain, isPublic: true },
      },
    },
    include: {
      subCategory: { include: { domain: true } },
    },
  });

  if (!mod) return notFound();

  const d = mod.subCategory.domain;
  const sc = mod.subCategory;

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="text-sm opacity-70">
        <Link href="/domains" className="underline">Domains</Link>
        {" / "}
        <Link href={`/domains/${d.slug}`} className="underline">{d.name}</Link>
        {" / "}
        <Link href={`/domains/${d.slug}/${sc.slug}`} className="underline">{sc.name}</Link>
        {" / "}
        <span>{mod.title}</span>
      </div>

      <h1 className="text-3xl font-bold">{mod.title}</h1>
      {mod.summary && <p className="opacity-80">{mod.summary}</p>}

      <div className="rounded-2xl border p-6">
        <p className="opacity-70">
          Module content coming next: blocks (TEXT/CARD/COLLAPSIBLE/VIDEO/IMAGE/LINKLIST) and TABLE renderer.
        </p>
      </div>
    </main>
  );
}
