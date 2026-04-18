import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { ProfileActions } from "@/components/ProfileActions";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  if (!user) redirect("/login");

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user.id, status: "ACTIVE" },
    include: { course: { select: { id: true, title: true, slug: true } } },
  });

  const progressCount = await prisma.lessonProgress.count({
    where: { userId: user.id, status: "COMPLETED" },
  });

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Mi Perfil</h1>

        {/* User info */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold text-white">
              {user.name?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <p className="text-slate-400">{user.email}</p>
              <span className="inline-block mt-1 text-xs bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full">
                {user.role}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-slate-800 rounded-xl p-3">
              <div className="text-xl font-bold text-white">{enrollments.length}</div>
              <div className="text-xs text-slate-400">Cursos</div>
            </div>
            <div className="bg-slate-800 rounded-xl p-3">
              <div className="text-xl font-bold text-white">{progressCount}</div>
              <div className="text-xs text-slate-400">Completadas</div>
            </div>
            <div className="bg-slate-800 rounded-xl p-3">
              <div className="text-xl font-bold text-white">
                {new Date(user.createdAt).getFullYear()}
              </div>
              <div className="text-xs text-slate-400">Miembro desde</div>
            </div>
          </div>
        </div>

        {/* Export & Reset */}
        <ProfileActions enrollments={enrollments.map(e => ({ courseId: e.course.id, courseTitle: e.course.title, courseSlug: e.course.slug }))} />
      </main>
    </div>
  );
}
