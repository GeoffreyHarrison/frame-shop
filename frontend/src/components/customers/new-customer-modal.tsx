"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { CustomerForm } from "./customer-form";
import { createCustomer } from "@/app/actions/customers";
import type { CustomerFormData } from "@/app/actions/customers";

export function NewCustomerModal() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: CustomerFormData) => {
    const { id } = await createCustomer(data);
    setOpen(false);
    router.push(`/customers/${id}`);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-primary-dark text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
      >
        + New Customer
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-primary-dark">New Customer</h2>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors"
              >
                <X size={18} className="text-primary-dark" />
              </button>
            </div>

            <CustomerForm
              onSubmit={handleSubmit}
              onCancel={() => setOpen(false)}
              submitLabel="Create Customer"
            />
          </div>
        </div>
      )}
    </>
  );
}
