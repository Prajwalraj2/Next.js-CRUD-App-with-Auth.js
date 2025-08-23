import { auth } from "@/auth";

export async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { ok: false as const, status: 403, message: "Forbidden" };
  }
  return { ok: true as const, session };
}
