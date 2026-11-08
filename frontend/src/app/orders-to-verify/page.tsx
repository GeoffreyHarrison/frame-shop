import { getOrdersToVerify } from "@/lib/db";
import { ListPageHeader } from "@/components/order-lists/list-page-header";
import { WorkflowOrderTable } from "@/components/order-lists/workflow-order-table";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const orders = await getOrdersToVerify();

  return (
    <div>
      <ListPageHeader title="Orders to Verify" />
      <WorkflowOrderTable orders={orders} variant="verify" />
    </div>
  );
}
