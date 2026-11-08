import { getOrdersToTable } from "@/lib/db";
import { ListPageHeader } from "@/components/order-lists/list-page-header";
import { WorkflowOrderTable } from "@/components/order-lists/workflow-order-table";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const orders = await getOrdersToTable();

  return (
    <div>
      <ListPageHeader title="Orders to Table" />
      <WorkflowOrderTable orders={orders} variant="table" />
    </div>
  );
}
