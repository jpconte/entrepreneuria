import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format") ?? "json";
  const userId = session.user.id;

  const progress = await prisma.lessonProgress.findMany({
    where: { userId },
    include: {
      lesson: {
        include: {
          module: {
            include: { course: { select: { title: true, slug: true } } },
          },
        },
      },
    },
  });

  if (format === "csv") {
    const rows = [
      ["Course", "Module", "Lesson", "Status", "Percent", "CompletedAt", "LastSeenAt"],
      ...progress.map((p) => [
        p.lesson.module.course.title,
        p.lesson.module.title,
        p.lesson.title,
        p.status,
        p.percent.toString(),
        p.completedAt?.toISOString() ?? "",
        p.lastSeenAt.toISOString(),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="progress-${userId}.csv"`,
      },
    });
  }

  return new NextResponse(JSON.stringify(progress, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="progress-${userId}.json"`,
    },
  });
}
