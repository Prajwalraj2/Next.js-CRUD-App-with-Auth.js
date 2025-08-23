import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { slugify } from "@/lib/slug";
import { requireAdmin } from "@/lib/admin-auth";

const UpdateSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().optional(),
  order: z.number().int().optional(),
  isPublic: z.boolean().optional(),
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin.ok) return NextResponse.json({ error: admin.message }, { status: admin.status });

  const resolvedParams = await params;
  const domain = await prisma.domain.findUnique({ where: { id: resolvedParams.id } });
  if (!domain) return NextResponse.json({ error: "Domain not found" }, { status: 404 });
  return NextResponse.json(domain);
}

export async function PATCH(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin.ok) return NextResponse.json({ error: admin.message }, { status: admin.status });

  const resolvedParams = await params;
  const body = await _req.json().catch(() => ({}));
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const data: any = { ...parsed.data };
  if (data.slug) data.slug = slugify(data.slug);
  const updated = await prisma.domain.update({ where: { id: resolvedParams.id }, data });
  return NextResponse.json(updated);
}



export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin.ok) return NextResponse.json({ error: admin.message }, { status: admin.status });
  
  const resolvedParams = await params;
  await prisma.domain.delete({ where: { id: resolvedParams.id } });
  return NextResponse.json({ ok: true });
}
