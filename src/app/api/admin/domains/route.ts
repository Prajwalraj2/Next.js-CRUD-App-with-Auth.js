import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { slugify } from "@/lib/slug";
import { requireAdmin } from "@/lib/admin-auth";

const CreateSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  order: z.number().int().optional(),
  isPublic: z.boolean().optional(),
});

export async function GET(req: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return NextResponse.json({ error: admin.message }, { status: admin.status });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "20");

  const where = q
    ? { OR: [{ name: { contains: q, mode: "insensitive" as const } }, { slug: { contains: q, mode: "insensitive" as const } }] }
    : {};

  const [items, total] = await Promise.all([
    prisma.domain.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.domain.count({ where }),
  ]);

  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return NextResponse.json({ error: admin.message }, { status: admin.status });

  const body = await req.json().catch(() => ({}));
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { name, slug, order = 0, isPublic = true } = parsed.data;
  const toSlug = slug ? slugify(slug) : slugify(name);

  const created = await prisma.domain.create({
    data: { name, slug: toSlug, order, isPublic },
  });

  return NextResponse.json(created, { status: 201 });
}
