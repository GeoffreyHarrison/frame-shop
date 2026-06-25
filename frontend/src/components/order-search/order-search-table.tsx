"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import type { Order } from "@/lib/types";
import { formatDate } from "@/lib/due-date";
import { StatusIconButton } from "@/components/framing-orders/status-icon-button";
import {
  updateOrderStatus,
  clearOrderStatus,
  updateBinLocation,
} from "@/app/actions/order-status";

interface OrderSearchTableProps {
  orders: Order[];
}

const BUTTON_SIZE = 32;

export function OrderSearchTable({ orders: initialOrders }: OrderSearchTableProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [isUpdating, setIsUpdating] = useState(false);
  const [binInputs, setBinInputs] = useState<Record<string, string>>(
    () => Object.fromEntries(initialOrders.map((o) => [o.id, o.binLocation ?? ""]))
  );

  const handleVerifyToggle = async (orderId: string) => {
    if (isUpdating) return;
    setIsUpdating(true);
    const order = orders.find((o) => o.id === orderId);
    if (!order) { setIsUpdating(false); return; }

    const isVerified = Boolean(order.verifiedAt);
    try {
      if (isVerified) {
        await clearOrderStatus(orderId, "verified");
      } else {
        await updateOrderStatus(orderId, "verified");
      }
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, verifiedAt: isVerified ? null : new Date().toISOString() }
            : o
        )
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePickedUp = async (orderId: string) => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await updateOrderStatus(orderId, "pickedUp");
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBinSave = async (orderId: string) => {
    const value = binInputs[orderId] ?? "";
    await updateBinLocation(orderId, value);
  };

  if (orders.length === 0) {
    return (
      <div className="px-6 py-10 text-center text-base text-primary/60">
        No orders found
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-primary-dark/15">
      <table className="w-full">
        <thead>
          <tr className="bg-primary-dark">
            <th className="text-left px-4 py-3 text-sm font-semibold text-white">Order #</th>
            <th className="text-left px-4 py-3 text-sm font-semibold text-white">Last Name</th>
            <th className="text-left px-4 py-3 text-sm font-semibold text-white">First Name</th>
            <th className="text-left px-4 py-3 text-sm font-semibold text-white">Bin</th>
            <th className="text-left px-4 py-3 text-sm font-semibold text-white">Frame SKU</th>
            <th className="text-center px-4 py-3 text-sm font-semibold text-white">Date Taken</th>
            <th className="text-center px-4 py-3 text-sm font-semibold text-white">Verify</th>
            <th className="text-center px-4 py-3 text-sm font-semibold text-white">Picked Up</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, idx) => {
            const rowBg = idx % 2 === 0 ? "bg-white" : "bg-light-grey";
            const verified = Boolean(order.verifiedAt);

            return (
              <Fragment key={order.id}>
                <tr className={`border-b border-primary-dark/5 ${rowBg}`}>
                  <td className="px-4 py-3 text-sm">
                    <Link
                      href={`/framing-orders/${order.dueDate}/${order.id}`}
                      className="text-primary-dark font-mono hover:text-primary hover:underline"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-primary-dark">
                    {order.customerLastName ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-primary-dark">
                    {order.customerFirstName ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <input
                      type="text"
                      value={binInputs[order.id] ?? ""}
                      onChange={(e) =>
                        setBinInputs((prev) => ({ ...prev, [order.id]: e.target.value }))
                      }
                      onBlur={() => handleBinSave(order.id)}
                      onKeyDown={(e) => e.key === "Enter" && handleBinSave(order.id)}
                      className="w-16 px-2 py-1 text-sm text-primary-dark font-mono border border-primary-dark/20 rounded focus:outline-none focus:border-primary-dark"
                      placeholder="—"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-primary-dark font-mono">
                    {order.frameSku || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-primary text-center">
                    {formatDate(order.takenDate)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center">
                      <StatusIconButton
                        type="verified"
                        active={verified}
                        onClick={() => handleVerifyToggle(order.id)}
                        size={BUTTON_SIZE}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handlePickedUp(order.id)}
                      disabled={isUpdating}
                      className="hover:scale-105 transition-transform cursor-pointer shrink-0 disabled:opacity-50 inline-flex items-center justify-center"
                      title="Mark as Picked Up"
                    >
                      <div
                        style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }}
                        className="rounded-full flex items-center justify-center shrink-0 transition-colors border border-primary/25 bg-transparent"
                      >
                        <ShoppingBag
                          size={Math.round(BUTTON_SIZE * 0.52)}
                          className="text-primary/25"
                          strokeWidth={2}
                        />
                      </div>
                    </button>
                  </td>
                </tr>
                {order.frameNotes && (
                  <tr className={`border-b border-primary-dark/10 ${rowBg}`}>
                    <td colSpan={8} className="px-4 pb-3 pt-0">
                      <span className="text-xs text-primary/60 italic">{order.frameNotes}</span>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
