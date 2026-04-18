import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const moduleSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  orderIndex: z.number().int().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  duration: z.string().optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes(session.user.role ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { moduleId } = await params;
  const body = await req.json();
  const result = moduleSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
  }

  const mod = await prisma.module.update({ where: { id: moduleId }, data: result.data });
  return NextResponse.json({ module: mod });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes(session.user.role ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { moduleId } = await params;
  await prisma.module.delete({ where: { id: moduleId } });
  return NextResponse.json({ success: true });
}
