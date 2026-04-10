"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
            <span className="text-blue-400">🚀</span>
            <span>Entrepreneuria</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/courses" className="text-slate-300 hover:text-white transition-colors text-sm">
              Cursos
            </Link>
            <Link href="/search" className="text-slate-300 hover:text-white transition-colors text-sm">
              Buscar
            </Link>
            {session ? (
              <>
                <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors text-sm">
                  Dashboard
                </Link>
                {(session.user.role === "ADMIN" || session.user.role === "INSTRUCTOR") && (
                  <Link href="/admin" className="text-slate-300 hover:text-white transition-colors text-sm">
                    Admin
                  </Link>
                )}
                <div className="relative">
                  <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
                      {session.user.name?.charAt(0)?.toUpperCase() ?? "U"}
                    </div>
                  </button>
                  {open && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl border border-slate-700 py-1">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
                        onClick={() => setOpen(false)}
                      >
                        Perfil
                      </Link>
                      <button
                        onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm text-slate-300 hover:text-white transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-slate-300 hover:text-white"
            onClick={() => setOpen(!open)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden py-4 space-y-2 border-t border-slate-800">
            <Link href="/courses" className="block py-2 text-slate-300 hover:text-white text-sm">Cursos</Link>
            <Link href="/search" className="block py-2 text-slate-300 hover:text-white text-sm">Buscar</Link>
            {session ? (
              <>
                <Link href="/dashboard" className="block py-2 text-slate-300 hover:text-white text-sm">Dashboard</Link>
                <Link href="/profile" className="block py-2 text-slate-300 hover:text-white text-sm">Perfil</Link>
                {(session.user.role === "ADMIN" || session.user.role === "INSTRUCTOR") && (
                  <Link href="/admin" className="block py-2 text-slate-300 hover:text-white text-sm">Admin</Link>
                )}
                <button onClick={() => signOut({ callbackUrl: "/" })} className="block py-2 text-red-400 text-sm">
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block py-2 text-slate-300 hover:text-white text-sm">Iniciar sesión</Link>
                <Link href="/register" className="block py-2 text-blue-400 hover:text-blue-300 text-sm">Registrarse</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
