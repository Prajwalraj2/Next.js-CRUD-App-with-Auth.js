import Link from "next/link";
import { prisma } from "@/lib/prisma";

// Keep it dynamic for now so admin edits show immediately.
// You can switch to `export const revalidate = 60` later for ISR.
export const dynamic = "force-dynamic";

export default async function DomainsPage() {
  const domains = await prisma.domain.findMany({
    where: { isPublic: true },
    orderBy: { order: "asc" },
  });

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Domains</h1>

      {domains.length === 0 ? (
        <p className="text-neutral-600">No domains yet.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {domains.map((d) => (
            <li key={d.id} className="border rounded-xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-medium">{d.name}</h2>
                  {!d.isPublic && (
                    <span className="text-xs bg-neutral-200 rounded-full px-2 py-0.5 ml-1">
                      Private
                    </span>
                  )}
                </div>
                <span className="text-xs text-neutral-500">#{d.order}</span>
              </div>

              <div className="mt-3">
                <Link
                  href={`/domains/${d.slug}`}
                  className="underline text-sm"
                >
                  View details
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
