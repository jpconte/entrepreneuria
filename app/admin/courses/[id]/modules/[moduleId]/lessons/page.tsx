import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { LessonManager } from "@/components/admin/LessonManager";
import Link from "next/link";

export default async function LessonsPage({ params }: { params: Promise<{ id: string; moduleId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes(session.user.role ?? "")) {
    redirect("/dashboard");
  }

  const { id, moduleId } = await params;
  const mod = await prisma.module.findUnique({
    where: { id: moduleId },
    include: {
      course: true,
      lessons: { orderBy: { orderIndex: "asc" } },
    },
  });

  if (!mod || mod.courseId !== id) notFound();

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-2 text-sm flex-wrap">
          <Link href="/admin/courses" className="text-slate-400 hover:text-white">← Cursos</Link>
          <span className="text-slate-600">/</span>
          <Link href={`/admin/courses/${id}/modules`} className="text-slate-400 hover:text-white">{mod.course.title}</Link>
          <span className="text-slate-600">/</span>
          <span className="text-white">{mod.title}</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-6">Lecciones: {mod.title}</h1>
        <LessonManager
          courseId={id}
          moduleId={moduleId}
          initialLessons={mod.lessons.map(l => ({ id: l.id, title: l.title, orderIndex: l.orderIndex, durationMinutes: l.durationMinutes }))}
        />
      </main>
    </div>
  );
}
