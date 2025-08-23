"use client";

import { useEffect, useMemo, useState } from "react";

type SubCategory = { id: string; name: string };
type Module = {
  id: string; title: string; slug: string; summary?: string;
  kind: "MIXED"|"TABLE"|"CONTENT"; order: number; isPublic: boolean; subCategoryId: string;
};

export default function ModulesAdminPage() {
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const subCategoryId = params.get("subCategoryId") || "";

  const [subs, setSubs] = useState<SubCategory[]>([]);
  const [items, setItems] = useState<Module[]>([]);
  const [form, setForm] = useState<Partial<Module>>({
    subCategoryId, title:"", slug:"", summary:"", kind:"CONTENT", order:0, isPublic:true
  });

  const loadSubs = async () => {
    // Fetch all subcats so you can pick where to create the module
    const res = await fetch("/api/admin/subcategories", { credentials: "include" });
    setSubs(await res.json());
  };
  const load = async ()=>{
    const url = subCategoryId ? `/api/admin/modules?subCategoryId=${subCategoryId}` : "/api/admin/modules";
    const res = await fetch(url, { cache:"no-store", credentials: "include" });
    setItems(await res.json());
  };

  useEffect(()=>{ loadSubs(); }, []);
  useEffect(()=>{ load(); setForm(f=>({...f, subCategoryId})); }, [subCategoryId]);

  const createOne = async (e:React.FormEvent)=>{
    e.preventDefault();
    await fetch("/api/admin/modules", {
      method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify(form),
      credentials: "include",
    });
    setForm({ subCategoryId, title:"", slug:"", summary:"", kind:"CONTENT", order:0, isPublic:true });
    load();
  };

  const update = async (id:string, patch:Partial<Module>)=>{
    await fetch(`/api/admin/modules/${id}`, {
      method:"PATCH", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(patch),
      credentials: "include",
    });
    load();
  };

  const remove = async (id:string)=>{
    if(!confirm("Delete module?")) return;
    await fetch(`/api/admin/modules/${id}`, { method:"DELETE", credentials: "include" });
    load();
  };

  const sorted = useMemo(()=>[...items].sort((a,b)=>a.order-b.order), [items]);

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Modules</h1>
        <a className="text-blue-600 underline" href="/admin">Back</a>
      </header>

      <section className="border rounded-lg p-4 grid gap-3">
        <div className="flex gap-2 items-center">
          <label className="text-sm">Filter Sub-Category:</label>
          <select
            className="border rounded p-2"
            value={subCategoryId}
            onChange={(e)=> {
              const v = e.target.value;
              const u = new URL(window.location.href);
              if (v) { u.searchParams.set("subCategoryId", v); }
              else { u.searchParams.delete("subCategoryId"); }
              window.location.href = u.toString();
            }}
          >
            <option value="">All</option>
            {subs.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <form onSubmit={createOne} className="grid gap-3 sm:grid-cols-2">
          <label className="grid">
            <span className="text-sm">Sub-Category</span>
            <select className="border rounded p-2" value={form.subCategoryId || ""}
              onChange={e=>setForm(f=>({...f, subCategoryId:e.target.value}))} required>
              <option value="" disabled>Select one</option>
              {subs.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </label>
          <label className="grid">
            <span className="text-sm">Title</span>
            <input className="border rounded p-2" value={form.title || ""}
              onChange={e=>setForm(f=>({...f, title:e.target.value}))} required/>
          </label>
          <label className="grid">
            <span className="text-sm">Slug</span>
            <input className="border rounded p-2" value={form.slug || ""}
              onChange={e=>setForm(f=>({...f, slug:e.target.value}))} placeholder="(optional)"/>
          </label>
          <label className="grid sm:col-span-2">
            <span className="text-sm">Summary</span>
            <textarea className="border rounded p-2" value={form.summary || ""}
              onChange={e=>setForm(f=>({...f, summary:e.target.value}))}/>
          </label>
          <label className="grid">
            <span className="text-sm">Kind</span>
            <select className="border rounded p-2" value={form.kind || "CONTENT"}
              onChange={e=>setForm(f=>({...f, kind: e.target.value as any}))}>
              <option value="CONTENT">CONTENT</option>
              <option value="TABLE">TABLE</option>
              <option value="MIXED">MIXED</option>
            </select>
          </label>
          <label className="grid">
            <span className="text-sm">Order</span>
            <input type="number" className="border rounded p-2" value={form.order || 0}
              onChange={e=>setForm(f=>({...f, order:Number(e.target.value)}))}/>
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={!!form.isPublic}
              onChange={e=>setForm(f=>({...f, isPublic:e.target.checked}))}/>
            <span>Public</span>
          </label>
          <button className="sm:col-span-2 bg-black text-white rounded px-4 py-2">Create</button>
        </form>
      </section>

      <section className="border rounded-lg p-4">
        <h2 className="font-medium mb-3">All Modules</h2>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">Order</th>
                <th className="p-2">Title</th>
                <th className="p-2">Slug</th>
                <th className="p-2">Kind</th>
                <th className="p-2">Public</th>
                <th className="p-2 w-40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(m=>(
                <tr key={m.id} className="border-b">
                  <td className="p-2"><input type="number" className="border rounded p-1 w-20"
                    defaultValue={m.order} onBlur={e=>update(m.id,{order:Number(e.target.value)})}/></td>
                  <td className="p-2"><input className="border rounded p-1"
                    defaultValue={m.title} onBlur={e=>update(m.id,{title:e.target.value})}/></td>
                  <td className="p-2">{m.slug}</td>
                  <td className="p-2">
                    <select defaultValue={m.kind} onChange={e=>update(m.id,{kind:e.target.value as any})}
                      className="border rounded p-1">
                      <option value="CONTENT">CONTENT</option>
                      <option value="TABLE">TABLE</option>
                      <option value="MIXED">MIXED</option>
                    </select>
                  </td>
                  <td className="p-2"><input type="checkbox" defaultChecked={m.isPublic}
                    onChange={e=>update(m.id,{isPublic:e.target.checked})}/></td>
                  <td className="p-2 flex gap-2">
                    <button className="text-red-600" onClick={()=>remove(m.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {sorted.length===0 && <tr><td colSpan={6} className="p-3 text-gray-500">No modules.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
