import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";

export default async function LearnRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      modules: {
        include: {
          lessons: { orderBy: { orderIndex: "asc" } },
        },
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!course) notFound();

  // Enroll user if not already enrolled
  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
    create: { userId: session.user.id, courseId: course.id, status: "ACTIVE" },
    update: {},
  });

  // Find last seen lesson
  const allLessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
  const lastProgress = await prisma.lessonProgress.findFirst({
    where: { userId: session.user.id, lessonId: { in: allLessonIds } },
    orderBy: { lastSeenAt: "desc" },
  });

  const targetLessonId = lastProgress?.lessonId ?? course.modules[0]?.lessons[0]?.id;

  if (!targetLessonId) notFound();

  redirect(`/courses/${slug}/learn/${targetLessonId}`);
}
