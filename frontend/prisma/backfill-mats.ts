// One-off: create MatToOrder rows from existing orders' topMat/secondMat/thirdMat.
// Safe to re-run (upsert on [orderId, position]; never overwrites status/dates).
// Usage: npx tsx --tsconfig tsconfig.seed.json prisma/backfill-mats.ts
// Runs against whatever DATABASE_URL points at — check it first!
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log(`Target: ${new URL(process.env.DATABASE_URL!).host}`);
  const orders = await prisma.order.findMany({
    select: { id: true, topMat: true, secondMat: true, thirdMat: true },
  });

  let count = 0;
  for (const o of orders) {
    const mats: [string, string | null][] = [
      ["Top", o.topMat],
      ["Second", o.secondMat],
      ["Third", o.thirdMat],
    ];
    for (const [position, matSku] of mats) {
      if (!matSku) continue;
      await prisma.matToOrder.upsert({
        where: { orderId_position: { orderId: o.id, position } },
        create: { orderId: o.id, position, matSku },
        update: {},
      });
      count++;
    }
  }
  console.log(`Backfilled ${count} mat rows from ${orders.length} orders`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
