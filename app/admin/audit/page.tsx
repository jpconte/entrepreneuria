import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";

export default async function AuditPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== "ADMIN") redirect("/dashboard");

  const sp = await searchParams;
  const page = parseInt(sp.page ?? "1");
  const limit = 50;
  const skip = (page - 1) * limit;

  const [events, total] = await Promise.all([
    prisma.auditEvent.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.auditEvent.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/admin" className="text-slate-400 hover:text-white text-sm">← Admin</Link>
        <h1 className="text-2xl font-bold text-white mt-2 mb-6">
          Registro de Auditoría ({total} eventos)
        </h1>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-xs text-slate-400 px-4 py-3">Fecha</th>
                <th className="text-left text-xs text-slate-400 px-4 py-3">Evento</th>
                <th className="text-left text-xs text-slate-400 px-4 py-3">Usuario</th>
                <th className="text-left text-xs text-slate-400 px-4 py-3">IP</th>
                <th className="text-left text-xs text-slate-400 px-4 py-3">Metadata</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                  <td className="px-4 py-2 text-slate-500 text-xs whitespace-nowrap">
                    {new Date(e.createdAt).toLocaleString("es-ES")}
                  </td>
                  <td className="px-4 py-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      e.event === "login" ? "bg-green-500/20 text-green-400" :
                      e.event === "register" ? "bg-blue-500/20 text-blue-400" :
                      e.event === "lesson_complete" ? "bg-purple-500/20 text-purple-400" :
                      "bg-slate-700 text-slate-400"
                    }`}>
                      {e.event}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-slate-300 text-xs">
                    {e.user ? `${e.user.name ?? ""} (${e.user.email})` : "—"}
                  </td>
                  <td className="px-4 py-2 text-slate-500 text-xs">{e.ip ?? "—"}</td>
                  <td className="px-4 py-2 text-slate-500 text-xs max-w-xs truncate">
                    {e.metadata ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <span className="text-slate-400 text-sm">Página {page} de {totalPages}</span>
            <div className="flex gap-2">
              {page > 1 && (
                <Link href={`/admin/audit?page=${page - 1}`} className="text-blue-400 hover:text-blue-300 text-sm">
                  ← Anterior
                </Link>
              )}
              {page < totalPages && (
                <Link href={`/admin/audit?page=${page + 1}`} className="text-blue-400 hover:text-blue-300 text-sm">
                  Siguiente →
                </Link>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
