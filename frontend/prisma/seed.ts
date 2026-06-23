import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import customersData from "../src/data/dummy-customers.json";
import ordersData from "../src/data/dummy-orders.json";
import framesToOrderData from "../src/data/dummy-frames-to-order.json";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

function parseDate(val: string | undefined | null): Date | null {
  if (!val) return null;
  return new Date(val);
}

async function main() {
  console.log("Seeding database...");

  // Clear existing data in correct order to avoid FK violations
  await prisma.frameToOrder.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();

  // Seed customers
  const customerIdMap: Record<string, string> = {};

  for (const c of customersData as any[]) {
    const created = await prisma.customer.create({
      data: {
        lastName: c.lastName,
        firstName: c.firstName,
        phone: c.phone,
        contactMethod: c.contactMethod,
        address: c.address,
        suite: c.suite ?? null,
        spouse: c.spouse ?? null,
        city: c.city,
        state: c.state,
        zip: c.zip,
        email: c.email ?? null,
        secondPhone: c.secondPhone ?? null,
        company: c.company ?? null,
        rewards: c.rewards ?? false,
        discount: c.discount ?? 0,
        type: c.type ?? "Customer",
        taxable: c.taxable ?? true,
        taxId: c.taxId ?? null,
        notes: c.notes ?? null,
      },
    });
    customerIdMap[c.id] = created.id;
  }
  console.log(`  Seeded ${Object.keys(customerIdMap).length} customers`);

  // Seed orders (and their comments)
  const orderIdMap: Record<string, string> = {};
  const now = new Date();

  for (let i = 0; i < ordersData.length; i++) {
    const o = (ordersData as any[])[i];

    // Vary status timestamps for testing
    // Index helps distribute different statuses across orders
    const receivedTime = new Date(now.getTime() - (ordersData.length - i) * 3600000); // staggered by hour
    const verifiedTime = i % 2 === 0 ? new Date(receivedTime.getTime() + 600000) : null; // every 2nd order verified
    const tabledTime = i % 3 === 0 ? new Date(verifiedTime?.getTime() ?? receivedTime.getTime() + 1200000) : null;
    const builtTime = i % 4 === 0 ? new Date(tabledTime?.getTime() ?? receivedTime.getTime() + 1800000) : null;
    const completedTime = i % 5 === 0 ? new Date(builtTime?.getTime() ?? receivedTime.getTime() + 2400000) : null;
    const binLetter = completedTime ? String.fromCharCode(65 + (i % 5)) : null; // A-E for completed orders
    const mustHaveTime = i % 7 === 0 ? new Date(receivedTime.getTime() + 300000) : null;
    const delayedTime = i % 6 === 0 ? new Date(receivedTime.getTime() + 400000) : null;

    const created = await prisma.order.create({
      data: {
        customerId: customerIdMap[o.customerId],
        orderNumber: o.orderNumber,
        description: o.description,
        dueDate: new Date(o.dueDate),
        takenDate: new Date(o.takenDate),
        must: o.must ?? false,
        type: o.type ?? "Framing",
        store: o.store,
        designer: o.designer,
        totalPrice: o.totalPrice,
        codPrice: o.codPrice ?? 0,
        itemCount: o.itemCount ?? 1,
        frameSku: o.frameSku,
        frameNotes: o.frameNotes,
        frameQty: o.frameQty ?? 1,
        frameSize: o.frameSize,
        footage: o.footage,
        topMat: o.topMat || null,
        secondMat: o.secondMat || null,
        thirdMat: o.thirdMat || null,
        matNotes: o.matNotes || null,
        matWidthLessThan: o.matWidthLessThan ?? false,
        glass: o.glass,
        overSize: o.overSize ?? false,
        mounting: o.mounting,
        notes: o.notes || null,
        delayed: o.delayed ?? false,
        verified: o.verified ?? false,
        verifiedDate: parseDate(o.verifiedDate),
        tabled: o.tabled ?? false,
        tabledDate: parseDate(o.tabledDate),
        frameBuilt: o.frameBuilt ?? false,
        frameBuiltDate: parseDate(o.frameBuiltDate),
        frameReceived: o.frameReceived ?? false,
        frameReceivedDate: parseDate(o.frameReceivedDate),
        completed: o.completed ?? false,
        completedDate: parseDate(o.completedDate),
        binLocation: binLetter,
        // New status timestamp columns
        receivedAt: receivedTime,
        verifiedAt: verifiedTime,
        tabledAt: tabledTime,
        builtAt: builtTime,
        completedAt: completedTime,
        pickedUpAt: null, // Not in use yet (task 1.2)
        mustHaveStatus: mustHaveTime,
        delayedStatus: delayedTime,
        comments: {
          create: (o.comments ?? []).map((c: any) => ({
            author: c.author,
            text: c.text,
            createdAt: new Date(c.createdAt),
          })),
        },
      },
    });
    orderIdMap[o.id] = created.id;
  }
  console.log(`  Seeded ${Object.keys(orderIdMap).length} orders with varied status timestamps`);

  // Seed frames to order
  for (const f of framesToOrderData as any[]) {
    await prisma.frameToOrder.create({
      data: {
        orderId: orderIdMap[f.orderId],
        frameSku: f.frameSku,
        frameNotes: f.frameNotes,
        footage: f.footage,
        size: f.size,
        qty: f.qty ?? 1,
        vendor: f.vendor,
        status: f.status ?? "On List",
        orderedDate: parseDate(f.orderedDate),
      },
    });
  }
  console.log(`  Seeded ${framesToOrderData.length} frames to order`);

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
