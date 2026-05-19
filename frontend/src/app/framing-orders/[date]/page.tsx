import { DailyDetailTable } from "@/components/framing-orders/daily-detail-table";
import ordersData from "@/data/dummy-orders.json";
import type { Order } from "@/lib/types";
import { formatDate } from "@/lib/due-date";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface DailyDetailPageProps {
  params: Promise<{ date: string }>;
}

export default async function DailyDetailPage({ params }: DailyDetailPageProps) {
  const { date } = await params;
  const allOrders = ordersData as Order[];
  const dayOrders = allOrders.filter((order) => order.dueDate === date);

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <Link
          href="/framing-orders"
          className="inline-flex p-2 text-primary hover:bg-light-grey rounded-lg transition-colors"
          title="Back to orders by day"
        >
          <ArrowLeft size={22} />
        </Link>
        <h1 className="text-2xl font-bold text-primary font-serif">Framing Orders:</h1>
      </div>

      <div className="inline-block bg-light-grey px-5 py-2.5 rounded-lg border border-warm-border mb-7">
        <span className="text-base text-primary-dark font-medium font-serif">Due Date: </span>
        <span className="text-base text-primary">{formatDate(date)}</span>
      </div>

      <DailyDetailTable orders={dayOrders} date={date} />
    </div>
  );
}
