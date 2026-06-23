import { prisma } from "./prisma";
import type { Order, Customer, FrameToOrder, OrdersByDay } from "./types";
import { getDayName } from "./due-date";

function toDateStr(date: Date): string {
  return date.toISOString().split("T")[0];
}

function toDateStrOrUndefined(date: Date | null): string | undefined {
  return date ? date.toISOString().split("T")[0] : undefined;
}

function mapOrder(row: any): Order {
  return {
    id: row.id,
    customerId: row.customerId,
    customerName: row.customer
      ? `${row.customer.firstName} ${row.customer.lastName}`
      : undefined,
    customerContactMethod: row.customer?.contactMethod,
    orderNumber: row.orderNumber,
    description: row.description,
    dueDate: toDateStr(row.dueDate),
    takenDate: toDateStr(row.takenDate),
    must: row.must,
    type: row.type,
    store: row.store,
    designer: row.designer,
    totalPrice: row.totalPrice,
    codPrice: row.codPrice,
    itemCount: row.itemCount,
    frameSku: row.frameSku,
    frameNotes: row.frameNotes,
    frameQty: row.frameQty,
    frameSize: row.frameSize,
    footage: row.footage,
    topMat: row.topMat ?? "",
    secondMat: row.secondMat ?? "",
    thirdMat: row.thirdMat ?? "",
    matNotes: row.matNotes ?? "",
    matWidthLessThan: row.matWidthLessThan,
    glass: row.glass,
    overSize: row.overSize,
    mounting: row.mounting,
    notes: row.notes ?? "",
    delayed: row.delayed,
    verified: row.verified,
    verifiedDate: toDateStrOrUndefined(row.verifiedDate),
    tabled: row.tabled,
    tabledDate: toDateStrOrUndefined(row.tabledDate),
    frameBuilt: row.frameBuilt,
    frameBuiltDate: toDateStrOrUndefined(row.frameBuiltDate),
    frameReceived: row.frameReceived,
    frameReceivedDate: toDateStrOrUndefined(row.frameReceivedDate),
    completed: row.completed,
    completedDate: toDateStrOrUndefined(row.completedDate),
    // New status timestamp columns (task 1.1)
    receivedAt: toDateStrOrUndefined(row.receivedAt),
    verifiedAt: toDateStrOrUndefined(row.verifiedAt),
    tabledAt: toDateStrOrUndefined(row.tabledAt),
    builtAt: toDateStrOrUndefined(row.builtAt),
    completedAt: toDateStrOrUndefined(row.completedAt),
    pickedUpAt: toDateStrOrUndefined(row.pickedUpAt),
    mustHaveStatus: toDateStrOrUndefined(row.mustHaveStatus),
    delayedStatus: toDateStrOrUndefined(row.delayedStatus),
    binLocation: row.binLocation ?? undefined,
    orderCreatedAt: toDateStrOrUndefined(row.orderCreatedAt),
    comments: (row.comments ?? []).map((c: any) => ({
      id: c.id,
      author: c.author,
      text: c.text,
      createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : c.createdAt,
    })),
  };
}

function mapCustomer(row: any): Customer {
  return {
    id: row.id,
    lastName: row.lastName,
    firstName: row.firstName,
    phone: row.phone,
    contactMethod: row.contactMethod as Customer["contactMethod"],
    address: row.address ?? undefined,
    suite: row.suite ?? undefined,
    spouse: row.spouse ?? undefined,
    city: row.city ?? undefined,
    state: row.state ?? undefined,
    zip: row.zip ?? undefined,
    email: row.email ?? undefined,
    phone2: row.secondPhone ?? undefined,
    company: row.company ?? undefined,
    rewards: row.rewards,
    discount: row.discount ?? undefined,
    type: row.type as Customer["type"],
    taxable: row.taxable,
    taxId: row.taxId ?? undefined,
    notes: row.notes ?? undefined,
  };
}

function mapFrameToOrder(row: any): FrameToOrder {
  return {
    id: row.id,
    orderId: row.orderId,
    orderNumber: row.order?.orderNumber ?? "",
    customerName: row.order?.customer
      ? `${row.order.customer.firstName} ${row.order.customer.lastName}`
      : "",
    frameSku: row.frameSku,
    frameNotes: row.frameNotes,
    footage: row.footage,
    size: row.size,
    qty: row.qty,
    vendor: row.vendor,
    status: row.status as FrameToOrder["status"],
    orderedDate: toDateStrOrUndefined(row.orderedDate),
  };
}

