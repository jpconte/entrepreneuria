import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { ModuleManager } from "@/components/admin/ModuleManager";
import Link from "next/link";

export default async function ModulesPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes(session.user.role ?? "")) {
    redirect("/dashboard");
  }

  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      modules: {
        include: { lessons: { orderBy: { orderIndex: "asc" } } },
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!course) notFound();

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-2 text-sm">
          <Link href="/admin/courses" className="text-slate-400 hover:text-white">← Cursos</Link>
          <span className="text-slate-600">/</span>
          <Link href={`/admin/courses/${id}`} className="text-slate-400 hover:text-white">{course.title}</Link>
          <span className="text-slate-600">/</span>
          <span className="text-white">Módulos</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-6">Módulos de: {course.title}</h1>
        <ModuleManager courseId={id} initialModules={course.modules.map(m => ({
          id: m.id,
          title: m.title,
          icon: m.icon ?? "",
          color: m.color ?? "",
          duration: m.duration ?? "",
          orderIndex: m.orderIndex,
          lessons: m.lessons.map(l => ({ id: l.id, title: l.title, orderIndex: l.orderIndex, durationMinutes: l.durationMinutes })),
        }))} />
      </main>
    </div>
  );
}
