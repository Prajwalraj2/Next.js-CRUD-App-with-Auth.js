import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { slugify } from "@/lib/slug";
import { requireAdmin } from "@/lib/admin-auth";

const CreateSchema = z.object({
  subCategoryId: z.string().min(1),
  title: z.string().min(2),
  slug: z.string().optional(),
  summary: z.string().optional(),
  kind: z.enum(["MIXED", "TABLE", "CONTENT"]).optional(),
  order: z.number().int().optional(),
  isPublic: z.boolean().optional(),
});

export async function GET(req: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return NextResponse.json({ error: admin.message }, { status: admin.status });

  const { searchParams } = new URL(req.url);
  const subCategoryId = searchParams.get("subCategoryId") ?? undefined;

  const where = subCategoryId ? { subCategoryId } : {};
  const items = await prisma.resourceModule.findMany({
    where,
    orderBy: [{ subCategoryId: "asc" }, { order: "asc" }],
    include: { subCategory: { include: { domain: true } } },
  });

  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return NextResponse.json({ error: admin.message }, { status: admin.status });

  const body = await req.json().catch(() => ({}));
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const {
    subCategoryId, title, slug, summary,
    kind = "MIXED", order = 0, isPublic = true,
  } = parsed.data;

  const toSlug = slug ? slugify(slug) : slugify(title);

  const created = await prisma.resourceModule.create({
    data: { subCategoryId, title, slug: toSlug, summary, kind, order, isPublic },
  });

  return NextResponse.json(created, { status: 201 });
}
