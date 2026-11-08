import { getFramesToBuild } from "@/lib/db";
import { ListPageHeader } from "@/components/order-lists/list-page-header";
import { WorkflowOrderTable } from "@/components/order-lists/workflow-order-table";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const orders = await getFramesToBuild();

  return (
    <div>
      <ListPageHeader title="Frames to Build" />
      <WorkflowOrderTable orders={orders} variant="build" />
    </div>
  );
}
