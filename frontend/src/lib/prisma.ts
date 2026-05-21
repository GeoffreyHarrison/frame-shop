import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  const dbKeys = Object.keys(process.env).filter(k => k.includes("DATABASE") || k.includes("POSTGRES") || k.includes("PG"));
  console.log("[prisma] DATABASE_URL present:", !!url, "| starts with:", url?.slice(0, 15), "| related keys:", dbKeys);
  const adapter = new PrismaPg({
    connectionString: url!,
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
