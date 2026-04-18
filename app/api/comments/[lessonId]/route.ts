import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeHtml } from "@/lib/sanitize";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const { lessonId } = await params;
  const comments = await prisma.comment.findMany({
    where: { lessonId },
    include: { user: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ comments });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { lessonId } = await params;
  try {
    const body = await req.json();
    const rawContent = body.content as string;
    if (!rawContent?.trim()) {
      return NextResponse.json({ error: "Content required" }, { status: 400 });
    }
    const content = sanitizeHtml(rawContent.trim());

    const comment = await prisma.comment.create({
      data: { userId: session.user.id, lessonId, content },
      include: { user: { select: { id: true, name: true, image: true } } },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error("Comment error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
