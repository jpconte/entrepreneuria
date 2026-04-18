"use client";

import { useState } from "react";
import Link from "next/link";

type Lesson = { id: string; title: string; orderIndex: number; durationMinutes: number };

export function LessonManager({
  courseId,
  moduleId,
  initialLessons,
}: {
  courseId: string;
  moduleId: string;
  initialLessons: Lesson[];
}) {
  const [lessons, setLessons] = useState(initialLessons);
  const [newLesson, setNewLesson] = useState({ title: "", durationMinutes: 0 });
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function addLesson() {
    if (!newLesson.title.trim()) return;
    setAdding(true);
    const res = await fetch(`/api/admin/courses/${courseId}/modules/${moduleId}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLesson),
    });
    if (res.ok) {
      const data = await res.json();
      setLessons((l) => [...l, data.lesson]);
      setNewLesson({ title: "", durationMinutes: 0 });
      setShowForm(false);
    }
    setAdding(false);
  }

  async function deleteLesson(lessonId: string) {
    if (!confirm("¿Eliminar esta lección?")) return;
    await fetch(`/api/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, {
      method: "DELETE",
    });
    setLessons((l) => l.filter((x) => x.id !== lessonId));
  }

  return (
    <div>
      <div className="space-y-2 mb-4">
        {lessons.map((lesson, idx) => (
          <div
            key={lesson.id}
            className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-3"
          >
            <span className="text-slate-600 text-sm">{idx + 1}</span>
            <div className="flex-1">
              <p className="text-white text-sm">{lesson.title}</p>
              {lesson.durationMinutes > 0 && (
                <p className="text-slate-500 text-xs">{lesson.durationMinutes} min</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}`}
                className="text-blue-400 hover:text-blue-300 text-xs"
              >
                Editar
              </Link>
              <button
                onClick={() => deleteLesson(lesson.id)}
                className="text-red-400 hover:text-red-300 text-xs"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {lessons.length === 0 && !showForm && (
        <p className="text-slate-500 text-sm text-center py-6">
          No hay lecciones en este módulo.
        </p>
      )}

      {showForm ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-medium text-white">Nueva Lección</h3>
          <input
            type="text"
            value={newLesson.title}
            onChange={(e) => setNewLesson((n) => ({ ...n, title: e.target.value }))}
            placeholder="Título de la lección"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            value={newLesson.durationMinutes}
            onChange={(e) => setNewLesson((n) => ({ ...n, durationMinutes: parseInt(e.target.value) || 0 }))}
            placeholder="Duración (minutos)"
            min={0}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <button
              onClick={addLesson}
              disabled={adding || !newLesson.title}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg"
            >
              {adding ? "Agregando..." : "Agregar"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="text-slate-400 hover:text-white text-sm px-3 py-2"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full border-2 border-dashed border-slate-700 hover:border-slate-600 text-slate-400 hover:text-white rounded-xl p-4 text-sm transition-colors"
        >
          + Agregar Lección
        </button>
      )}
    </div>
  );
}
