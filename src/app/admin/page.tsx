// src/app/admin/page.tsx
import Link from "next/link";

export default function AdminHome() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <ul className="list-disc pl-6">
        <li><Link href="/admin/users">Manage Users</Link></li>
        <li><Link href="/admin/products">Manage Products</Link></li>
      </ul>
    </main>
  );
}
