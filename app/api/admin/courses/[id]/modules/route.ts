import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const moduleSchema = z.object({
  title: z.string().min(1).max(200),
  orderIndex: z.number().int().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  duration: z.string().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes(session.user.role ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const modules = await prisma.module.findMany({
    where: { courseId: id },
    include: { lessons: { orderBy: { orderIndex: "asc" } } },
    orderBy: { orderIndex: "asc" },
  });

  return NextResponse.json({ modules });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes(session.user.role ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const result = moduleSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const count = await prisma.module.count({ where: { courseId: id } });
    const mod = await prisma.module.create({
      data: {
        courseId: id,
        orderIndex: result.data.orderIndex ?? count,
        title: result.data.title,
        icon: result.data.icon,
        color: result.data.color,
        duration: result.data.duration,
      },
    });

    return NextResponse.json({ module: mod }, { status: 201 });
  } catch (error) {
    console.error("Module create error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
