import { PrismaClient } from "@prisma/client";

// Standard Next.js/Prisma singleton pattern: avoids exhausting the
// PostgreSQL connection pool from creating a new PrismaClient on every hot
// reload in development, while still creating a single instance per
// serverless function invocation in production.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
