import { prisma } from "./prisma";

export async function logAuditEvent({
  userId,
  event,
  lessonId,
  courseId,
  metadata,
  ip,
  userAgent,
}: {
  userId?: string | null;
  event: string;
  lessonId?: string | null;
  courseId?: string | null;
  metadata?: Record<string, unknown>;
  ip?: string | null;
  userAgent?: string | null;
}) {
  try {
    await prisma.auditEvent.create({
      data: {
        userId: userId ?? null,
        event,
        lessonId: lessonId ?? null,
        courseId: courseId ?? null,
        metadata: metadata ? JSON.stringify(metadata) : null,
        ip: ip ?? null,
        userAgent: userAgent ?? null,
      },
    });
  } catch (error) {
    console.error("Failed to log audit event:", error);
  }
}
