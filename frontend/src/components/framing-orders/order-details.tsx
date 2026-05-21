"use client";

import { useState, useEffect } from "react";
import { StatusIconButton } from "./status-icon-button";
import { CommentDialog } from "./comment-dialog";
import { Download } from "lucide-react";
import type { Order, Customer } from "@/lib/types";
import { formatDate } from "@/lib/due-date";
import {
  loadOrderStatuses,
  saveOrderStatuses,
  toggleOrderStatus,
  resolveStatus,
  resolveDate,
  type OrderStatusRecord,
} from "@/lib/order-statuses";

interface OrderDetailsProps {
  order: Order;
  customer: Customer;
}

const CIRCLE_SIZE = 32;
const BADGE_SIZE = 30;

export function OrderDetails({ order, customer }: OrderDetailsProps) {
  const [binLocation, setBinLocation] = useState(order.binLocation ?? "");
  const [allStatuses, setAllStatuses] = useState<Record<string, OrderStatusRecord>>({});

  useEffect(() => {
    setAllStatuses(loadOrderStatuses());
    const onUpdate = () => setAllStatuses(loadOrderStatuses());
    window.addEventListener("orderStatusUpdated", onUpdate);
    return () => window.removeEventListener("orderStatusUpdated", onUpdate);
  }, []);

  const toggle = (field: Parameters<typeof toggleOrderStatus>[2]) => {
    setAllStatuses((prev) => {
      const next = toggleOrderStatus(prev, order.id, field);
      saveOrderStatuses(next);
      return next;
    });
  };

  const must = resolveStatus(order.id, "must", order.must, allStatuses);
  const delayed = resolveStatus(order.id, "delayed", order.delayed, allStatuses);
  const verified = resolveStatus(order.id, "verified", order.verified, allStatuses);
  const tabled = resolveStatus(order.id, "tabled", order.tabled, allStatuses);
  const built = resolveStatus(order.id, "built", order.frameBuilt, allStatuses);
  const completed = resolveStatus(order.id, "completed", order.completed, allStatuses);

  const verifiedDate = resolveDate(order.id, "verifiedDate", order.verifiedDate, allStatuses);
  const tabledDate = resolveDate(order.id, "tabledDate", order.tabledDate, allStatuses);
  const builtDate = resolveDate(order.id, "builtDate", order.frameBuiltDate, allStatuses);
  const completedDate = resolveDate(order.id, "completedDate", order.completedDate, allStatuses);

  return (
    <div className="space-y-4 max-w-3xl">
      {/* Section 1: Customer Info — white bg, navy border */}
      <div className="bg-white rounded-xl p-5 border-2 border-primary-dark shadow-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-lg font-bold text-primary-dark">
            {customer.firstName} {customer.lastName}
          </span>
          {/* Bin location */}
          <span className="text-primary-dark/70 text-base">(</span>
          <input
            type="text"
            value={binLocation}
            onChange={(e) => setBinLocation(e.target.value)}
            placeholder=" "
            className="w-10 bg-transparent border-b border-primary-dark/40 text-primary-dark text-base text-center focus:outline-none focus:border-primary-dark"
            title="Bin location"
          />
          <span className="text-primary-dark/70 text-base -ml-3">)</span>

          <div className="no-print flex items-center gap-2">
            <StatusIconButton
              type="must"
              active={must}
              onClick={() => toggle("must")}
              size={CIRCLE_SIZE}
            />
            <StatusIconButton
              type="delayed"
              active={delayed}
              onClick={() => toggle("delayed")}
              size={CIRCLE_SIZE}
            />
            <CommentDialog
              comments={order.comments}
              hasComments={order.comments.length > 0}
              size={CIRCLE_SIZE}
            />
          </div>

          <div className="flex-1" />

          <span className="text-sm text-primary">
            Designer: <span className="font-bold text-primary-dark">{order.designer}</span>
          </span>
          <span className="text-sm bg-primary-dark/10 px-2 py-0.5 rounded text-primary-dark">
            ({customer.contactMethod})
          </span>
        </div>

        <div className="flex items-center gap-4 mt-3 flex-wrap">
          <span className="text-sm text-primary">{customer.phone}</span>
          {customer.email && (
            <span className="text-sm text-primary">{customer.email}</span>
          )}
          <div className="flex-1" />
          <button
            onClick={() => window.print()}
            className="no-print w-9 h-9 rounded-full bg-primary-dark flex items-center justify-center hover:opacity-80 transition-opacity"
            title="Print order as PDF"
          >
            <Download size={16} className="text-panel" />
          </button>
        </div>
      </div>

      {/* Section 2: Order Info */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-base font-bold text-primary-dark font-mono">
            {order.orderNumber}
          </span>
          <span className="text-base font-bold text-primary-dark">
            (x{order.itemCount})
          </span>

          <div className="no-print flex items-center justify-center gap-3 flex-1">
            <StatusIconButton
              type="verified"
              active={verified}
              onClick={() => toggle("verified")}
              size={BADGE_SIZE}
            />
            <StatusIconButton
              type="tabled"
              active={tabled}
              onClick={() => toggle("tabled")}
              size={BADGE_SIZE}
            />
            <StatusIconButton
              type="built"
              active={built}
              onClick={() => toggle("built")}
              size={BADGE_SIZE}
            />
            <StatusIconButton
              type="completed"
              active={completed}
              onClick={() => toggle("completed")}
              size={BADGE_SIZE}
            />
          </div>

          <span className="text-sm text-primary/60">
            Taken: {formatDate(order.takenDate)}
          </span>
        </div>
        <div className="flex items-center gap-4 mt-2 flex-wrap">
          <span className="text-sm text-primary-dark">{order.description}</span>
          <div className="flex-1" />
          <span className="text-sm font-bold text-primary-dark">
            Due: {formatDate(order.dueDate)}
          </span>
        </div>
      </div>

      {/* Section 3: Frame Info */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-primary-dark">
            <span className="font-bold">Frame:</span> {order.frameSku}
          </span>
          {order.frameNotes && (
            <span className="text-sm text-primary/70">[{order.frameNotes}]</span>
          )}
        </div>
        <div className="flex items-center gap-6 mt-2 flex-wrap">
          <span className="text-sm text-primary-dark">
            <span className="font-bold">Footage:</span> {order.footage}
          </span>
          <span className="text-sm text-primary-dark">
            <span className="font-bold">Frame Size:</span> {order.frameSize}
          </span>
        </div>
      </div>

      {/* Section 4: Mat Info */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-sm font-bold text-primary-dark">Mats:</span>
          <span className="text-sm text-primary-dark">
            <span className="font-bold">Glass:</span> {order.glass}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-3">
          <div>
            <span className="text-xs text-primary/50 block">Top</span>
            <span className="text-sm text-primary-dark">{order.topMat || "—"}</span>
          </div>
          <div>
            <span className="text-xs text-primary/50 block">Second</span>
            <span className="text-sm text-primary-dark">{order.secondMat || "—"}</span>
          </div>
          <div>
            <span className="text-xs text-primary/50 block">Third</span>
            <span className="text-sm text-primary-dark">{order.thirdMat || "—"}</span>
          </div>
        </div>
        <div className="flex items-center gap-6 mt-3 flex-wrap">
          <span className="text-sm text-primary-dark">
            <span className="font-bold">Mounting:</span> {order.mounting}
          </span>
        </div>
        {order.matNotes && (
          <div className="mt-2">
            <span className="text-sm text-primary/70">[{order.matNotes}]</span>
          </div>
        )}
      </div>

      {/* Section 5: Progress — display-only circles with dates from localStorage */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <span className="text-sm font-bold text-primary-dark block mb-4">Progress:</span>
        <div className="grid grid-cols-2 gap-y-4 gap-x-8">
          <div className="flex items-center gap-3">
            <StatusIconButton type="verified" active={verified} size={BADGE_SIZE} indicatorOnly />
            <div>
              <span className="text-sm text-primary-dark block">Verified</span>
              {verifiedDate && (
                <span className="text-xs text-primary/50">{formatDate(verifiedDate)}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusIconButton type="built" active={built} size={BADGE_SIZE} indicatorOnly />
            <div>
              <span className="text-sm text-primary-dark block">Frame Built</span>
              {builtDate && (
                <span className="text-xs text-primary/50">{formatDate(builtDate)}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusIconButton type="tabled" active={tabled} size={BADGE_SIZE} indicatorOnly />
            <div>
              <span className="text-sm text-primary-dark block">Tabled</span>
              {tabledDate && (
                <span className="text-xs text-primary/50">{formatDate(tabledDate)}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusIconButton type="completed" active={completed} size={BADGE_SIZE} indicatorOnly />
            <div>
              <span className="text-sm text-primary-dark block">Completed</span>
              {completedDate && (
                <span className="text-xs text-primary/50">{formatDate(completedDate)}</span>
              )}
            </div>
          </div>
        </div>
        {order.frameReceivedDate && (
          <div className="mt-4 pt-3 border-t border-warm-border">
            <span className="text-sm text-primary-dark">
              <span className="font-bold">Frame Received:</span>{" "}
              {formatDate(order.frameReceivedDate)}
            </span>
          </div>
        )}
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <span className="text-sm font-bold text-primary-dark block mb-1">Notes:</span>
          <p className="text-sm text-primary-dark">{order.notes}</p>
        </div>
      )}
    </div>
  );
}
