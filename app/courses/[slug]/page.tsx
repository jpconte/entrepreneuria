import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import { notFound } from "next/navigation";
import Link from "next/link";
import { EnrollButton } from "@/components/EnrollButton";

export default async function CourseOverviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);

  const course = await prisma.course.findUnique({
    where: { slug, published: true },
    include: {
      instructor: { select: { name: true, image: true } },
      modules: {
        include: {
          lessons: {
            select: { id: true, title: true, durationMinutes: true, orderIndex: true },
            orderBy: { orderIndex: "asc" },
          },
        },
        orderBy: { orderIndex: "asc" },
      },
      _count: { select: { enrollments: true } },
    },
  });

  if (!course) notFound();

  let isEnrolled = false;
  let enrollment = null;
  if (session?.user?.id) {
    enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
    });
    isEnrolled = enrollment?.status === "ACTIVE";
  }

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalMinutes = course.modules.reduce(
    (acc, m) => acc + m.lessons.reduce((a, l) => a + l.durationMinutes, 0),
    0
  );

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Content */}
          <div className="lg:col-span-2">
            <div className="mb-2">
              <span className="text-blue-400 text-sm">Curso</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">{course.title}</h1>
            <p className="text-slate-300 text-lg mb-6">{course.description}</p>

            <div className="flex items-center gap-4 text-sm text-slate-400 mb-8">
              <span>📚 {course.modules.length} módulos</span>
              <span>📝 {totalLessons} lecciones</span>
              <span>⏱️ {Math.round(totalMinutes / 60)}h {totalMinutes % 60}m</span>
              <span>👥 {course._count.enrollments} estudiantes</span>
            </div>

            {/* Modules */}
            <h2 className="text-2xl font-bold text-white mb-4">Contenido del Curso</h2>
            <div className="space-y-3">
              {course.modules.map((mod, idx) => (
                <div key={mod.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-3 p-4">
                    <span className="text-2xl">{mod.icon ?? "📖"}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-sm">
                        Módulo {idx + 1}: {mod.title}
                      </h3>
                      <p className="text-slate-500 text-xs">
                        {mod.lessons.length} lección{mod.lessons.length !== 1 ? "es" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-slate-800">
                    {mod.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center gap-3 px-4 py-2.5 border-b border-slate-800/50 last:border-0"
                      >
                        <span className="text-slate-500 text-sm">📄</span>
                        <span className="text-slate-300 text-sm flex-1">{lesson.title}</span>
                        {lesson.durationMinutes > 0 && (
                          <span className="text-slate-500 text-xs">{lesson.durationMinutes}min</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-20">
              <div className="h-40 bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-xl flex items-center justify-center text-6xl mb-6">
                🚀
              </div>

              {isEnrolled ? (
                <Link
                  href={`/courses/${course.slug}/learn`}
                  className="block w-full text-center bg-green-600 hover:bg-green-500 text-white font-semibold py-3 rounded-xl transition-colors mb-4"
                >
                  Continuar Aprendiendo →
                </Link>
              ) : (
                <EnrollButton courseSlug={course.slug} isLoggedIn={!!session?.user} />
              )}

              <div className="space-y-3 mt-4 text-sm text-slate-400">
                <div className="flex justify-between">
                  <span>Módulos</span>
                  <span className="text-white">{course.modules.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lecciones</span>
                  <span className="text-white">{totalLessons}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duración</span>
                  <span className="text-white">{Math.round(totalMinutes / 60)}h {totalMinutes % 60}m</span>
                </div>
                <div className="flex justify-between">
                  <span>Estudiantes</span>
                  <span className="text-white">{course._count.enrollments}</span>
                </div>
                <div className="flex justify-between">
                  <span>Instructor</span>
                  <span className="text-white">{course.instructor.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
