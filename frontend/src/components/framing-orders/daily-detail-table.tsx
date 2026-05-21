"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { StatusIconButton } from "./status-icon-button";
import { CommentDialog } from "./comment-dialog";
import type { Order } from "@/lib/types";
import {
  loadOrderStatuses,
  saveOrderStatuses,
  toggleOrderStatus,
  resolveStatus,
  resolveDate,
  type OrderStatusRecord,
} from "@/lib/order-statuses";

interface DailyDetailTableProps {
  orders: Order[];
  date: string;
}

const CIRCLE_SIZE = 36;
const BADGE_SIZE = 34;
const EYE_SIZE = 38;

export function DailyDetailTable({ orders, date }: DailyDetailTableProps) {
  const [allStatuses, setAllStatuses] = useState<Record<string, OrderStatusRecord>>({});

  useEffect(() => {
    setAllStatuses(loadOrderStatuses());
    const onUpdate = () => setAllStatuses(loadOrderStatuses());
    window.addEventListener("orderStatusUpdated", onUpdate);
    return () => window.removeEventListener("orderStatusUpdated", onUpdate);
  }, []);

  const toggle = (
    orderId: string,
    field: Parameters<typeof toggleOrderStatus>[2]
  ) => {
    setAllStatuses((prev) => {
      const next = toggleOrderStatus(prev, orderId, field);
      saveOrderStatuses(next);
      return next;
    });
  };

  return (
    <div className="rounded-xl overflow-hidden border border-primary-dark/15">
      {orders.length === 0 ? (
        <div className="px-6 py-10 text-center text-base text-primary/60">
          No orders for this date
        </div>
      ) : (
        <div>
          {orders.map((order, idx) => {
            const must = resolveStatus(order.id, "must", order.must, allStatuses);
            const delayed = resolveStatus(order.id, "delayed", order.delayed, allStatuses);
            const verified = resolveStatus(order.id, "verified", order.verified, allStatuses);
            const tabled = resolveStatus(order.id, "tabled", order.tabled, allStatuses);
            const built = resolveStatus(order.id, "built", order.frameBuilt, allStatuses);
            const completed = resolveStatus(order.id, "completed", order.completed, allStatuses);

            return (
              <div
                key={order.id}
                className={`hover:bg-primary/5 transition-colors ${
                  idx < orders.length - 1 ? "border-b-2 border-primary-dark/20" : ""
                }`}
              >
                {/* Top Row */}
                <div className="flex items-center gap-4 px-6 pt-4 pb-2">
                  <span className="text-base font-semibold text-primary-dark min-w-[200px]">
                    {order.customerName ?? "Unknown Customer"}
                  </span>
                  <span className="text-sm text-primary/50 shrink-0">
                    ({order.binLocation || "  "})
                  </span>
                  <span className="text-base text-primary font-mono shrink-0">
                    {order.orderNumber}
                  </span>
                  <span className="text-sm text-primary/60 shrink-0">
                    (x{order.itemCount})
                  </span>

                  <div className="flex-1" />

                  {/* must / delayed / comment — grouped */}
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusIconButton
                      type="must"
                      active={must}
                      onClick={() => toggle(order.id, "must")}
                      size={CIRCLE_SIZE}
                    />
                    <StatusIconButton
                      type="delayed"
                      active={delayed}
                      onClick={() => toggle(order.id, "delayed")}
                      size={CIRCLE_SIZE}
                    />
                    <CommentDialog
                      comments={order.comments}
                      hasComments={order.comments.length > 0}
                      size={CIRCLE_SIZE}
                    />
                  </div>

                  {/* visible gap before eye icon */}
                  <div className="w-5 shrink-0" />

                  <Link
                    href={`/framing-orders/${date}/${order.id}`}
                    className="inline-flex items-center justify-center p-1.5 text-primary-dark hover:bg-light-grey rounded-lg transition-colors shrink-0"
                    title="View order details"
                  >
                    <Eye size={EYE_SIZE} />
                  </Link>
                </div>

                {/* Bottom Row — status circles */}
                <div className="flex items-center gap-4 px-6 pb-4 pl-12">
                  <StatusIconButton
                    type="verified"
                    active={verified}
                    onClick={() => toggle(order.id, "verified")}
                    size={BADGE_SIZE}
                  />
                  <StatusIconButton
                    type="tabled"
                    active={tabled}
                    onClick={() => toggle(order.id, "tabled")}
                    size={BADGE_SIZE}
                  />
                  <StatusIconButton
                    type="built"
                    active={built}
                    onClick={() => toggle(order.id, "built")}
                    size={BADGE_SIZE}
                  />
                  <StatusIconButton
                    type="completed"
                    active={completed}
                    onClick={() => toggle(order.id, "completed")}
                    size={BADGE_SIZE}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
