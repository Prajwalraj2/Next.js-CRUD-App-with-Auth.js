import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { slugify } from "@/lib/slug";
import { requireAdmin } from "@/lib/admin-auth";

const CreateSchema = z.object({
  domainId: z.string().min(1),
  name: z.string().min(2),
  slug: z.string().optional(),
  order: z.number().int().optional(),
  isPublic: z.boolean().optional(),
});

export async function GET(req: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return NextResponse.json({ error: admin.message }, { status: admin.status });

  const { searchParams } = new URL(req.url);
  const domainId = searchParams.get("domainId") ?? undefined;

  const where = domainId ? { domainId } : {};
  const items = await prisma.subCategory.findMany({
    where,
    orderBy: [{ domainId: "asc" }, { order: "asc" }],
    include: { domain: true },
  });

  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return NextResponse.json({ error: admin.message }, { status: admin.status });

  const body = await req.json().catch(() => ({}));
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { domainId, name, slug, order = 0, isPublic = true } = parsed.data;
  const toSlug = slug ? slugify(slug) : slugify(name);

  const created = await prisma.subCategory.create({
    data: { domainId, name, slug: toSlug, order, isPublic },
  });

  return NextResponse.json(created, { status: 201 });
}
