"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { Customer } from "@/lib/types";

interface CustomerDirectoryTableProps {
  customers: Customer[];
  initialSearch?: string;
}

export function CustomerDirectoryTable({
  customers,
  initialSearch = "",
}: CustomerDirectoryTableProps) {
  const [search, setSearch] = useState(initialSearch);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.email ?? "").toLowerCase().includes(q)
    );
  }, [customers, search]);

  return (
    <div className="space-y-4">
      {/* Search + New Customer */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, or email..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-primary-dark/20 rounded-lg text-primary-dark focus:outline-none focus:border-primary-dark bg-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden border border-primary-dark/15 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-light-grey border-b border-primary-dark/10">
              <th className="text-left px-5 py-3 text-sm font-semibold text-primary-dark">Name</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-primary-dark">Phone</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-primary-dark">Email</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-primary-dark">Contact</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-primary-dark">Type</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-primary/60">
                  {search ? "No customers match your search." : "No customers found."}
                </td>
              </tr>
            ) : (
              filtered.map((customer, idx) => (
                <tr
                  key={customer.id}
                  className={`border-b border-primary-dark/10 hover:bg-primary/5 transition-colors ${
                    idx % 2 === 0 ? "bg-white" : "bg-light-grey"
                  }`}
                >
                  <td className="px-5 py-3 text-sm">
                    <Link
                      href={`/customers/${customer.id}`}
                      className="font-medium text-primary-dark hover:text-primary hover:underline"
                    >
                      {customer.lastName}, {customer.firstName}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-sm text-primary-dark">{customer.phone}</td>
                  <td className="px-5 py-3 text-sm text-primary/70">{customer.email || "—"}</td>
                  <td className="px-5 py-3 text-sm text-primary/70">{customer.contactMethod}</td>
                  <td className="px-5 py-3 text-sm text-primary/70">{customer.type}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-primary/50 text-right">
        {filtered.length} of {customers.length} customers
      </p>
    </div>
  );
}
