"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { StatusIconButton } from "./status-icon-button";
import { CommentDialog } from "./comment-dialog";
import type { Order } from "@/lib/types";
import {
  updateOrderStatus,
  clearOrderStatus,
} from "@/app/actions/order-status";

interface DailyDetailTableProps {
  orders: Order[];
  date: string;
}

const CIRCLE_SIZE = 36;
const BADGE_SIZE = 34;
const EYE_SIZE = 38;

export function DailyDetailTable({ orders, date }: DailyDetailTableProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusToggle = async (orderId: string, status: string) => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      const statusMap: Record<string, 'verified' | 'tabled' | 'built' | 'completed' | 'mustHave' | 'delayed'> = {
        verified: 'verified',
        tabled: 'tabled',
        built: 'built',
        completed: 'completed',
        must: 'mustHave',
        delayed: 'delayed',
      };

      const statusType = statusMap[status];
      if (!statusType) return;

      // Check if status is already set based on timestamp
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      const isActive = Boolean(
        status === 'verified' ? order.verifiedAt :
        status === 'tabled' ? order.tabledAt :
        status === 'built' ? order.builtAt :
        status === 'completed' ? order.completedAt :
        status === 'must' ? order.mustHaveStatus :
        status === 'delayed' ? order.delayedStatus :
        false
      );

      if (isActive) {
        await clearOrderStatus(orderId, statusType);
      } else {
        await updateOrderStatus(orderId, statusType);
      }
    } finally {
      setIsUpdating(false);
    }
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
            const must = Boolean(order.mustHaveStatus);
            const delayed = Boolean(order.delayedStatus);
            const verified = Boolean(order.verifiedAt);
            const tabled = Boolean(order.tabledAt);
            const built = Boolean(order.builtAt);
            const completed = Boolean(order.completedAt);

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
                      onClick={() => handleStatusToggle(order.id, "must")}
                      size={CIRCLE_SIZE}
                    />
                    <StatusIconButton
                      type="delayed"
                      active={delayed}
                      onClick={() => handleStatusToggle(order.id, "delayed")}
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
                    onClick={() => handleStatusToggle(order.id, "verified")}
                    size={BADGE_SIZE}
                  />
                  <StatusIconButton
                    type="tabled"
                    active={tabled}
                    onClick={() => handleStatusToggle(order.id, "tabled")}
                    size={BADGE_SIZE}
                  />
                  <StatusIconButton
                    type="built"
                    active={built}
                    onClick={() => handleStatusToggle(order.id, "built")}
                    size={BADGE_SIZE}
                  />
                  <StatusIconButton
                    type="completed"
                    active={completed}
                    onClick={() => handleStatusToggle(order.id, "completed")}
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
