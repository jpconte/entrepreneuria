import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await params;
  const userId = session.user.id;

  // Get lesson IDs in this course
  const lessons = await prisma.lesson.findMany({
    where: { module: { courseId } },
    select: { id: true },
  });

  const lessonIds = lessons.map((l) => l.id);

  await prisma.lessonProgress.deleteMany({
    where: { userId, lessonId: { in: lessonIds } },
  });

  return NextResponse.json({ success: true });
}
