"use client";

import { useState } from "react";
import { StatusIconButton } from "./status-icon-button";
import { CommentDialog } from "./comment-dialog";
import { Download, ShoppingBag } from "lucide-react";
import type { Order, Customer } from "@/lib/types";
import { formatDate } from "@/lib/due-date";
import {
  updateOrderStatus,
  clearOrderStatus,
  updateBinLocation,
} from "@/app/actions/order-status";

interface OrderDetailsProps {
  order: Order;
  customer: Customer;
}

const CIRCLE_SIZE = 32;
const BADGE_SIZE = 30;

export function OrderDetails({ order, customer }: OrderDetailsProps) {
  const [binLocation, setBinLocation] = useState(order.binLocation ?? "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusToggle = async (status: string) => {
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
        await clearOrderStatus(order.id, statusType);
      } else {
        await updateOrderStatus(order.id, statusType);
      }
      // Page will revalidate automatically from Server Action
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBinLocationChange = async (value: string) => {
    setBinLocation(value);
    if (value.trim() && order.completedAt) {
      await updateBinLocation(order.id, value.trim());
    }
  };

  const handlePickedUpToggle = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      const isPickedUp = Boolean(order.pickedUpAt);
      if (isPickedUp) {
        await clearOrderStatus(order.id, 'pickedUp');
      } else {
        await updateOrderStatus(order.id, 'pickedUp');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // Status indicators based on database timestamps
  const verified = Boolean(order.verifiedAt);
  const tabled = Boolean(order.tabledAt);
  const built = Boolean(order.builtAt);
  const completed = Boolean(order.completedAt);
  const must = Boolean(order.mustHaveStatus);
  const delayed = Boolean(order.delayedStatus);

  return (
    <div className="space-y-4 max-w-3xl">
      {/* Section 1: Customer Info — white bg, navy border */}
      <div className="bg-white rounded-xl p-5 border-2 border-primary-dark shadow-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-lg font-bold text-primary-dark">
            {customer.firstName} {customer.lastName}
          </span>
          {/* Bin location */}
          <div className="flex items-center">
            <span className="text-primary-dark/70 text-base">(<input
              type="text"
              value={binLocation}
              onChange={(e) => handleBinLocationChange(e.target.value)}
              placeholder=" "
              disabled={isUpdating}
              style={{
                width: `${Math.max((binLocation.length || 1) + 0.5, 1.5)}ch`,
              }}
              className="bg-transparent border-b border-primary-dark/40 text-primary-dark text-base text-center focus:outline-none focus:border-primary-dark disabled:opacity-50 transition-all"
              title="Bin location"
            />)</span>
          </div>

          <div className="no-print flex items-center gap-4">
            <StatusIconButton
              type="must"
              active={must}
              onClick={() => handleStatusToggle("must")}
              size={CIRCLE_SIZE}
            />
            <StatusIconButton
              type="delayed"
              active={delayed}
              onClick={() => handleStatusToggle("delayed")}
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
              onClick={() => handleStatusToggle("verified")}
              size={BADGE_SIZE}
            />
            <StatusIconButton
              type="tabled"
              active={tabled}
              onClick={() => handleStatusToggle("tabled")}
              size={BADGE_SIZE}
            />
            <StatusIconButton
              type="built"
              active={built}
              onClick={() => handleStatusToggle("built")}
              size={BADGE_SIZE}
            />
            <StatusIconButton
              type="completed"
              active={completed}
              onClick={() => handleStatusToggle("completed")}
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

      {/* Section 5: Progress — display-only circles with dates from database timestamps */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <span className="text-sm font-bold text-primary-dark block mb-4">Progress:</span>
        <div className="grid grid-cols-2 gap-y-4 gap-x-8">
          <div className="flex items-center gap-3">
            <StatusIconButton type="verified" active={verified} size={BADGE_SIZE} indicatorOnly />
            <div>
              <span className="text-sm text-primary-dark block">Verified</span>
              {order.verifiedAt && (
                <span className="text-xs text-primary/50">{formatDate(order.verifiedAt)}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusIconButton type="built" active={built} size={BADGE_SIZE} indicatorOnly />
            <div>
              <span className="text-sm text-primary-dark block">Frame Built</span>
              {order.builtAt && (
                <span className="text-xs text-primary/50">{formatDate(order.builtAt)}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusIconButton type="tabled" active={tabled} size={BADGE_SIZE} indicatorOnly />
            <div>
              <span className="text-sm text-primary-dark block">Tabled</span>
              {order.tabledAt && (
                <span className="text-xs text-primary/50">{formatDate(order.tabledAt)}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusIconButton type="completed" active={completed} size={BADGE_SIZE} indicatorOnly />
            <div>
              <span className="text-sm text-primary-dark block">Completed</span>
              {order.completedAt && (
                <span className="text-xs text-primary/50">{formatDate(order.completedAt)}</span>
              )}
            </div>
          </div>
        </div>
        {order.receivedAt && (
          <div className="mt-4 pt-3 border-t border-warm-border">
            <span className="text-sm text-primary-dark">
              <span className="font-bold">Frame Received:</span>{" "}
              {formatDate(order.receivedAt)}
            </span>
          </div>
        )}

        {/* Picked Up Section */}
        <div className="mt-4 pt-3 border-t border-warm-border">
          <div className="flex items-center gap-4">
            {/* Picked Up Button — double size of other status buttons */}
            <button
              onClick={handlePickedUpToggle}
              disabled={isUpdating}
              className="hover:scale-105 transition-transform cursor-pointer shrink-0 disabled:opacity-50"
              title="Picked Up"
            >
              <div
                style={{ width: BADGE_SIZE * 2, height: BADGE_SIZE * 2 }}
                className={`rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  order.pickedUpAt
                    ? "bg-primary-dark"
                    : "border border-primary/25 bg-transparent"
                }`}
              >
                <ShoppingBag
                  size={Math.round(BADGE_SIZE * 2 * 0.52)}
                  className={order.pickedUpAt ? "text-panel" : "text-primary/25"}
                  strokeWidth={2}
                />
              </div>
            </button>

            {/* Text display when picked up */}
            <div>
              <span className="text-sm font-bold text-primary-dark block">Picked Up</span>
              {order.pickedUpAt && (
                <span className="text-xs text-primary/50">
                  Order picked up on {formatDate(order.pickedUpAt)}
                </span>
              )}
            </div>
          </div>
        </div>
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
