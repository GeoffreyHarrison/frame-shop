import { getAllInHouseOrders } from "@/lib/db";
import { AllOrdersClient } from "@/components/all-orders/all-orders-client";

export const dynamic = "force-dynamic";

export default async function AllOrdersPage() {
  const orders = await getAllInHouseOrders();

  return (
    <div className="space-y-4 max-w-7xl">
      <div className="bg-primary-dark rounded-t-xl px-6 py-4">
        <span className="text-xl font-bold text-white">All Orders</span>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <AllOrdersClient orders={orders} />
      </div>
    </div>
  );
}
