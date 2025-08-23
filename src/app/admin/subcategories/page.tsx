"use client";

import { useEffect, useMemo, useState } from "react";

type Domain = { id: string; name: string };
type SubCategory = {
  id: string; name: string; slug: string; order: number; isPublic: boolean; domainId: string;
};

export default function SubCatsAdminPage() {
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const domainId = params.get("domainId") || "";

  const [domains, setDomains] = useState<Domain[]>([]);
  const [items, setItems] = useState<SubCategory[]>([]);
  const [form, setForm] = useState({ domainId, name: "", slug: "", order: 0, isPublic: true });

  const loadDomains = async () => {
    const res = await fetch("/api/admin/domains", { credentials: "include" });
    setDomains(await res.json());
  };
  const load = async () => {
    const url = domainId ? `/api/admin/subcategories?domainId=${domainId}` : "/api/admin/subcategories";
    const res = await fetch(url, { cache: "no-store", credentials: "include" });
    setItems(await res.json());
  };

  useEffect(()=>{ loadDomains(); }, []);
  useEffect(()=>{ load(); setForm(f=>({...f, domainId})); }, [domainId]);

  const createOne = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/admin/subcategories", {
      method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify(form),
      credentials: "include",
    });
    setForm({ domainId, name:"", slug:"", order:0, isPublic:true });
    load();
  };

  const update = async (id:string, patch:Partial<SubCategory>)=>{
    await fetch(`/api/admin/subcategories/${id}`, {
      method:"PATCH", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(patch),
      credentials: "include",
    });
    load();
  };
  const remove = async (id:string)=>{
    if(!confirm("Delete sub-category?")) return;
    await fetch(`/api/admin/subcategories/${id}`, { method:"DELETE", credentials: "include" });
    load();
  };

  const sorted = useMemo(()=>[...items].sort((a,b)=>a.order-b.order), [items]);

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Sub-Categories</h1>
        <a className="text-blue-600 underline" href="/admin">Back</a>
      </header>

      <section className="border rounded-lg p-4 grid gap-3">
        <div className="flex gap-2 items-center">
          <label className="text-sm">Filter Domain:</label>
          <select
            className="border rounded p-2"
            value={domainId}
            onChange={(e)=> {
              const v = e.target.value;
              const u = new URL(window.location.href);
              if (v) { u.searchParams.set("domainId", v); }
              else { u.searchParams.delete("domainId"); }
              window.location.href = u.toString();
            }}
          >
            <option value="">All</option>
            {domains.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>

        <form onSubmit={createOne} className="grid gap-3 sm:grid-cols-2">
          <label className="grid">
            <span className="text-sm">Domain</span>
            <select className="border rounded p-2" value={form.domainId}
              onChange={e=>setForm(f=>({...f, domainId:e.target.value}))} required>
              <option value="" disabled>Select a domain</option>
              {domains.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </label>
          <label className="grid">
            <span className="text-sm">Name</span>
            <input className="border rounded p-2" value={form.name}
              onChange={e=>setForm(f=>({...f, name:e.target.value}))} required/>
          </label>
          <label className="grid">
            <span className="text-sm">Slug</span>
            <input className="border rounded p-2" value={form.slug}
              onChange={e=>setForm(f=>({...f, slug:e.target.value}))} placeholder="(optional)"/>
          </label>
          <label className="grid">
            <span className="text-sm">Order</span>
            <input type="number" className="border rounded p-2" value={form.order}
              onChange={e=>setForm(f=>({...f, order:Number(e.target.value)}))}/>
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={form.isPublic}
              onChange={e=>setForm(f=>({...f, isPublic:e.target.checked}))}/>
            <span>Public</span>
          </label>
          <button className="sm:col-span-2 bg-black text-white rounded px-4 py-2">Create</button>
        </form>
      </section>

      <section className="border rounded-lg p-4">
        <h2 className="font-medium mb-3">All Sub-Categories</h2>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">Order</th>
                <th className="p-2">Name</th>
                <th className="p-2">Slug</th>
                <th className="p-2">Domain</th>
                <th className="p-2">Public</th>
                <th className="p-2 w-44">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(sc=>(
                <tr key={sc.id} className="border-b">
                  <td className="p-2"><input type="number" className="border rounded p-1 w-20"
                    defaultValue={sc.order} onBlur={e=>update(sc.id,{order:Number(e.target.value)})}/></td>
                  <td className="p-2"><input className="border rounded p-1"
                    defaultValue={sc.name} onBlur={e=>update(sc.id,{name:e.target.value})}/></td>
                  <td className="p-2">{sc.slug}</td>
                  <td className="p-2 text-gray-600">{sc.domainId.slice(0,6)}…</td>
                  <td className="p-2"><input type="checkbox" defaultChecked={sc.isPublic}
                    onChange={e=>update(sc.id,{isPublic:e.target.checked})}/></td>
                  <td className="p-2 flex gap-2">
                    <a className="text-blue-600 underline" href={`/admin/modules?subCategoryId=${sc.id}`}>Modules</a>
                    <button className="text-red-600" onClick={()=>remove(sc.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {sorted.length===0 && <tr><td colSpan={6} className="p-3 text-gray-500">No sub-categories.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
