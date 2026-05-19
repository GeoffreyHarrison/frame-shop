"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { StatusIconButton } from "./status-icon-button";
import { CommentDialog } from "./comment-dialog";
import type { Order } from "@/lib/types";
import customersData from "@/data/dummy-customers.json";

interface DailyDetailTableProps {
  orders: Order[];
  date: string;
}

export function DailyDetailTable({ orders, date }: DailyDetailTableProps) {
  const getCustomerName = (customerId: string) => {
    const customer = customersData.find((c) => c.id === customerId);
    return customer
      ? `${customer.firstName} ${customer.lastName}`
      : "Unknown Customer";
  };

  return (
    <div className="border border-warm-border rounded-xl overflow-hidden">
      {orders.length === 0 ? (
        <div className="px-6 py-10 text-center text-base text-primary/60">
          No orders for this date
        </div>
      ) : (
        <div className="divide-y divide-warm-border">
          {orders.map((order) => (
            <div
              key={order.id}
              className="hover:bg-light-grey/40 transition-colors"
            >
              {/* Top Row */}
              <div className="flex items-center gap-4 px-6 py-3">
                <span className="text-base font-medium text-primary-dark min-w-[180px]">
                  {getCustomerName(order.customerId)}
                </span>
                <span className="text-sm text-primary/50">
                  ({order.binLocation || ""})
                </span>
                <span className="text-base text-primary font-mono">
                  {order.orderNumber}
                </span>
                <span className="text-sm text-primary/60">
                  (x{order.itemCount})
                </span>
                <div className="flex-1" />
                <StatusIconButton type="must" active={order.must} size={20} />
                <StatusIconButton type="delayed" active={order.delayed} size={20} />
                <CommentDialog
                  comments={order.comments}
                  hasComments={order.comments.length > 0}
                />
                <Link
                  href={`/framing-orders/${date}/${order.id}`}
                  className="inline-flex p-1.5 text-primary-dark hover:bg-light-grey rounded-lg transition-colors"
                  title="View order details"
                >
                  <Eye size={20} />
                </Link>
              </div>

              {/* Bottom Row - Status Icons */}
              <div className="flex items-center gap-5 px-6 pb-3 pl-10">
                <div className="flex items-center gap-1.5">
                  <StatusIconButton
                    type="verified"
                    active={order.verified}
                    size={20}
                  />
                  <span className="text-sm text-primary/50">Verified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <StatusIconButton type="tabled" active={order.tabled} size={20} />
                  <span className="text-sm text-primary/50">Tabled</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <StatusIconButton
                    type="built"
                    active={order.frameBuilt}
                    size={20}
                  />
                  <span className="text-sm text-primary/50">Built</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <StatusIconButton
                    type="completed"
                    active={order.completed}
                    size={20}
                  />
                  <span className="text-sm text-primary/50">Complete</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
