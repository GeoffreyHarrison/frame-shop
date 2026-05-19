import { OrderDetails } from "@/components/framing-orders/order-details";
import ordersData from "@/data/dummy-orders.json";
import customersData from "@/data/dummy-customers.json";
import type { Order, Customer } from "@/lib/types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

interface OrderDetailsPageProps {
  params: Promise<{ date: string; orderId: string }>;
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { date, orderId } = await params;
  const allOrders = ordersData as Order[];
  const allCustomers = customersData as Customer[];

  const order = allOrders.find((o) => o.id === orderId);
  if (!order) {
    notFound();
  }

  const customer = allCustomers.find((c) => c.id === order.customerId);
  if (!customer) {
    notFound();
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <Link
          href={`/framing-orders/${date}`}
          className="inline-flex p-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
          title="Back to daily detail"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">
          Framing Orders: Order Details
        </h1>
      </div>

      <OrderDetails order={order} customer={customer} />
    </div>
  );
}
