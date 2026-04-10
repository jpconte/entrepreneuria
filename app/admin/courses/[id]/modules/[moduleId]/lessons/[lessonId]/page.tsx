import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { LessonEditor } from "@/components/admin/LessonEditor";
import Link from "next/link";

export default async function EditLessonPage({
  params,
}: {
  params: Promise<{ id: string; moduleId: string; lessonId: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes(session.user.role ?? "")) {
    redirect("/dashboard");
  }

  const { id, moduleId, lessonId } = await params;
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { module: { include: { course: true } } },
  });

  if (!lesson || lesson.moduleId !== moduleId) notFound();

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-4 text-sm flex-wrap">
          <Link href={`/admin/courses/${id}/modules/${moduleId}/lessons`} className="text-slate-400 hover:text-white">
            ← Lecciones
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-white">{lesson.title}</span>
        </div>
        <LessonEditor
          lesson={{
            id: lesson.id,
            title: lesson.title,
            content: lesson.content ?? "",
            durationMinutes: lesson.durationMinutes,
          }}
          courseId={id}
          moduleId={moduleId}
        />
      </main>
    </div>
  );
}
