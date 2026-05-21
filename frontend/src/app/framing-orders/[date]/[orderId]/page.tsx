import { OrderDetails } from "@/components/framing-orders/order-details";
import { getOrderWithCustomer } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

interface OrderDetailsPageProps {
  params: Promise<{ date: string; orderId: string }>;
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { date, orderId } = await params;

  const result = await getOrderWithCustomer(orderId);
  if (!result) notFound();

  const { order, customer } = result;

  return (
    <div>
      <div className="no-print flex items-center gap-3 mb-5">
        <Link
          href={`/framing-orders/${date}`}
          className="inline-flex p-2 text-primary hover:bg-light-grey rounded-lg transition-colors"
          title="Back to daily detail"
        >
          <ArrowLeft size={22} />
        </Link>
        <h1 className="text-2xl font-bold text-primary-dark font-serif">Framing Orders: Order Details</h1>
      </div>

      <OrderDetails order={order} customer={customer} />
    </div>
  );
}
