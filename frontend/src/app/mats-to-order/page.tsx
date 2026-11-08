import Link from "next/link";
import { getMatList } from "@/lib/db";
import { ListPageHeader } from "@/components/order-lists/list-page-header";
import { MatTable } from "@/components/order-lists/mat-table";

export const dynamic = 'force-dynamic';

export default async function MatListPage() {
  const mats = await getMatList();

  return (
    <div>
      <ListPageHeader
        title="Mat List"
        actions={
          <Link href="/mats-to-order/received" className="px-4 py-2 text-sm text-white bg-primary-dark rounded-lg hover:bg-primary transition-colors">
            Received Mats
          </Link>
        }
      />
      <MatTable mats={mats} mode="list" />
    </div>
  );
}
