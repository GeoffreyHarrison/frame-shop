import { getMustHaveOrders } from "@/lib/db";
import { ListPageHeader } from "@/components/order-lists/list-page-header";
import { WorkflowOrderTable } from "@/components/order-lists/workflow-order-table";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const orders = await getMustHaveOrders();

  return (
    <div>
      <ListPageHeader title="Must Have Orders" />
      <WorkflowOrderTable orders={orders} variant="must" />
    </div>
  );
}
