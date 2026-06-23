"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import type { Order } from "@/lib/types";
import { formatDate } from "@/lib/due-date";
import {
  updateOrderStatus,
  clearOrderStatus,
} from "@/app/actions/order-status";

interface BinventoryTableProps {
  orders: Order[];
}

type SortField = "bin" | "dueDate" | "orderNumber" | "customerName";
type SortDirection = "asc" | "desc";

const PICKED_UP_BUTTON_SIZE = 32;

export function BinventoryTable({ orders: initialOrders }: BinventoryTableProps) {
  const [sortField, setSortField] = useState<SortField>("dueDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [orders, setOrders] = useState(initialOrders);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handlePickedUp = async (orderId: string, isPickedUp: boolean) => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      if (isPickedUp) {
        await clearOrderStatus(orderId, "pickedUp");
      } else {
        await updateOrderStatus(orderId, "pickedUp");
      }
      // Remove from local list
      setOrders(orders.filter(o => o.id !== orderId));
    } finally {
      setIsUpdating(false);
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortField) {
      case "bin":
        aValue = a.binLocation || "";
        bValue = b.binLocation || "";
        break;
      case "dueDate":
        aValue = new Date(a.dueDate).getTime();
        bValue = new Date(b.dueDate).getTime();
        break;
      case "orderNumber":
        aValue = a.orderNumber;
        bValue = b.orderNumber;
        break;
      case "customerName":
        aValue = a.customerName || "";
        bValue = b.customerName || "";
        break;
      default:
        aValue = "";
        bValue = "";
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  if (orders.length === 0) {
    return (
      <div className="px-6 py-10 text-center text-base text-primary/60">
        No orders waiting for pickup
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sort Options */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-sm text-primary-dark">Sort by:</span>
        <div className="flex items-center gap-2 flex-wrap">
          {(["bin", "dueDate", "orderNumber", "customerName"] as const).map((field) => (
            <button
              key={field}
              onClick={() => handleSort(field)}
              className={`px-3 py-1.5 text-sm rounded border transition-colors ${
                sortField === field
                  ? "bg-primary-dark text-panel border-primary-dark"
                  : "border-primary-dark/20 text-primary-dark hover:bg-primary/5"
              }`}
            >
              {field === "bin" && "Bin Name"}
              {field === "dueDate" && "Due Date"}
              {field === "orderNumber" && "Order Number"}
              {field === "customerName" && "Customer Name"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortDirection("asc")}
            className={`px-3 py-1.5 text-sm rounded border transition-colors ${
              sortDirection === "asc"
                ? "bg-primary-dark text-panel border-primary-dark"
                : "border-primary-dark/20 text-primary-dark hover:bg-primary/5"
            }`}
          >
            ↑ Ascending
          </button>
          <button
            onClick={() => setSortDirection("desc")}
            className={`px-3 py-1.5 text-sm rounded border transition-colors ${
              sortDirection === "desc"
                ? "bg-primary-dark text-panel border-primary-dark"
                : "border-primary-dark/20 text-primary-dark hover:bg-primary/5"
            }`}
          >
            ↓ Descending
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden border border-primary-dark/15">
        <table className="w-full">
          <thead>
            <tr className="bg-primary-dark">
              <th className="text-left px-4 py-3 text-sm font-semibold text-white">Bin</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white">Order #</th>
              <th className="text-center px-4 py-3 text-sm font-semibold text-white">Qty</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white">Customer Name</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-white">Contact</th>
              <th className="text-center px-4 py-3 text-sm font-semibold text-white">Due Date</th>
              <th className="text-center px-4 py-3 text-sm font-semibold text-white">Picked Up</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order, idx) => (
              <tr
                key={order.id}
                className={`border-b border-primary-dark/10 ${
                  idx % 2 === 0 ? "bg-white" : "bg-light-grey"
                }`}
              >
                <td className="px-4 py-3 text-sm text-primary-dark font-mono font-bold">
                  {order.binLocation || "—"}
                </td>
                <td className="px-4 py-3 text-sm">
                  <Link
                    href={`/framing-orders/${order.dueDate}/${order.id}`}
                    className="text-primary-dark font-mono hover:text-primary hover:underline"
                  >
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm text-primary text-center">(x{order.itemCount})</td>
                <td className="px-4 py-3 text-sm text-primary-dark">
                  {order.customerName || "Unknown"}
                </td>
                <td className="px-4 py-3 text-sm text-primary/70">—</td>
                <td className="px-4 py-3 text-sm text-primary text-center">{formatDate(order.dueDate)}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handlePickedUp(order.id, false)}
                    disabled={isUpdating}
                    className="hover:scale-105 transition-transform cursor-pointer shrink-0 disabled:opacity-50 inline-flex items-center justify-center"
                    title="Picked Up"
                  >
                    <div
                      style={{ width: PICKED_UP_BUTTON_SIZE, height: PICKED_UP_BUTTON_SIZE }}
                      className="rounded-full flex items-center justify-center shrink-0 transition-colors border border-primary/25 bg-transparent"
                    >
                      <ShoppingBag
                        size={Math.round(PICKED_UP_BUTTON_SIZE * 0.52)}
                        className="text-primary/25"
                        strokeWidth={2}
                      />
                    </div>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
