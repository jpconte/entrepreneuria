import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id, status: "ACTIVE" },
    include: {
      course: {
        include: {
          modules: {
            include: { lessons: true },
          },
        },
      },
    },
  });

  const allLessonIds = enrollments.flatMap((e) =>
    e.course.modules.flatMap((m) => m.lessons.map((l) => l.id))
  );

  const progressRecords = await prisma.lessonProgress.findMany({
    where: { userId: session.user.id, lessonId: { in: allLessonIds } },
  });

  const progressMap = new Map(progressRecords.map((p) => [p.lessonId, p]));

  // Daily streak calculation
  const recentProgress = await prisma.lessonProgress.findMany({
    where: { userId: session.user.id },
    orderBy: { lastSeenAt: "desc" },
    take: 100,
  });

  let streak = 0;
  if (recentProgress.length > 0) {
    const days = new Set(
      recentProgress.map((p) => p.lastSeenAt.toISOString().split("T")[0])
    );
    const today = new Date().toISOString().split("T")[0];
    let current = new Date();
    while (days.has(current.toISOString().split("T")[0]) || current.toISOString().split("T")[0] === today) {
      if (days.has(current.toISOString().split("T")[0])) streak++;
      current = new Date(current.getTime() - 86400000);
      if (streak > 365) break;
    }
  }

  const totalLessonsCompleted = progressRecords.filter((p) => p.status === "COMPLETED").length;
  const totalLessons = allLessonIds.length;

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Hola, {session.user.name?.split(" ")[0] ?? "Estudiante"} 👋
          </h1>
          <p className="text-slate-400 mt-1">Aquí está tu progreso de aprendizaje</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Cursos Activos", value: enrollments.length, icon: "📚" },
            { label: "Lecciones Completas", value: totalLessonsCompleted, icon: "✅" },
            { label: "Total Lecciones", value: totalLessons, icon: "📝" },
            { label: "Días de Racha", value: streak, icon: "🔥" },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-slate-400 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Course Progress */}
        <h2 className="text-xl font-semibold text-white mb-4">Mis Cursos</h2>
        {enrollments.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <p className="text-slate-400 mb-4">No estás inscrito en ningún curso aún</p>
            <Link href="/courses" className="text-blue-400 hover:text-blue-300">
              Ver cursos disponibles →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {enrollments.map((enrollment) => {
              const lessons = enrollment.course.modules.flatMap((m) => m.lessons);
              const completed = lessons.filter(
                (l) => progressMap.get(l.id)?.status === "COMPLETED"
              ).length;
              const percent = lessons.length > 0 ? Math.round((completed / lessons.length) * 100) : 0;

              return (
                <div
                  key={enrollment.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {enrollment.course.title}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {completed} / {lessons.length} lecciones completadas
                      </p>
                    </div>
                    <Link
                      href={`/courses/${enrollment.course.slug}/learn`}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                    >
                      Continuar
                    </Link>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>{percent}% completado</span>
                    <span>{enrollment.course.modules.length} módulos</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
          >
            Explorar más cursos →
          </Link>
        </div>
      </main>
    </div>
  );
}
