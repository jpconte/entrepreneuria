import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { CourseEditForm } from "@/components/admin/CourseEditForm";
import Link from "next/link";

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes(session.user.role ?? "")) {
    redirect("/dashboard");
  }

  const { id } = await params;
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) notFound();

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6 text-sm">
          <Link href="/admin/courses" className="text-slate-400 hover:text-white">← Cursos</Link>
          <span className="text-slate-600">/</span>
          <span className="text-white">Editar</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">{course.title}</h1>
        <div className="flex gap-3 mb-6">
          <Link href={`/admin/courses/${id}/modules`} className="text-sm text-purple-400 hover:text-purple-300">
            Gestionar Módulos →
          </Link>
        </div>
        <CourseEditForm course={{ id: course.id, title: course.title, slug: course.slug, description: course.description ?? "", thumbnail: course.thumbnail ?? "", published: course.published }} />
      </main>
    </div>
  );
}
