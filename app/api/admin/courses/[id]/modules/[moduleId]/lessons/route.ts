import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeHtml } from "@/lib/sanitize";
import { z } from "zod";

const lessonSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().optional(),
  orderIndex: z.number().int().optional(),
  durationMinutes: z.number().int().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes(session.user.role ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { moduleId } = await params;
  const lessons = await prisma.lesson.findMany({
    where: { moduleId },
    orderBy: { orderIndex: "asc" },
  });

  return NextResponse.json({ lessons });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes(session.user.role ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { moduleId } = await params;
  const body = await req.json();
  const result = lessonSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
  }

  const count = await prisma.lesson.count({ where: { moduleId } });
  const sanitized = result.data.content ? sanitizeHtml(result.data.content) : null;

  const lesson = await prisma.lesson.create({
    data: {
      moduleId,
      title: result.data.title,
      content: sanitized,
      orderIndex: result.data.orderIndex ?? count,
      durationMinutes: result.data.durationMinutes ?? 0,
    },
  });

  return NextResponse.json({ lesson }, { status: 201 });
}
