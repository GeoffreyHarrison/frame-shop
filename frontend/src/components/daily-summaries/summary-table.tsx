"use client";

import Link from "next/link";
import type { Order } from "@/lib/types";
import { formatDate } from "@/lib/due-date";

interface SummaryTableProps {
  title: string;
  orders: Order[];
  isLoading: boolean;
}

export function SummaryTable({ title, orders, isLoading }: SummaryTableProps) {
  return (
    <div className="rounded-xl overflow-hidden border border-primary-dark/15 shadow-sm">
      {/* Header */}
      <div className="bg-primary-dark px-6 py-4">
        <span className="text-lg font-semibold text-white">{title}</span>
      </div>

      {/* Table or Empty State */}
      {orders.length === 0 ? (
        <div className="px-6 py-8 text-center text-base text-primary/60">
          No orders
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-primary-dark/10 bg-light-grey">
              <th className="text-left px-6 py-3 text-sm font-semibold text-primary-dark">
                Order #
              </th>
              <th className="text-center px-6 py-3 text-sm font-semibold text-primary-dark">
                Qty
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-primary-dark">
                Customer Name
              </th>
              <th className="text-center px-6 py-3 text-sm font-semibold text-primary-dark">
                Due Date
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr
                key={order.id}
                className={`border-b border-primary-dark/10 transition-opacity ${
                  isLoading ? "opacity-50" : ""
                } ${idx % 2 === 0 ? "bg-white" : "bg-light-grey"}`}
              >
                <td className="px-6 py-3 text-sm">
                  <Link
                    href={`/framing-orders/${order.dueDate}/${order.id}`}
                    className="text-primary-dark font-mono hover:text-primary hover:underline"
                  >
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-6 py-3 text-sm text-primary text-center">
                  (x{order.itemCount})
                </td>
                <td className="px-6 py-3 text-sm text-primary-dark">
                  {order.customerName || "Unknown"}
                </td>
                <td className="px-6 py-3 text-sm text-primary text-center">
                  {formatDate(order.dueDate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
