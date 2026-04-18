"use client";

import { useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SearchResult = {
  id: string;
  title: string;
  score?: number;
  module: {
    id: string;
    title: string;
    course: { title: string; slug: string };
  };
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setResults(data.results ?? []);
    setSearched(true);
    setLoading(false);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") search(query);
  }

  // Group by course
  const grouped = results.reduce((acc, r) => {
    const key = r.module.course.slug;
    if (!acc[key]) {
      acc[key] = { course: r.module.course, results: [] };
    }
    acc[key].results.push(r);
    return acc;
  }, {} as Record<string, { course: { title: string; slug: string }; results: SearchResult[] }>);

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Buscar en Cursos</h1>

        <div className="relative mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar lecciones, temas..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-24"
          />
          <button
            onClick={() => search(query)}
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {loading ? "..." : "Buscar"}
          </button>
        </div>

        {searched && results.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <p className="text-lg">No se encontraron resultados para &quot;{query}&quot;</p>
          </div>
        )}

        {Object.values(grouped).map(({ course, results: courseResults }) => (
          <div key={course.slug} className="mb-8">
            <h2 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
              <span>📚</span> {course.title}
            </h2>
            <div className="space-y-2">
              {courseResults.map((r) => (
                <Link
                  key={r.id}
                  href={`/courses/${course.slug}/learn/${r.id}`}
                  className="block bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-xl p-4 transition-all hover:-translate-x-1"
                >
                  <p className="text-white font-medium text-sm">{r.title}</p>
                  <p className="text-slate-500 text-xs mt-1">Módulo: {r.module.title}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {!searched && (
          <div className="text-center py-12 text-slate-600">
            <p className="text-4xl mb-4">🔍</p>
            <p>Escribe algo para buscar en el contenido de los cursos</p>
          </div>
        )}
      </main>
    </div>
  );
}
