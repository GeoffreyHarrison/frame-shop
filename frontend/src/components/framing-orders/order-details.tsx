"use client";

import { StatusIconButton } from "./status-icon-button";
import { CommentDialog } from "./comment-dialog";
import { Download } from "lucide-react";
import type { Order, Customer } from "@/lib/types";
import { formatDate } from "@/lib/due-date";

interface OrderDetailsProps {
  order: Order;
  customer: Customer;
}

export function OrderDetails({ order, customer }: OrderDetailsProps) {
  return (
    <div className="space-y-4 max-w-3xl">
      {/* Section 1: Customer Info */}
      <div className="border-2 border-blue-400 rounded-lg p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-base font-semibold text-gray-900">
            {customer.firstName} {customer.lastName}
          </span>
          <StatusIconButton type="must" active={order.must} />
          <StatusIconButton type="delayed" active={order.delayed} />
          <CommentDialog
            comments={order.comments}
            hasComments={order.comments.length > 0}
          />
          <div className="flex-1" />
          <span className="text-sm font-medium text-gray-600">
            {order.designer}
          </span>
          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
            ({customer.contactMethod})
          </span>
        </div>
        <div className="flex items-center gap-4 mt-2 flex-wrap">
          <span className="text-sm text-gray-600">{customer.phone}</span>
          {customer.email && (
            <span className="text-sm text-gray-600">{customer.email}</span>
          )}
          <div className="flex-1" />
          <button
            className="inline-flex items-center gap-1 px-2 py-1 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            title="Download order as PDF"
          >
            <Download size={14} />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Section 2: Order Info */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-base font-semibold text-blue-700 font-mono">
            {order.orderNumber}
          </span>
          <span className="text-sm text-gray-500">(x{order.itemCount})</span>
          <StatusIconButton type="verified" active={order.verified} />
          <StatusIconButton type="tabled" active={order.tabled} />
          <StatusIconButton type="built" active={order.frameBuilt} />
          <StatusIconButton type="completed" active={order.completed} />
          <div className="flex-1" />
          <span className="text-sm text-gray-500">
            Taken: {formatDate(order.takenDate)}
          </span>
        </div>
        <div className="flex items-center gap-4 mt-2 flex-wrap">
          <span className="text-sm text-gray-700">{order.description}</span>
          <div className="flex-1" />
          <span className="text-sm text-gray-500">
            Due: {formatDate(order.dueDate)}
          </span>
        </div>
      </div>

      {/* Section 3: Frame Info */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-gray-700">
            <span className="font-medium">Frame:</span> {order.frameSku}
          </span>
          {order.frameNotes && (
            <span className="text-sm text-gray-500">
              [{order.frameNotes}]
            </span>
          )}
        </div>
        <div className="flex items-center gap-6 mt-2 flex-wrap">
          <span className="text-sm text-gray-600">
            <span className="font-medium">Footage:</span> {order.footage}
          </span>
          <span className="text-sm text-gray-600">
            <span className="font-medium">Frame Size:</span> {order.frameSize}
          </span>
        </div>
      </div>

      {/* Section 4: Mat Info */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700">Mats:</span>
          <span className="text-sm text-gray-600">
            <span className="font-medium">Glass:</span> {order.glass}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-3">
          <div>
            <span className="text-xs text-gray-400 block">Top</span>
            <span className="text-sm text-gray-700">
              {order.topMat || "—"}
            </span>
          </div>
          <div>
            <span className="text-xs text-gray-400 block">Second</span>
            <span className="text-sm text-gray-700">
              {order.secondMat || "—"}
            </span>
          </div>
          <div>
            <span className="text-xs text-gray-400 block">Third</span>
            <span className="text-sm text-gray-700">
              {order.thirdMat || "—"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-6 mt-3 flex-wrap">
          <span className="text-sm text-gray-600">
            <span className="font-medium">Mounting:</span> {order.mounting}
          </span>
        </div>
        {order.matNotes && (
          <div className="mt-2">
            <span className="text-sm text-gray-500">[{order.matNotes}]</span>
          </div>
        )}
      </div>

      {/* Section 5: Progress */}
      <div className="border border-gray-200 rounded-lg p-4">
        <span className="text-sm font-medium text-gray-700 block mb-3">
          Progress:
        </span>
        <div className="grid grid-cols-2 gap-y-3 gap-x-8">
          <div className="flex items-center gap-2">
            <StatusIconButton
              type="verified"
              active={order.verified}
              indicatorOnly
            />
            <span className="text-sm text-gray-600">Verified</span>
            {order.verifiedDate && (
              <span className="text-xs text-gray-400">
                {formatDate(order.verifiedDate)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <StatusIconButton
              type="built"
              active={order.frameBuilt}
              indicatorOnly
            />
            <span className="text-sm text-gray-600">Frame Built</span>
            {order.frameBuiltDate && (
              <span className="text-xs text-gray-400">
                {formatDate(order.frameBuiltDate)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <StatusIconButton
              type="tabled"
              active={order.tabled}
              indicatorOnly
            />
            <span className="text-sm text-gray-600">Tabled</span>
            {order.tabledDate && (
              <span className="text-xs text-gray-400">
                {formatDate(order.tabledDate)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <StatusIconButton
              type="completed"
              active={order.completed}
              indicatorOnly
            />
            <span className="text-sm text-gray-600">Completed</span>
            {order.completedDate && (
              <span className="text-xs text-gray-400">
                {formatDate(order.completedDate)}
              </span>
            )}
          </div>
        </div>
        {order.frameReceivedDate && (
          <div className="mt-3 pt-2 border-t border-gray-100">
            <span className="text-sm text-gray-600">
              <span className="font-medium">Frame Received:</span>{" "}
              {formatDate(order.frameReceivedDate)}
            </span>
          </div>
        )}
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="border border-gray-200 rounded-lg p-4">
          <span className="text-sm font-medium text-gray-700 block mb-1">
            Notes:
          </span>
          <p className="text-sm text-gray-600">{order.notes}</p>
        </div>
      )}
    </div>
  );
}
