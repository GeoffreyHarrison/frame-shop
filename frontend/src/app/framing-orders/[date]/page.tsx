import { DailyDetailTable } from "@/components/framing-orders/daily-detail-table";
import { getOrdersForDate } from "@/lib/db";
import { formatDate } from "@/lib/due-date";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface DailyDetailPageProps {
  params: Promise<{ date: string }>;
}

export default async function DailyDetailPage({ params }: DailyDetailPageProps) {
  const { date } = await params;
  const dayOrders = await getOrdersForDate(date);

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
        <h1 className="text-2xl font-bold text-primary-dark font-serif">Framing Orders:</h1>
      </div>

      <div className="inline-block bg-primary-dark px-5 py-2.5 rounded-lg mb-7">
        <span className="text-base text-white font-bold font-serif">Due Date: </span>
        <span className="text-base text-white font-normal">{formatDate(date)}</span>
      </div>

      <DailyDetailTable orders={dayOrders} date={date} />
    </div>
  );
}
