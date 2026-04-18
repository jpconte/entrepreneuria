import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/audit";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { lessonId } = await params;
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";

  try {
    const body = await req.json();
    const { status, percent } = body as { status?: string; percent?: number };

    const progress = await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: session.user.id, lessonId } },
      create: {
        userId: session.user.id,
        lessonId,
        status: (status as "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED") ?? "IN_PROGRESS",
        percent: percent ?? 0,
        lastSeenAt: new Date(),
        completedAt: status === "COMPLETED" ? new Date() : null,
      },
      update: {
        status: (status as "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED") ?? "IN_PROGRESS",
        percent: percent ?? 0,
        lastSeenAt: new Date(),
        completedAt: status === "COMPLETED" ? new Date() : undefined,
      },
    });

    if (status === "COMPLETED") {
      await logAuditEvent({
        userId: session.user.id,
        event: "lesson_complete",
        lessonId,
        ip,
        userAgent: req.headers.get("user-agent"),
      });
    } else {
      await logAuditEvent({
        userId: session.user.id,
        event: "lesson_view",
        lessonId,
        ip,
        userAgent: req.headers.get("user-agent"),
      });
    }

    return NextResponse.json({ progress });
  } catch (error) {
    console.error("Progress error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { lessonId } = await params;

  const progress = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId: session.user.id, lessonId } },
  });

  return NextResponse.json({ progress });
}
