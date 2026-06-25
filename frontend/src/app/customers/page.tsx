import { getAllCustomers } from "@/lib/db";
import { CustomerDirectoryTable } from "@/components/customers/customer-directory-table";
import { NewCustomerModal } from "@/components/customers/new-customer-modal";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function CustomersPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const customers = await getAllCustomers();

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="bg-primary-dark rounded-t-xl px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-white">Customer Directory</span>
        <NewCustomerModal />
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <CustomerDirectoryTable customers={customers} initialSearch={q ?? ""} />
      </div>
    </div>
  );
}
