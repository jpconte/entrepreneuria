import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";
import Fuse from "fuse.js";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (!query) return NextResponse.json({ results: [] });

  const ip = req.headers.get("x-forwarded-for") ?? "unknown";

  const lessons = await prisma.lesson.findMany({
    include: {
      module: {
        include: { course: { select: { title: true, slug: true } } },
      },
    },
    where: {
      module: { course: { published: true } },
    },
  });

  const fuse = new Fuse(lessons, {
    keys: [
      { name: "title", weight: 2 },
      { name: "content", weight: 1 },
    ],
    includeScore: true,
    threshold: 0.4,
  });

  const results = fuse.search(query).slice(0, 20).map((r) => ({
    id: r.item.id,
    title: r.item.title,
    score: r.score,
    module: {
      id: r.item.moduleId,
      title: r.item.module.title,
      course: r.item.module.course,
    },
  }));

  await logAuditEvent({
    userId: session?.user?.id ?? null,
    event: "search",
    ip,
    userAgent: req.headers.get("user-agent"),
    metadata: { query, resultCount: results.length },
  });

  return NextResponse.json({ results });
}
