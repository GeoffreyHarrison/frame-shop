import { getOrdersToFit } from "@/lib/db";
import { ListPageHeader } from "@/components/order-lists/list-page-header";
import { WorkflowOrderTable } from "@/components/order-lists/workflow-order-table";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const orders = await getOrdersToFit();

  return (
    <div>
      <ListPageHeader title="Orders to Fit" />
      <WorkflowOrderTable orders={orders} variant="fit" />
    </div>
  );
}
