"use client";

import { useState } from "react";

type CourseInfo = { courseId: string; courseTitle: string; courseSlug: string };

export function ProfileActions({ enrollments }: { enrollments: CourseInfo[] }) {
  const [resetting, setResetting] = useState<string | null>(null);
  const [resetDone, setResetDone] = useState<string | null>(null);

  async function resetProgress(courseId: string) {
    if (!confirm("¿Estás seguro de que quieres resetear tu progreso en este curso?")) return;
    setResetting(courseId);
    await fetch(`/api/profile/reset/${courseId}`, { method: "DELETE" });
    setResetting(null);
    setResetDone(courseId);
    setTimeout(() => setResetDone(null), 3000);
  }

  return (
    <div className="space-y-4">
      {/* Export */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-3">Exportar Progreso</h3>
        <p className="text-slate-400 text-sm mb-4">
          Descarga un archivo con todo tu progreso de aprendizaje.
        </p>
        <div className="flex gap-3">
          <a
            href="/api/profile/export?format=json"
            download
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm px-4 py-2 rounded-lg transition-colors"
          >
            📄 Exportar JSON
          </a>
          <a
            href="/api/profile/export?format=csv"
            download
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm px-4 py-2 rounded-lg transition-colors"
          >
            📊 Exportar CSV
          </a>
        </div>
      </div>

      {/* Reset per course */}
      {enrollments.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-3">Resetear Progreso</h3>
          <p className="text-slate-400 text-sm mb-4">
            Reinicia tu progreso en un curso específico.
          </p>
          <div className="space-y-2">
            {enrollments.map((e) => (
              <div key={e.courseId} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                <span className="text-slate-300 text-sm">{e.courseTitle}</span>
                <button
                  onClick={() => resetProgress(e.courseId)}
                  disabled={resetting === e.courseId}
                  className="text-red-400 hover:text-red-300 text-xs disabled:opacity-50"
                >
                  {resetting === e.courseId ? "Reseteando..." : resetDone === e.courseId ? "✓ Reseteado" : "Resetear"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
