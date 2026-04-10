"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Lesson = {
  id: string;
  title: string;
  orderIndex: number;
  durationMinutes: number;
};

type Module = {
  id: string;
  title: string;
  icon: string | null;
  color: string | null;
  lessons: Lesson[];
};

type FullLesson = {
  id: string;
  title: string;
  content: string | null;
  durationMinutes: number;
  moduleId: string;
};

type NavLesson = {
  id: string;
  title: string;
  moduleTitle: string;
};

export function LessonPlayer({
  course,
  lesson,
  progressMap,
  noteContent,
  prevLesson,
  nextLesson,
  userId,
  isCompleted: initialIsCompleted,
}: {
  course: { id: string; title: string; slug: string; modules: Module[] };
  lesson: FullLesson;
  progressMap: Record<string, string>;
  noteContent: string;
  prevLesson: NavLesson | null;
  nextLesson: NavLesson | null;
  userId: string;
  isCompleted: boolean;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notesOpen, setNotesOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [note, setNote] = useState(noteContent);
  const [saving, setSaving] = useState(false);
  const [isCompleted, setIsCompleted] = useState(initialIsCompleted);
  const [comments, setComments] = useState<Array<{ id: string; content: string; user: { name: string | null } }>>([]);
  const [commentText, setCommentText] = useState("");
  const [activeTab, setActiveTab] = useState<"content" | "comments">("content");

  const saveNote = useCallback(async (content: string) => {
    setSaving(true);
    await fetch(`/api/notes/${lesson.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    setSaving(false);
  }, [lesson.id]);

  useEffect(() => {
    const timer = setTimeout(() => saveNote(note), 1500);
    return () => clearTimeout(timer);
  }, [note, saveNote]);

  useEffect(() => {
    fetch(`/api/comments/${lesson.id}`)
      .then((r) => r.json())
      .then((d) => setComments(d.comments ?? []));
  }, [lesson.id]);

  async function markComplete() {
    await fetch(`/api/progress/${lesson.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "COMPLETED", percent: 100 }),
    });
    setIsCompleted(true);
    if (nextLesson) {
      router.push(`/courses/${course.slug}/learn/${nextLesson.id}`);
      router.refresh();
    }
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) return;
    const res = await fetch(`/api/comments/${lesson.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: commentText }),
    });
    if (res.ok) {
      const data = await res.json();
      setComments((prev) => [data.comment, ...prev]);
      setCommentText("");
    }
  }

  const progressCounts = course.modules.map((m) => ({
    ...m,
    completed: m.lessons.filter((l) => progressMap[l.id] === "COMPLETED").length,
  }));

  return (
    <div className={`flex h-screen bg-slate-950 overflow-hidden ${focusMode ? "focus-mode" : ""}`}>
      {/* Sidebar */}
      {sidebarOpen && !focusMode && (
        <aside className="w-72 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <Link
              href={`/courses/${course.slug}`}
              className="text-slate-400 hover:text-white text-xs flex items-center gap-1 mb-2"
            >
              ← Volver al curso
            </Link>
            <h2 className="text-white font-semibold text-sm line-clamp-2">{course.title}</h2>
          </div>

          <div className="flex-1 overflow-y-auto py-2">
            {course.modules.map((mod) => {
              const pInfo = progressCounts.find((p) => p.id === mod.id);
              return (
                <div key={mod.id} className="mb-1">
                  <div className="px-4 py-2 flex items-center gap-2">
                    <span className="text-lg">{mod.icon ?? "📖"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-300 truncate">{mod.title}</p>
                      <p className="text-xs text-slate-500">
                        {pInfo?.completed ?? 0}/{mod.lessons.length}
                      </p>
                    </div>
                  </div>
                  {mod.lessons.map((l) => {
                    const status = progressMap[l.id] ?? "NOT_STARTED";
                    const isCurrent = l.id === lesson.id;
                    return (
                      <Link
                        key={l.id}
                        href={`/courses/${course.slug}/learn/${l.id}`}
                        className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                          isCurrent
                            ? "bg-blue-600/20 text-blue-400 border-r-2 border-blue-400"
                            : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                        }`}
                      >
                        <span className="text-xs">
                          {status === "COMPLETED" ? "✅" : isCurrent ? "▶️" : "○"}
                        </span>
                        <span className="flex-1 truncate text-xs">{l.title}</span>
                        {l.durationMinutes > 0 && (
                          <span className="text-slate-600 text-xs">{l.durationMinutes}m</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </aside>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-900">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800"
            title="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-white font-medium text-sm flex-1 truncate">{lesson.title}</h1>
          <button
            onClick={() => setNotesOpen(!notesOpen)}
            className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
              notesOpen ? "bg-yellow-500/20 text-yellow-400" : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            📝 Notas
          </button>
          <button
            onClick={() => setFocusMode(!focusMode)}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 text-sm"
            title="Focus mode"
          >
            {focusMode ? "⊡" : "⊞"}
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Content area */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-6 py-8">
              {/* Tabs */}
              <div className="flex gap-4 border-b border-slate-800 mb-6">
                {(["content", "comments"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab
                        ? "border-blue-500 text-blue-400"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {tab === "content" ? "Contenido" : "Comentarios"}
                  </button>
                ))}
              </div>

              {activeTab === "content" && (
                <>
                  <h1 className="text-3xl font-bold text-white mb-6">{lesson.title}</h1>
                  {lesson.durationMinutes > 0 && (
                    <p className="text-slate-400 text-sm mb-6">⏱️ {lesson.durationMinutes} minutos de lectura</p>
                  )}
                  <div
                    className="prose prose-invert prose-slate max-w-none"
                    dangerouslySetInnerHTML={{ __html: lesson.content ?? "<p>Contenido próximamente...</p>" }}
                  />
                </>
              )}

              {activeTab === "comments" && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-4">Comentarios</h2>
                  <form onSubmit={submitComment} className="mb-6">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Escribe un comentario..."
                      rows={3}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <button
                      type="submit"
                      className="mt-2 bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg"
                    >
                      Comentar
                    </button>
                  </form>
                  <div className="space-y-4">
                    {comments.map((c) => (
                      <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
                            {c.user.name?.charAt(0) ?? "?"}
                          </div>
                          <span className="text-sm font-medium text-slate-300">{c.user.name ?? "Anónimo"}</span>
                        </div>
                        <p className="text-slate-300 text-sm">{c.content}</p>
                      </div>
                    ))}
                    {comments.length === 0 && (
                      <p className="text-slate-500 text-sm">Sé el primero en comentar</p>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-12 pt-6 border-t border-slate-800">
                {prevLesson ? (
                  <Link
                    href={`/courses/${course.slug}/learn/${prevLesson.id}`}
                    className="flex items-center gap-2 text-slate-400 hover:text-white text-sm"
                  >
                    ← {prevLesson.title}
                  </Link>
                ) : (
                  <div />
                )}

                <button
                  onClick={markComplete}
                  className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                    isCompleted
                      ? "bg-green-600/20 text-green-400 border border-green-600/30"
                      : "bg-blue-600 hover:bg-blue-500 text-white"
                  }`}
                >
                  {isCompleted ? "✅ Completada" : nextLesson ? "Marcar y siguiente →" : "Marcar como completada ✓"}
                </button>

                {nextLesson ? (
                  <Link
                    href={`/courses/${course.slug}/learn/${nextLesson.id}`}
                    className="flex items-center gap-2 text-slate-400 hover:text-white text-sm"
                  >
                    {nextLesson.title} →
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            </div>
          </div>

          {/* Notes panel */}
          {notesOpen && (
            <div className="w-72 flex-shrink-0 border-l border-slate-800 bg-slate-900 flex flex-col">
              <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                <span className="text-sm font-medium text-white">📝 Mis Notas</span>
                {saving && <span className="text-xs text-slate-500">Guardando...</span>}
                {!saving && note && <span className="text-xs text-green-500">✓ Guardado</span>}
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Escribe tus notas aquí... Se guardan automáticamente."
                className="flex-1 bg-transparent p-4 text-slate-300 text-sm resize-none focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
