import Link from "next/link";
import { getReceivedMats } from "@/lib/db";
import { ListPageHeader } from "@/components/order-lists/list-page-header";
import { MatTable } from "@/components/order-lists/mat-table";

export const dynamic = 'force-dynamic';

export default async function ReceivedMatsPage() {
  const mats = await getReceivedMats();

  return (
    <div>
      <ListPageHeader
        title="Received Mats"
        showDownload={false}
        actions={
          <Link href="/mats-to-order" className="px-4 py-2 text-sm text-white bg-primary-dark rounded-lg hover:bg-primary transition-colors">
            Mat List
          </Link>
        }
      />
      <MatTable mats={mats} mode="received" />
    </div>
  );
}
