"use client";

import { useState, type ReactNode } from "react";
import type { Order } from "@/lib/types";
import { formatDate } from "@/lib/due-date";
import { StatusToggleCell, type ListStatus } from "./status-toggle-cell";

export type WorkflowVariant =
  | "verify"
  | "table"
  | "build"
  | "fit"
  | "must"
  | "delayed"
  | "glass";

interface Column {
  header: string;
  align?: "left" | "center";
  render: (order: Order) => ReactNode;
}

const EMPTY_MESSAGE: Record<WorkflowVariant, string> = {
  verify: "No orders to verify",
  table: "No orders to table",
  build: "No frames ready to build",
  fit: "No orders to fit",
  must: "No must have orders",
  delayed: "No delayed orders",
  glass: "No glass to order",
};

const orderNum = (o: Order) => <span className="font-mono text-primary-dark">{o.orderNumber}</span>;
const qty = (o: Order) => <span className="text-primary">(x{o.itemCount})</span>;
const customer = (o: Order) => o.customerName ?? "";
const due = (o: Order) => formatDate(o.dueDate);
const description = (o: Order) => o.description;
const dateOrDash = (d?: string) => (d ? formatDate(d) : "—");

const C = {
  order: { header: "Order #", render: orderNum } as Column,
  qty: { header: "Qty", align: "center", render: qty } as Column,
  customer: { header: "Customer Name", render: customer } as Column,
  due: { header: "Due Date", render: due } as Column,
  description: { header: "Description", render: description } as Column,
};

const COLUMNS: Record<WorkflowVariant, Column[]> = {
  verify: [C.order, C.qty, C.customer, C.due],
  table: [C.order, C.qty, C.customer, C.due, { header: "Mounting", render: (o) => o.mounting }, C.description],
  build: [
    C.order,
    C.qty,
    C.due,
    { header: "Frame Ordered Date", render: (o) => dateOrDash(o.frameOrderedDate) },
    { header: "Frame Received Date", render: (o) => dateOrDash(o.frameReceivedDate) },
    { header: "Frame SKU", render: (o) => <span className="font-mono text-primary-dark">{o.frameSku}</span> },
    { header: "Frame Description", render: (o) => o.frameNotes },
    { header: "Frame Size", render: (o) => o.frameSize },
    { header: "Footage", align: "center", render: (o) => o.footage },
  ],
  fit: [C.order, C.qty, C.customer, C.due, C.description],
  must: [C.order, C.qty, C.customer, C.due, C.description],
  delayed: [C.order, C.qty, C.customer, C.due, C.description],
  glass: [
    C.order,
    C.qty,
    C.due,
    { header: "Size", render: (o) => o.frameSize },
    { header: "Glass", render: (o) => o.glass },
    { header: "Mounting", render: (o) => o.mounting },
  ],
};

// Action columns (round icon buttons), hidden when printing
const ACTIONS: Record<WorkflowVariant, { header: string; status: ListStatus }[]> = {
  verify: [{ header: "Verify", status: "verified" }],
  table: [{ header: "Table", status: "tabled" }],
  build: [{ header: "Frame Built", status: "built" }],
  fit: [{ header: "Completed", status: "completed" }],
  must: [
    { header: "Must Have", status: "must" },
    { header: "Delayed", status: "delayed" },
  ],
  delayed: [
    { header: "Delayed", status: "delayed" },
    { header: "Must Have", status: "must" },
  ],
  glass: [],
};

interface WorkflowOrderTableProps {
  orders: Order[];
  variant: WorkflowVariant;
}

export function WorkflowOrderTable({ orders, variant }: WorkflowOrderTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Disable a row's buttons while its Server Action runs. The page re-fetches after the
  // action (revalidatePath), so a row that no longer matches the query drops off.
  const run = async (orderId: string, fn: () => Promise<unknown>) => {
    if (loadingId) return;
    setLoadingId(orderId);
    try {
      await fn();
    } finally {
      setLoadingId(null);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="px-6 py-10 text-center text-base text-primary/60">
        {EMPTY_MESSAGE[variant]}
      </div>
    );
  }

  const columns = COLUMNS[variant];
  const actions = ACTIONS[variant];

  return (
    <div className="rounded-xl overflow-x-auto border border-primary-dark/15">
      <table className="w-full">
        <thead>
          <tr className="bg-primary-dark">
            {columns.map((col) => (
              <th
                key={col.header}
                className={`px-4 py-3 text-sm font-semibold text-white whitespace-nowrap ${
                  col.align === "center" ? "text-center" : "text-left"
                }`}
              >
                {col.header}
              </th>
            ))}
            {actions.map((a) => (
              <th key={a.header} className="text-center px-4 py-3 text-sm font-semibold text-white whitespace-nowrap no-print">
                {a.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order, idx) => (
            <tr
              key={order.id}
              className={`border-b border-primary-dark/10 ${idx % 2 === 0 ? "bg-white" : "bg-light-grey"}`}
            >
              {columns.map((col) => (
                <td
                  key={col.header}
                  className={`px-4 py-3 text-sm text-primary-dark ${col.align === "center" ? "text-center" : ""}`}
                >
                  {col.render(order)}
                </td>
              ))}
              {actions.map((a) => (
                <td key={a.header} className="px-4 py-2 text-center no-print">
                  <StatusToggleCell
                    order={order}
                    status={a.status}
                    busy={loadingId === order.id}
                    run={run}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
