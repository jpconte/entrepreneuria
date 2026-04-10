import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes(session.user.role ?? "")) {
    redirect("/dashboard");
  }

  const [courseCount, userCount, enrollmentCount, eventCount] = await Promise.all([
    prisma.course.count(),
    prisma.user.count(),
    prisma.enrollment.count(),
    prisma.auditEvent.count(),
  ]);

  const recentCourses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { _count: { select: { enrollments: true } } },
  });

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Panel de Administración</h1>
          <Link
            href="/admin/courses/new"
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg"
          >
            + Nuevo Curso
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Cursos", value: courseCount, icon: "📚", href: "/admin/courses" },
            { label: "Usuarios", value: userCount, icon: "👥", href: "/admin/users" },
            { label: "Inscripciones", value: enrollmentCount, icon: "✅", href: "/admin/courses" },
            { label: "Eventos", value: eventCount, icon: "📊", href: "/admin/audit" },
          ].map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-xl p-4 transition-colors"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-slate-400 text-xs mt-1">{stat.label}</div>
            </Link>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Cursos Recientes</h2>
            <div className="space-y-3">
              {recentCourses.map((course) => (
                <div key={course.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white">{course.title}</p>
                    <p className="text-xs text-slate-500">
                      {course._count.enrollments} inscriptos •{" "}
                      {course.published ? (
                        <span className="text-green-400">Publicado</span>
                      ) : (
                        <span className="text-yellow-400">Borrador</span>
                      )}
                    </p>
                  </div>
                  <Link
                    href={`/admin/courses/${course.id}`}
                    className="text-blue-400 hover:text-blue-300 text-xs"
                  >
                    Editar
                  </Link>
                </div>
              ))}
            </div>
            <Link href="/admin/courses" className="text-blue-400 hover:text-blue-300 text-sm mt-4 block">
              Ver todos →
            </Link>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Accesos Rápidos</h2>
            <div className="space-y-2">
              {[
                { label: "Gestionar Cursos", href: "/admin/courses", icon: "📚" },
                { label: "Nuevo Curso", href: "/admin/courses/new", icon: "➕" },
                { label: "Gestionar Usuarios", href: "/admin/users", icon: "👥" },
                { label: "Registro de Auditoría", href: "/admin/audit", icon: "📋" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <span>{item.icon}</span>
                  <span className="text-slate-300 text-sm">{item.label}</span>
                  <span className="ml-auto text-slate-600">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
