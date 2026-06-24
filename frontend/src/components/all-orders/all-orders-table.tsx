"use client";

import Link from "next/link";
import type { Order } from "@/lib/types";
import { formatDate } from "@/lib/due-date";
import { type KpiType, KPI_LABELS } from "./kpi-filters";

interface AllOrdersTableProps {
  orders: Order[];
  kpi: KpiType;
}

const DASH = "—";

function DateCell({ value }: { value?: string | null }) {
  return <>{value ? formatDate(value) : DASH}</>;
}

// Column definitions per KPI
type Column = {
  header: string;
  render: (order: Order) => React.ReactNode;
  align?: "left" | "center";
};

const BASE_COLUMNS: Column[] = [
  {
    header: "Order #",
    render: (o) => (
      <Link
        href={`/framing-orders/${o.dueDate}/${o.id}`}
        className="text-primary-dark font-mono hover:text-primary hover:underline"
      >
        {o.orderNumber}
      </Link>
    ),
  },
  {
    header: "Qty",
    align: "center",
    render: (o) => `(x${o.itemCount})`,
  },
  {
    header: "Customer Name",
    render: (o) => o.customerName || DASH,
  },
  {
    header: "Due Date",
    align: "center",
    render: (o) => <DateCell value={o.dueDate} />,
  },
];

const EXTRA_COLUMNS: Record<KpiType, Column[]> = {
  all: [
    { header: "Verified", align: "center", render: (o) => <DateCell value={o.verifiedAt} /> },
    { header: "Frame Ordered", align: "center", render: (o) => <DateCell value={o.frameOrderedDate} /> },
    { header: "Frame Received", align: "center", render: (o) => <DateCell value={o.frameReceivedDate} /> },
    { header: "Frame Built", align: "center", render: (o) => <DateCell value={o.builtAt} /> },
    { header: "Tabled", align: "center", render: (o) => <DateCell value={o.tabledAt} /> },
    { header: "Completed", align: "center", render: (o) => <DateCell value={o.completedAt} /> },
    { header: "Must Have", align: "center", render: (o) => <DateCell value={o.mustHaveStatus} /> },
    { header: "Delayed", align: "center", render: (o) => <DateCell value={o.delayedStatus} /> },
  ],
  notStarted: [],
  notVerified: [
    { header: "Frame Ordered", align: "center", render: (o) => <DateCell value={o.frameOrderedDate} /> },
    { header: "Frame Received", align: "center", render: (o) => <DateCell value={o.frameReceivedDate} /> },
  ],
  verifiedWaiting: [
    { header: "Verified", align: "center", render: (o) => <DateCell value={o.verifiedAt} /> },
    { header: "Frame Ordered", align: "center", render: (o) => <DateCell value={o.frameOrderedDate} /> },
  ],
  verifiedReceived: [
    { header: "Verified", align: "center", render: (o) => <DateCell value={o.verifiedAt} /> },
    { header: "Frame Received", align: "center", render: (o) => <DateCell value={o.frameReceivedDate} /> },
  ],
  builtWaiting: [
    { header: "Frame Built", align: "center", render: (o) => <DateCell value={o.builtAt} /> },
  ],
  tabledWaiting: [
    { header: "Frame Received", align: "center", render: (o) => <DateCell value={o.frameReceivedDate} /> },
    { header: "Tabled", align: "center", render: (o) => <DateCell value={o.tabledAt} /> },
  ],
  tabledBuilt: [
    { header: "Frame Built", align: "center", render: (o) => <DateCell value={o.builtAt} /> },
    { header: "Tabled", align: "center", render: (o) => <DateCell value={o.tabledAt} /> },
  ],
  completed: [
    { header: "Completed", align: "center", render: (o) => <DateCell value={o.completedAt} /> },
  ],
  mustHave: [
    { header: "Must Have Since", align: "center", render: (o) => <DateCell value={o.mustHaveStatus} /> },
  ],
  delayed: [
    { header: "Delayed Since", align: "center", render: (o) => <DateCell value={o.delayedStatus} /> },
  ],
};

export function AllOrdersTable({ orders, kpi }: AllOrdersTableProps) {
  const columns = [...BASE_COLUMNS, ...EXTRA_COLUMNS[kpi]];

  return (
    <div className="rounded-xl overflow-hidden border border-primary-dark/15 shadow-sm">
      {/* Table heading */}
      <div className="bg-primary-dark px-6 py-4">
        <span className="text-lg font-semibold text-white">{KPI_LABELS[kpi]}</span>
      </div>

      {orders.length === 0 ? (
        <div className="px-6 py-10 text-center text-base text-primary/60">
          No orders in this category
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-primary-dark/10 bg-light-grey">
              {columns.map((col) => (
                <th
                  key={col.header}
                  className={`px-4 py-3 text-sm font-semibold text-primary-dark ${
                    col.align === "center" ? "text-center" : "text-left"
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr
                key={order.id}
                className={`border-b border-primary-dark/10 ${
                  idx % 2 === 0 ? "bg-white" : "bg-light-grey"
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={col.header}
                    className={`px-4 py-3 text-sm text-primary-dark ${
                      col.align === "center" ? "text-center" : ""
                    }`}
                  >
                    {col.render(order)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
