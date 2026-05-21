import { getOrderedFramesForVendor } from "@/lib/db";
import { slugToVendor } from "@/lib/vendor-orders";
import { OrderListTable } from "@/components/frames/order-list-table";

interface OrderListPageProps {
  params: Promise<{ vendor: string }>;
}

export default async function OrderListPage({ params }: OrderListPageProps) {
  const { vendor: vendorSlug } = await params;
  const vendorName = slugToVendor(vendorSlug);
  const frames = await getOrderedFramesForVendor(vendorName);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary-dark font-serif">
          Order for: {vendorName}
        </h1>
      </div>
      <OrderListTable frames={frames} vendor={vendorName} />
    </div>
  );
}
