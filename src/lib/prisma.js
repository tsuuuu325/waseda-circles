import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis;

function shouldUseTursoAdapter() {
  const url = process.env.DATABASE_URL || "";

  return (
    url.startsWith("libsql://") ||
    url.startsWith("libsqls://") ||
    url.includes(".turso.io")
  );
}

function createPrismaClient() {
  if (shouldUseTursoAdapter()) {
    if (!process.env.TURSO_AUTH_TOKEN) {
      throw new Error("TURSO_AUTH_TOKEN が設定されていません。");
    }

    const adapter = new PrismaLibSQL({
      url: process.env.DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    return new PrismaClient({ adapter });
  }

  return new PrismaClient();
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
