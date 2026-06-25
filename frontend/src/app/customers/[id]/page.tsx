import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Pencil } from "lucide-react";
import { getCustomerById } from "@/lib/db";
import { formatDate } from "@/lib/due-date";

interface PageProps {
  params: Promise<{ id: string }>;
}

function DetailRow({ label, value }: { label: string; value?: string | boolean | number | null }) {
  if (value === undefined || value === null || value === "") return null;
  const display =
    typeof value === "boolean" ? (value ? "Yes" : "No") : String(value);
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-primary/60 w-36 shrink-0">{label}</span>
      <span className="text-primary-dark">{display}</span>
    </div>
  );
}

export default async function CustomerDetailPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getCustomerById(id);
  if (!result) notFound();
  const { customer, orders } = result;

  const fullAddress = [
    customer.address,
    customer.suite ? `Suite ${customer.suite}` : null,
    customer.city,
    customer.state,
    customer.zip,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Heading */}
      <div className="bg-primary-dark rounded-t-xl px-6 py-4 flex items-center gap-3">
        <Link
          href="/customers"
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ChevronLeft size={20} className="text-white" />
        </Link>
        <span className="text-xl font-bold text-white flex-1">
          {customer.firstName} {customer.lastName}
        </span>
        <Link
          href={`/customers/${customer.id}/edit`}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-white/15 hover:bg-white/25 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Pencil size={14} />
          Edit
        </Link>
      </div>

      {/* Customer details */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-primary-dark/10 space-y-4">
        <h2 className="text-sm font-bold text-primary-dark uppercase tracking-wide">Contact Information</h2>
        <div className="space-y-2">
          <DetailRow label="Phone" value={customer.phone} />
          <DetailRow label="2nd Phone" value={customer.phone2} />
          <DetailRow label="Email" value={customer.email} />
          <DetailRow label="Contact Method" value={customer.contactMethod} />
          <DetailRow label="Address" value={fullAddress || undefined} />
          <DetailRow label="Spouse" value={customer.spouse} />
        </div>

        <hr className="border-primary-dark/10" />

        <h2 className="text-sm font-bold text-primary-dark uppercase tracking-wide">Account Details</h2>
        <div className="space-y-2">
          <DetailRow label="Type" value={customer.type} />
          <DetailRow label="Company" value={customer.company} />
          <DetailRow label="Rewards Member" value={customer.rewards} />
          <DetailRow label="Discount" value={customer.discount ? `${customer.discount}%` : undefined} />
          <DetailRow label="Taxable" value={customer.taxable} />
          <DetailRow label="Tax ID" value={customer.taxId} />
          <DetailRow label="Notes" value={customer.notes} />
        </div>
      </div>

      {/* Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-primary-dark/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-primary-dark/10">
          <h2 className="text-sm font-bold text-primary-dark uppercase tracking-wide">
            Orders ({orders.length})
          </h2>
        </div>
        {orders.length === 0 ? (
          <p className="px-6 py-8 text-sm text-primary/60 text-center">No orders on file.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-light-grey border-b border-primary-dark/10">
                <th className="text-left px-5 py-3 text-sm font-semibold text-primary-dark">Order #</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-primary-dark">Description</th>
                <th className="text-center px-5 py-3 text-sm font-semibold text-primary-dark">Due Date</th>
                <th className="text-center px-5 py-3 text-sm font-semibold text-primary-dark">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => {
                const status = order.pickedUpAt
                  ? "Picked Up"
                  : order.completedAt
                  ? "Completed"
                  : order.builtAt
                  ? "Built"
                  : order.tabledAt
                  ? "Tabled"
                  : order.verifiedAt
                  ? "Verified"
                  : "In Progress";
                return (
                  <tr
                    key={order.id}
                    className={`border-b border-primary-dark/10 ${idx % 2 === 0 ? "bg-white" : "bg-light-grey"}`}
                  >
                    <td className="px-5 py-3 text-sm">
                      <Link
                        href={`/framing-orders/${order.dueDate}/${order.id}`}
                        className="font-mono text-primary-dark hover:text-primary hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-sm text-primary/70">{order.description}</td>
                    <td className="px-5 py-3 text-sm text-primary text-center">{formatDate(order.dueDate)}</td>
                    <td className="px-5 py-3 text-sm text-primary text-center">{status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
