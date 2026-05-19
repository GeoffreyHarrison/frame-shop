"use client";

import { Eye } from "lucide-react";
import Link from "next/link";
import type { OrdersByDay } from "@/lib/types";

interface OrdersByDayTableProps {
  ordersByDay: OrdersByDay[];
}

export function OrdersByDayTable({ ordersByDay }: OrdersByDayTableProps) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
              Day
            </th>
            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
              Date
            </th>
            <th className="text-center px-4 py-3 text-sm font-semibold text-gray-700">
              # Orders
            </th>
            <th className="text-center px-4 py-3 text-sm font-semibold text-gray-700 w-20">
              View
            </th>
          </tr>
        </thead>
        <tbody>
          {ordersByDay.map((day) => (
            <tr
              key={day.date}
              className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
            >
              <td className="px-4 py-3 text-sm text-gray-800">
                {day.dayName}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {new Date(day.date + "T00:00:00").toLocaleDateString("en-US", {
                  month: "numeric",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>
              <td className="px-4 py-3 text-sm text-gray-800 text-center font-medium">
                {day.orderCount}
              </td>
              <td className="px-4 py-3 text-center">
                <Link
                  href={`/framing-orders/${day.date}`}
                  className="inline-flex p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                  title={`View orders for ${day.date}`}
                >
                  <Eye size={18} />
                </Link>
              </td>
            </tr>
          ))}
          {ordersByDay.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-8 text-center text-sm text-gray-500"
              >
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
