// src/app/admin/page.tsx
import Link from "next/link";

export default function AdminHome() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <ul className="list-disc pl-6">
        <li><Link href="/admin/users" className="text-blue-600 underline">Manage Users</Link></li>
        <li><Link href="/admin/products" className="text-blue-600 underline">Manage Products</Link></li>
        <li><Link href="/admin/domains" className="text-blue-600 underline">Domains</Link></li>
        <li><Link href="/admin/subcategories" className="text-blue-600 underline">Sub-Categories</Link></li>
        <li><Link href="/admin/modules" className="text-blue-600 underline">Modules</Link></li>
      </ul>
    </main>
  );
}