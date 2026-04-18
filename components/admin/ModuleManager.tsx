"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Lesson = { id: string; title: string; orderIndex: number; durationMinutes: number };
type Module = { id: string; title: string; icon: string; color: string; duration: string; orderIndex: number; lessons: Lesson[] };

export function ModuleManager({ courseId, initialModules }: { courseId: string; initialModules: Module[] }) {
  const router = useRouter();
  const [modules, setModules] = useState(initialModules);
  const [newMod, setNewMod] = useState({ title: "", icon: "📖", color: "blue" });
  const [adding, setAdding] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  async function addModule() {
    setAdding(true);
    const res = await fetch(`/api/admin/courses/${courseId}/modules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newMod.title, icon: newMod.icon, color: newMod.color }),
    });
    if (res.ok) {
      setNewMod({ title: "", icon: "📖", color: "blue" });
      setShowAddForm(false);
      router.refresh();
      const data = await res.json();
      setModules(m => [...m, { ...data.module, lessons: [] }]);
    }
    setAdding(false);
  }

  async function deleteModule(modId: string) {
    if (!confirm("¿Eliminar módulo y todas sus lecciones?")) return;
    await fetch(`/api/admin/courses/${courseId}/modules/${modId}`, { method: "DELETE" });
    setModules(m => m.filter(x => x.id !== modId));
  }

  return (
    <div>
      <div className="space-y-4 mb-6">
        {modules.map((mod, idx) => (
          <div key={mod.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 p-4 border-b border-slate-800">
              <span className="text-2xl">{mod.icon || "📖"}</span>
              <div className="flex-1">
                <p className="text-white font-medium text-sm">Módulo {idx + 1}: {mod.title}</p>
                <p className="text-slate-500 text-xs">{mod.lessons.length} lecciones</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/courses/${courseId}/modules/${mod.id}/lessons`}
                  className="text-blue-400 hover:text-blue-300 text-xs"
                >
                  Gestionar Lecciones
                </Link>
                <button
                  onClick={() => deleteModule(mod.id)}
                  className="text-red-400 hover:text-red-300 text-xs"
                >
                  Eliminar
                </button>
              </div>
            </div>
            {mod.lessons.length > 0 && (
              <div className="p-2">
                {mod.lessons.map((l) => (
                  <div key={l.id} className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-800 rounded-lg">
                    <span className="text-slate-500 text-xs">📄</span>
                    <span className="text-slate-300 text-xs flex-1">{l.title}</span>
                    <Link
                      href={`/admin/courses/${courseId}/modules/${mod.id}/lessons/${l.id}`}
                      className="text-blue-400 hover:text-blue-300 text-xs"
                    >
                      Editar
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {showAddForm ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-medium text-white">Nuevo Módulo</h3>
          <input
            type="text"
            value={newMod.title}
            onChange={e => setNewMod(n => ({ ...n, title: e.target.value }))}
            placeholder="Título del módulo"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-3">
            <input
              type="text"
              value={newMod.icon}
              onChange={e => setNewMod(n => ({ ...n, icon: e.target.value }))}
              placeholder="Emoji (ej: 🚀)"
              className="w-24 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={newMod.color}
              onChange={e => setNewMod(n => ({ ...n, color: e.target.value }))}
              placeholder="Color"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={addModule} disabled={adding || !newMod.title}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg">
              {adding ? "Agregando..." : "Agregar"}
            </button>
            <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-white text-sm px-3 py-2">
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full border-2 border-dashed border-slate-700 hover:border-slate-600 text-slate-400 hover:text-white rounded-xl p-4 text-sm transition-colors"
        >
          + Agregar Módulo
        </button>
      )}
    </div>
  );
}
