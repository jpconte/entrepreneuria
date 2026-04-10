import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    include: {
      instructor: { select: { name: true } },
      _count: { select: { modules: true, enrollments: true } },
    },
    take: 6,
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-950 to-purple-900/20" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 text-blue-400 text-sm mb-8">
            <span>🚀</span>
            <span>Plataforma de aprendizaje impulsada por IA</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Aprende a emprender en la{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Era Digital con IA
            </span>
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Domina las herramientas de inteligencia artificial para construir negocios
            exitosos. Cursos prácticos creados por emprendedores reales.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/courses"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:shadow-lg hover:shadow-blue-500/25"
            >
              Ver Cursos Gratuitos
            </Link>
            <Link
              href="/register"
              className="border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all"
            >
              Crear Cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 border-y border-slate-800">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Estudiantes", value: "500+" },
            { label: "Cursos", value: "10+" },
            { label: "Lecciones", value: "150+" },
            { label: "Horas de contenido", value: "50+" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">
            Cursos Disponibles
          </h2>
          <p className="text-slate-400 text-center mb-12">
            Aprende a tu ritmo con contenido estructurado y práctico
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className="bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 group"
              >
                <div className="h-40 bg-gradient-to-br from-blue-900/40 to-purple-900/40 flex items-center justify-center text-6xl">
                  🚀
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{course._count.modules} módulos</span>
                    <span>{course._count.enrollments} estudiantes</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {courses.length === 0 && (
            <div className="text-center py-20 text-slate-500">
              <p className="text-lg">Próximamente tendremos cursos disponibles</p>
              <p className="text-sm mt-2">Regístrate para ser notificado</p>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            ¿Por qué Entrepreneuria?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🤖",
                title: "Contenido con IA",
                desc: "Aprende a usar las últimas herramientas de IA para tu negocio.",
              },
              {
                icon: "📊",
                title: "Seguimiento de Progreso",
                desc: "Visualiza tu avance en tiempo real con métricas detalladas.",
              },
              {
                icon: "💬",
                title: "Comunidad Activa",
                desc: "Conecta con otros emprendedores y comparte experiencias.",
              },
            ].map((f) => (
              <div key={f.title} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para empezar?
          </h2>
          <p className="text-slate-400 mb-8">
            Únete a miles de emprendedores que ya están aprendiendo con nosotros.
          </p>
          <Link
            href="/register"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold px-10 py-4 rounded-xl text-lg transition-all hover:shadow-lg hover:shadow-blue-500/25"
          >
            Empieza Gratis Hoy
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
        <p>© 2024 Entrepreneuria. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
