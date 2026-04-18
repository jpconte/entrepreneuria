import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getLibsqlUrl(dbUrl: string): string {
  if (dbUrl.startsWith("file:./") || (dbUrl.startsWith("file:") && !dbUrl.startsWith("file:/"))) {
    const relative = dbUrl.replace("file:", "");
    return "file:" + path.resolve(process.cwd(), relative);
  }
  return dbUrl;
}

function createPrismaClient() {
  const rawUrl = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
  const url = getLibsqlUrl(rawUrl);
  const adapter = new PrismaLibSql({ url });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
