"use client";

import type { FrameToOrder } from "@/lib/types";

interface FramesToOrderTableProps {
  frames: FrameToOrder[];
}

const statusColors: Record<string, string> = {
  "On List": "bg-yellow-100 text-yellow-800",
  Ordered: "bg-blue-100 text-blue-800",
  Received: "bg-green-100 text-green-800",
};

export function FramesToOrderTable({ frames }: FramesToOrderTableProps) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
              Order #
            </th>
            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
              Customer
            </th>
            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
              Frame SKU
            </th>
            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
              Description
            </th>
            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
              Size
            </th>
            <th className="text-center px-4 py-3 text-sm font-semibold text-gray-700">
              Footage
            </th>
            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
              Vendor
            </th>
            <th className="text-center px-4 py-3 text-sm font-semibold text-gray-700">
              Status
            </th>
            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
              Ordered
            </th>
          </tr>
        </thead>
        <tbody>
          {frames.map((frame) => (
            <tr
              key={frame.id}
              className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
            >
              <td className="px-4 py-3 text-sm text-blue-700 font-mono">
                {frame.orderNumber}
              </td>
              <td className="px-4 py-3 text-sm text-gray-800">
                {frame.customerName}
              </td>
              <td className="px-4 py-3 text-sm text-gray-800 font-mono">
                {frame.frameSku}
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {frame.frameNotes}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {frame.size}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 text-center">
                {frame.footage}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                {frame.vendor}
              </td>
              <td className="px-4 py-3 text-center">
                <span
                  className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                    statusColors[frame.status] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {frame.status}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {frame.orderedDate
                  ? new Date(
                      frame.orderedDate + "T00:00:00"
                    ).toLocaleDateString("en-US", {
                      month: "numeric",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—"}
              </td>
            </tr>
          ))}
          {frames.length === 0 && (
            <tr>
              <td
                colSpan={9}
                className="px-4 py-8 text-center text-sm text-gray-500"
              >
                No frames to order
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
