"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CustomerForm } from "@/components/customers/customer-form";
import { updateCustomer } from "@/app/actions/customers";
import type { Customer } from "@/lib/types";
import type { CustomerFormData } from "@/app/actions/customers";

export default function CustomerEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/customers/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setCustomer(data.customer);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (data: CustomerFormData) => {
    await updateCustomer(id, data);
    router.push(`/customers/${id}`);
  };

  if (loading) {
    return (
      <div className="space-y-4 max-w-4xl">
        <div className="bg-primary-dark rounded-t-xl px-6 py-4">
          <span className="text-xl font-bold text-white">Edit Customer</span>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm text-sm text-primary/60">Loading...</div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="space-y-4 max-w-4xl">
        <div className="bg-primary-dark rounded-t-xl px-6 py-4">
          <span className="text-xl font-bold text-white">Edit Customer</span>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm text-sm text-red-600">Customer not found.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="bg-primary-dark rounded-t-xl px-6 py-4 flex items-center gap-3">
        <Link
          href={`/customers/${id}`}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ChevronLeft size={20} className="text-white" />
        </Link>
        <span className="text-xl font-bold text-white">
          Edit — {customer.firstName} {customer.lastName}
        </span>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <CustomerForm
          initial={customer}
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/customers/${id}`)}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
