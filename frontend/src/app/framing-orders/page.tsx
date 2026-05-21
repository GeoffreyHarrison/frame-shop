import { OrdersByDayTable } from "@/components/framing-orders/orders-by-day-table";
import { getOrdersByDay } from "@/lib/db";

export default async function FramingOrdersPage() {
  const ordersByDay = await getOrdersByDay();

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-dark font-serif mb-4">
        Framing Orders:
      </h1>

      <OrdersByDayTable ordersByDay={ordersByDay} />
    </div>
  );
}
