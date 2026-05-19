"use client";

import { Search } from "lucide-react";
import Link from "next/link";

const itemLinks = [
  { href: "/frames-to-order", label: "Frame List" },
  { href: "/mats-to-order", label: "Mat List" },
  { href: "/glass-review", label: "Glass List" },
  { href: "/supplies", label: "Supplies List" },
  { href: "/pc-order", label: "PC Order" },
];

export function RightSidebar() {
  return (
    <aside className="w-56 bg-panel rounded-2xl shadow-lg border border-warm-border flex flex-col p-5 overflow-y-auto shrink-0">
      <div className="mb-5">
        <label className="text-sm font-semibold text-primary-dark uppercase tracking-wide font-serif">
          Item Search:
        </label>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-primary/50" />
          <input
            type="text"
            placeholder="SKU or description..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-warm-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent"
          />
        </div>
      </div>

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
