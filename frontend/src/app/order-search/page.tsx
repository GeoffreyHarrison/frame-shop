import { searchOrders } from "@/lib/db";
import { OrderSearchTable } from "@/components/order-search/order-search-table";

export const dynamic = "force-dynamic";

export default async function OrderSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const orders = await searchOrders(q);

  return (
    <div className="space-y-4 max-w-6xl">
      <div className="bg-primary-dark rounded-t-xl px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-white">Order Search</span>
        {q && (
          <span className="text-white/70 text-sm">
            Results for: &ldquo;{q}&rdquo; ({orders.length})
          </span>
        )}
        {!q && (
          <span className="text-white/70 text-sm">All orders ({orders.length})</span>
        )}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <OrderSearchTable orders={orders} />
      </div>
    </div>
  );
}
