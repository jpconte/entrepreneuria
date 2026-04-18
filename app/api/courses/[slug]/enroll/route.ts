import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/audit";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const course = await prisma.course.findUnique({ where: { slug } });
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  try {
    const enrollment = await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
      create: { userId: session.user.id, courseId: course.id, status: "ACTIVE" },
      update: { status: "ACTIVE" },
    });

    await logAuditEvent({
      userId: session.user.id,
      event: "course_enroll",
      courseId: course.id,
      ip,
      userAgent: req.headers.get("user-agent"),
    });

    return NextResponse.json({ enrollment });
  } catch (error) {
    console.error("Enroll error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
