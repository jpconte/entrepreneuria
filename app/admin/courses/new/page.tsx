"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";

export default function NewCoursePage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", slug: "", description: "", thumbnail: "", published: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function generateSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error ?? "Error"); return; }
    router.push(`/admin/courses/${data.course.id}`);
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/admin/courses" className="text-slate-400 hover:text-white text-sm">← Cursos</Link>
        <h1 className="text-2xl font-bold text-white mt-2 mb-6">Nuevo Curso</h1>

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          {error && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">{error}</div>}

          <div>
            <label className="block text-sm text-slate-300 mb-1.5">Título *</label>
            <input type="text" required value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: generateSlug(e.target.value) }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1.5">Slug *</label>
            <input type="text" required value={form.slug}
              onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1.5">Descripción</label>
            <textarea rows={3} value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1.5">URL Thumbnail</label>
            <input type="url" value={form.thumbnail}
              onChange={e => setForm(f => ({ ...f, thumbnail: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="published" checked={form.published}
              onChange={e => setForm(f => ({ ...f, published: e.target.checked }))}
              className="w-4 h-4 rounded bg-slate-800 border-slate-600" />
            <label htmlFor="published" className="text-sm text-slate-300">Publicar curso</label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg text-sm">
              {loading ? "Creando..." : "Crear Curso"}
            </button>
            <Link href="/admin/courses" className="text-slate-400 hover:text-slate-200 text-sm px-4 py-2.5">Cancelar</Link>
          </div>
        </form>
      </main>
    </div>
  );
}
