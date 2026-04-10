import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { UserRoleManager } from "@/components/admin/UserRoleManager";
import Link from "next/link";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== "ADMIN") redirect("/dashboard");

  const users = await prisma.user.findMany({
    select: {
      id: true, name: true, email: true, role: true, createdAt: true,
      _count: { select: { enrollments: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/admin" className="text-slate-400 hover:text-white text-sm">← Admin</Link>
        <h1 className="text-2xl font-bold text-white mt-2 mb-6">Gestionar Usuarios ({users.length})</h1>
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-xs text-slate-400 px-4 py-3">Usuario</th>
                <th className="text-left text-xs text-slate-400 px-4 py-3">Rol</th>
                <th className="text-left text-xs text-slate-400 px-4 py-3">Cursos</th>
                <th className="text-left text-xs text-slate-400 px-4 py-3">Registro</th>
                <th className="text-left text-xs text-slate-400 px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                  <td className="px-4 py-3">
                    <p className="text-white text-sm font-medium">{user.name ?? "Sin nombre"}</p>
                    <p className="text-slate-500 text-xs">{user.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      user.role === "ADMIN" ? "bg-red-500/20 text-red-400" :
                      user.role === "INSTRUCTOR" ? "bg-purple-500/20 text-purple-400" :
                      "bg-blue-500/20 text-blue-400"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-sm">{user._count.enrollments}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {new Date(user.createdAt).toLocaleDateString("es-ES")}
                  </td>
                  <td className="px-4 py-3">
                    <UserRoleManager userId={user.id} currentRole={user.role} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