export async function getOrdersByDay(): Promise<OrdersByDay[]> {
  const rows = await prisma.order.findMany({
    orderBy: { dueDate: "asc" },
    include: { comments: true },
  });

  const grouped = new Map<string, any[]>();
  for (const row of rows) {
    const dateStr = toDateStr(row.dueDate);
    const existing = grouped.get(dateStr) ?? [];
    existing.push(row);
    grouped.set(dateStr, existing);
  }

  const result: OrdersByDay[] = [];
  for (const [date, dayRows] of grouped) {
    result.push({
      dayName: getDayName(date),
      date,
      orderCount: dayRows.length,
      orders: dayRows.map(mapOrder),
    });
  }

  return result;
}

export async function getOrdersForDate(date: string): Promise<Order[]> {
  const dayStart = new Date(`${date}T00:00:00.000Z`);
  const dayEnd = new Date(`${date}T23:59:59.999Z`);

  const rows = await prisma.order.findMany({
    where: { dueDate: { gte: dayStart, lte: dayEnd } },
    include: { customer: true, comments: true },
    orderBy: { orderNumber: "asc" },
  });

  return rows.map(mapOrder);
}

export async function getOrderWithCustomer(
  id: string
): Promise<{ order: Order; customer: Customer } | null> {
  const row = await prisma.order.findUnique({
    where: { id },
    include: { customer: true, comments: true },
  });

  if (!row) return null;

  return { order: mapOrder(row), customer: mapCustomer(row.customer) };
}

export async function getAllFramesToOrder(): Promise<FrameToOrder[]> {
  const rows = await prisma.frameToOrder.findMany({
    include: { order: { include: { customer: true } } },
    orderBy: [{ vendor: "asc" }, { frameSku: "asc" }],
  });

  return rows.map(mapFrameToOrder);
}

export async function getOrderedFramesForVendor(
  vendor: string
): Promise<FrameToOrder[]> {
  const rows = await prisma.frameToOrder.findMany({
    where: { vendor, status: "Ordered" },
    include: { order: { include: { customer: true } } },
    orderBy: { frameSku: "asc" },
  });

  return rows.map(mapFrameToOrder);
}

export async function getOrdersWaitingForPickup(): Promise<Order[]> {
  const rows = await prisma.order.findMany({
    where: {
      completedAt: { not: null },
      pickedUpAt: null,
    },
    include: { customer: true, comments: true },
    orderBy: { dueDate: "asc" },
  });

  return rows.map(mapOrder);
}

// Daily Summaries queries
export async function getOrdersCreatedOnDate(date: string): Promise<Order[]> {
  const dayStart = new Date(`${date}T00:00:00.000Z`);
  const dayEnd = new Date(`${date}T23:59:59.999Z`);

  const rows = await prisma.order.findMany({
    where: { orderCreatedAt: { gte: dayStart, lte: dayEnd } },
    include: { customer: true, comments: true },
    orderBy: { orderNumber: "asc" },
  });

  return rows.map(mapOrder);
}

export async function getOrdersCompletedOnDate(date: string): Promise<Order[]> {
  const dayStart = new Date(`${date}T00:00:00.000Z`);
  const dayEnd = new Date(`${date}T23:59:59.999Z`);

  const rows = await prisma.order.findMany({
    where: { completedAt: { gte: dayStart, lte: dayEnd } },
    include: { customer: true, comments: true },
    orderBy: { orderNumber: "asc" },
  });

  return rows.map(mapOrder);
}

export async function getOrdersPickedUpOnDate(date: string): Promise<Order[]> {
  const dayStart = new Date(`${date}T00:00:00.000Z`);
  const dayEnd = new Date(`${date}T23:59:59.999Z`);

  const rows = await prisma.order.findMany({
    where: { pickedUpAt: { gte: dayStart, lte: dayEnd } },
    include: { customer: true, comments: true },
    orderBy: { orderNumber: "asc" },
  });

  return rows.map(mapOrder);
}
