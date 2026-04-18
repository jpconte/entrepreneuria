import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    include: {
      instructor: { select: { name: true } },
      modules: {
        include: { _count: { select: { lessons: true } } },
      },
      _count: { select: { enrollments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">Catálogo de Cursos</h1>
          <p className="text-slate-400">
            {courses.length} curso{courses.length !== 1 ? "s" : ""} disponible{courses.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const totalLessons = course.modules.reduce(
              (acc, m) => acc + m._count.lessons,
              0
            );
            return (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl group"
              >
                <div className="h-44 bg-gradient-to-br from-blue-900/40 via-slate-900 to-purple-900/40 flex items-center justify-center text-7xl">
                  🚀
                </div>
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {course.title}
                  </h2>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <span>📚</span> {course.modules.length} módulos
                    </span>
                    <span className="flex items-center gap-1">
                      <span>📝</span> {totalLessons} lecciones
                    </span>
                    <span className="flex items-center gap-1">
                      <span>👥</span> {course._count.enrollments}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-24 text-slate-500">
            <p className="text-xl">No hay cursos disponibles todavía</p>
            <p className="text-sm mt-2">¡Pronto agregaremos nuevo contenido!</p>
          </div>
        )}
      </main>
    </div>
  );
}
