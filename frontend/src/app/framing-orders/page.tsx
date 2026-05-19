import { OrdersByDayTable } from "@/components/framing-orders/orders-by-day-table";
import ordersData from "@/data/dummy-orders.json";
import type { Order, OrdersByDay } from "@/lib/types";
import { getDayName } from "@/lib/due-date";

function groupOrdersByDay(orders: Order[]): OrdersByDay[] {
  const grouped = new Map<string, Order[]>();

  for (const order of orders) {
    const existing = grouped.get(order.dueDate) || [];
    existing.push(order);
    grouped.set(order.dueDate, existing);
  }

  const result: OrdersByDay[] = [];
  for (const [date, dayOrders] of grouped) {
    result.push({
      dayName: getDayName(date),
      date,
      orderCount: dayOrders.length,
      orders: dayOrders,
    });
  }

  result.sort((a, b) => a.date.localeCompare(b.date));
  return result;
}

export default function FramingOrdersPage() {
  const orders = ordersData as Order[];
  const ordersByDay = groupOrdersByDay(orders);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-4">
        Framing Orders:
      </h1>

      <div className="inline-block bg-blue-50 px-4 py-2 rounded-md border border-blue-200 mb-6">
        <span className="text-sm text-blue-700 font-medium">Due Date: </span>
        <span className="text-sm text-blue-900">
          Select a day to view orders
        </span>
      </div>

      <OrdersByDayTable ordersByDay={ordersByDay} />
    </div>
  );
}
