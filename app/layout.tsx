import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Entrepreneuria – LMS de Emprendimiento con IA",
  description: "Aprende a emprender en la era digital con IA",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html
      lang="es"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
