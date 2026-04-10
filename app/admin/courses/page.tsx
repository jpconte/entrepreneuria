import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";

export default async function AdminCoursesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes(session.user.role ?? "")) {
    redirect("/dashboard");
  }

  const courses = await prisma.course.findMany({
    include: {
      instructor: { select: { name: true } },
      _count: { select: { modules: true, enrollments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/admin" className="text-slate-400 hover:text-white text-sm">← Admin</Link>
            <h1 className="text-2xl font-bold text-white mt-1">Gestionar Cursos</h1>
          </div>
          <Link href="/admin/courses/new" className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg">
            + Nuevo Curso
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-xs text-slate-400 px-4 py-3">Título</th>
                <th className="text-left text-xs text-slate-400 px-4 py-3">Slug</th>
                <th className="text-left text-xs text-slate-400 px-4 py-3">Estado</th>
                <th className="text-left text-xs text-slate-400 px-4 py-3">Módulos</th>
                <th className="text-left text-xs text-slate-400 px-4 py-3">Inscritos</th>
                <th className="text-left text-xs text-slate-400 px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                  <td className="px-4 py-3 text-white text-sm font-medium">{course.title}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs font-mono">{course.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${course.published ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                      {course.published ? "Publicado" : "Borrador"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-sm">{course._count.modules}</td>
                  <td className="px-4 py-3 text-slate-400 text-sm">{course._count.enrollments}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/courses/${course.id}`} className="text-blue-400 hover:text-blue-300 text-xs">Editar</Link>
                      <Link href={`/admin/courses/${course.id}/modules`} className="text-purple-400 hover:text-purple-300 text-xs">Módulos</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {courses.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-sm">
              No hay cursos aún.{" "}
              <Link href="/admin/courses/new" className="text-blue-400">Crear el primero</Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
