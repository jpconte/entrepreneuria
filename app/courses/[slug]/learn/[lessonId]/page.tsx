import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { LessonPlayer } from "@/components/learn/LessonPlayer";
import { logAuditEvent } from "@/lib/audit";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  const { slug, lessonId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) redirect("/login");

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      modules: {
        include: {
          lessons: {
            select: { id: true, title: true, orderIndex: true, durationMinutes: true },
            orderBy: { orderIndex: "asc" },
          },
        },
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!course) notFound();

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { module: true },
  });

  if (!lesson) notFound();

  // Ensure enrollment
  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
    create: { userId: session.user.id, courseId: course.id, status: "ACTIVE" },
    update: {},
  });

  // Update progress to IN_PROGRESS if not completed
  const existingProgress = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId: session.user.id, lessonId } },
  });

  if (!existingProgress || existingProgress.status === "NOT_STARTED") {
    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: session.user.id, lessonId } },
      create: { userId: session.user.id, lessonId, status: "IN_PROGRESS", lastSeenAt: new Date() },
      update: { status: "IN_PROGRESS", lastSeenAt: new Date() },
    });
  } else {
    await prisma.lessonProgress.update({
      where: { userId_lessonId: { userId: session.user.id, lessonId } },
      data: { lastSeenAt: new Date() },
    });
  }

  // Get all progress for this course
  const allLessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
  const progressRecords = await prisma.lessonProgress.findMany({
    where: { userId: session.user.id, lessonId: { in: allLessonIds } },
  });

  const progressMap = Object.fromEntries(progressRecords.map((p) => [p.lessonId, p.status]));

  // Get user's note
  const note = await prisma.lessonNote.findUnique({
    where: { userId_lessonId: { userId: session.user.id, lessonId } },
  });

  // Build flat lesson list for prev/next navigation
  const allLessons = course.modules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleTitle: m.title }))
  );
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  await logAuditEvent({
    userId: session.user.id,
    event: "lesson_view",
    lessonId,
    courseId: course.id,
    metadata: { lessonTitle: lesson.title },
  });

  return (
    <LessonPlayer
      course={{ id: course.id, title: course.title, slug: course.slug, modules: course.modules }}
      lesson={lesson}
      progressMap={progressMap}
      noteContent={note?.content ?? ""}
      prevLesson={prevLesson}
      nextLesson={nextLesson}
      userId={session.user.id}
      isCompleted={existingProgress?.status === "COMPLETED"}
    />
  );
}
