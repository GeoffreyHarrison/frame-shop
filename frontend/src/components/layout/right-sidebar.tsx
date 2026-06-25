"use client";

import Link from "next/link";
import { SearchInput } from "@/components/ui/search-input";
import { vendorToSlug } from "@/lib/vendor-orders";

const itemLinks = [
  { href: "/frames-to-order", label: "Frame List" },
  { href: "/mats-to-order", label: "Mat List" },
  { href: "/glass-review", label: "Glass List" },
  { href: "/supplies", label: "Supplies List" },
  { href: "/pc-order", label: "PC Order" },
];

interface RightSidebarProps {
  orderedVendors: string[];
}

export function RightSidebar({ orderedVendors }: RightSidebarProps) {
  return (
    <aside className="w-64 bg-panel rounded-2xl shadow-lg border border-warm-border flex flex-col p-5 overflow-y-auto scrollbar-hide shrink-0">
      <div className="mb-5">
        <label className="text-sm font-semibold text-primary-dark uppercase tracking-wide font-serif">
          Item Search:
        </label>
        <SearchInput placeholder="SKU or description..." className="mt-2 w-full" />
      </div>

      {/* Nav buttons */}
      <nav className="flex flex-col gap-2">
        {itemLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block px-5 py-2.5 text-base text-white bg-primary-dark rounded-lg text-center hover:bg-primary transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* To Order section — shows vendors that have frames with "Ordered" status */}
      {orderedVendors.length > 0 && (
        <div className="mt-4">
          <hr className="border-primary-dark/40 mb-3" />
          <p className="text-sm font-bold text-primary-dark mb-2">To Order:</p>
          <div className="flex flex-col gap-2">
            {orderedVendors.map((vendor) => (
              <Link
                key={vendor}
                href={`/order-lists/${vendorToSlug(vendor)}`}
                className="block px-5 py-2 text-sm text-primary-dark border border-primary-dark rounded-lg text-center hover:bg-primary-dark hover:text-white transition-colors"
              >
                {vendor}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Spacer pushes Binventory to the bottom */}
      <div className="flex-1" />

      <Link
        href="/binventory"
        className="block px-5 py-2.5 text-base text-white bg-primary-dark rounded-lg text-center hover:bg-primary transition-colors mt-4"
      >
        Binventory
      </Link>
    </aside>
  );
}
