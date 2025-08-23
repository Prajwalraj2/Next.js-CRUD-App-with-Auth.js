"use client";

import { useEffect, useMemo, useState } from "react";

type Domain = {
  id: string;
  name: string;
  slug: string;
  order: number;
  isPublic: boolean;
  createdAt: string;
};

export default function DomainsAdminPage() {
  const [items, setItems] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", order: 0, isPublic: true });

  const fetchDomains = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/domains", { cache: "no-store", credentials: "include" });
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchDomains(); }, []);

  const createDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/admin/domains", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
      credentials: "include",
    });
    setForm({ name: "", slug: "", order: 0, isPublic: true });
    fetchDomains();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete domain?")) return;
    await fetch(`/api/admin/domains/${id}`, { method: "DELETE", credentials: "include" });
    fetchDomains();
  };

  const update = async (id: string, patch: Partial<Domain>) => {
    await fetch(`/api/admin/domains/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
      credentials: "include",
    });
    fetchDomains();
  };

  const sorted = useMemo(() => [...items].sort((a,b)=>a.order-b.order), [items]);

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Domains</h1>
        <a className="text-blue-600 underline" href="/admin">Back</a>
      </header>

      <section className="border rounded-lg p-4">
        <h2 className="font-medium mb-3">Create Domain</h2>
        <form onSubmit={createDomain} className="grid gap-3 sm:grid-cols-2">
          <label className="grid">
            <span className="text-sm">Name</span>
            <input className="border rounded p-2" value={form.name}
              onChange={e=>setForm(f=>({...f, name:e.target.value}))} required />
          </label>
          <label className="grid">
            <span className="text-sm">Slug</span>
            <input className="border rounded p-2" value={form.slug}
              onChange={e=>setForm(f=>({...f, slug:e.target.value}))} placeholder="(optional; auto if empty)" />
          </label>
          <label className="grid">
            <span className="text-sm">Order</span>
            <input type="number" className="border rounded p-2" value={form.order}
              onChange={e=>setForm(f=>({...f, order:Number(e.target.value)}))} />
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={form.isPublic}
              onChange={e=>setForm(f=>({...f, isPublic:e.target.checked}))} />
            <span>Public</span>
          </label>
          <button className="sm:col-span-2 bg-black text-white rounded px-4 py-2">Create</button>
        </form>
      </section>

      <section className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-medium">All Domains</h2>
          {loading && <span className="text-sm text-gray-500">Loading…</span>}
        </div>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">Order</th>
                <th className="p-2">Name</th>
                <th className="p-2">Slug</th>
                <th className="p-2">Public</th>
                <th className="p-2 w-40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(d=>(
                <tr key={d.id} className="border-b">
                  <td className="p-2">
                    <input type="number" className="border rounded p-1 w-20"
                      defaultValue={d.order}
                      onBlur={e=>update(d.id, { order: Number(e.target.value) })}/>
                  </td>
                  <td className="p-2">
                    <input className="border rounded p-1"
                      defaultValue={d.name}
                      onBlur={e=>update(d.id, { name: e.target.value })}/>
                  </td>
                  <td className="p-2">{d.slug}</td>
                  <td className="p-2">
                    <input type="checkbox" defaultChecked={d.isPublic}
                      onChange={e=>update(d.id, { isPublic: e.target.checked })}/>
                  </td>
                  <td className="p-2 flex gap-2">
                    <a className="text-blue-600 underline" href={`/admin/subcategories?domainId=${d.id}`}>SubCats</a>
                    <button className="text-red-600" onClick={()=>remove(d.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {sorted.length===0 && (
                <tr><td colSpan={5} className="p-3 text-gray-500">No domains yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
