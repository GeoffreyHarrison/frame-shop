import { getOrdersWaitingForPickup } from "@/lib/db";
import { BinventoryTable } from "@/components/binventory/binventory-table";

export const dynamic = "force-dynamic";

export default async function BinventoryPage() {
  const orders = await getOrdersWaitingForPickup();

  return (
    <div className="space-y-4 max-w-6xl">
      {/* Heading */}
      <div className="bg-primary-dark rounded-t-xl px-6 py-4">
        <span className="text-xl font-bold text-white">Binventory</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <BinventoryTable orders={orders} />
      </div>
    </div>
  );
}
