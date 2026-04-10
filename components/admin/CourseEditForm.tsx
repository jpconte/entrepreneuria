"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Course = { id: string; title: string; slug: string; description: string; thumbnail: string; published: boolean };

export function CourseEditForm({ course }: { course: Course }) {
  const router = useRouter();
  const [form, setForm] = useState(course);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch(`/api/admin/courses/${course.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error ?? "Error"); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("¿Eliminar este curso? Esta acción no se puede deshacer.")) return;
    await fetch(`/api/admin/courses/${course.id}`, { method: "DELETE" });
    router.push("/admin/courses");
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
      {error && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">{error}</div>}
      {saved && <div className="text-green-400 text-sm bg-green-500/10 border border-green-500/20 px-3 py-2 rounded-lg">✓ Guardado</div>}

      <div>
        <label className="block text-sm text-slate-300 mb-1.5">Título *</label>
        <input type="text" required value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
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
        <label htmlFor="published" className="text-sm text-slate-300">Publicado</label>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button type="submit" disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg text-sm">
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
        <button type="button" onClick={handleDelete}
          className="text-red-400 hover:text-red-300 text-sm">
          Eliminar Curso
        </button>
      </div>
    </form>
  );
}
