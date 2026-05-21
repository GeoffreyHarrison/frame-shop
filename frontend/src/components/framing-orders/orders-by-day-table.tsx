"use client";

import { Eye } from "lucide-react";
import Link from "next/link";
import type { OrdersByDay } from "@/lib/types";

interface OrdersByDayTableProps {
  ordersByDay: OrdersByDay[];
}

export function OrdersByDayTable({ ordersByDay }: OrdersByDayTableProps) {
  return (
    <div className="border border-primary-dark/20 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-primary-dark">
            <th className="text-left px-4 py-3 text-sm font-semibold text-white">
              Day
            </th>
            <th className="text-left px-4 py-3 text-sm font-semibold text-white">
              Date
            </th>
            <th className="text-center px-4 py-3 text-sm font-semibold text-white">
              # Orders
            </th>
            <th className="text-center px-4 py-3 text-sm font-semibold text-white w-20">
              View
            </th>
          </tr>
        </thead>
        <tbody>
          {ordersByDay.map((day, index) => (
            <tr
              key={day.date}
              className={`border-b border-primary-dark/10 hover:bg-primary/5 transition-colors ${
                index % 2 === 0 ? "bg-white" : "bg-light-grey"
              }`}
            >
              <td className="px-4 py-3 text-sm font-bold text-primary-dark">
                {day.dayName}
              </td>
              <td className="px-4 py-3 text-sm text-primary">
                {new Date(day.date + "T00:00:00").toLocaleDateString("en-US", {
                  month: "numeric",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>
              <td className="px-4 py-3 text-sm text-primary text-center font-medium">
                {day.orderCount}
              </td>
              <td className="px-4 py-3 text-center">
                <Link
                  href={`/framing-orders/${day.date}`}
                  className="inline-flex p-1.5 text-primary-dark hover:bg-primary-dark/10 rounded-md transition-colors"
                  title={`View orders for ${day.date}`}
                >
                  <Eye size={22} />
                </Link>
              </td>
            </tr>
          ))}
          {ordersByDay.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-8 text-center text-sm text-primary/60"
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
