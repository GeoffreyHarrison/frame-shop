import { getGlassList } from "@/lib/db";
import { ListPageHeader } from "@/components/order-lists/list-page-header";
import { WorkflowOrderTable } from "@/components/order-lists/workflow-order-table";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const orders = await getGlassList();

  return (
    <div>
      <ListPageHeader title="Glass List" />
      <WorkflowOrderTable orders={orders} variant="glass" />
    </div>
  );
}
