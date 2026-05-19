"use client";

import Image from "next/image";
import { Search } from "lucide-react";
import { getDefaultDueDate } from "@/lib/due-date";

export function TopBar() {
  const today = new Date();
  const dueDate = getDefaultDueDate(today);

  const todayStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const dueDateStr = dueDate.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="h-16 bg-panel rounded-2xl shadow-lg border border-warm-border flex items-center px-6 gap-5 shrink-0">
      {/* Logo */}
      <div className="shrink-0">
        <Image src="/logo.jpg" alt="Frame Shop" width={160} height={46} className="h-11 w-auto" priority />
      </div>

      {/* Today's Date */}
      <div className="text-base text-primary shrink-0 hidden md:block">
        {todayStr}
      </div>

      {/* Due Date */}
      <div className="shrink-0 bg-light-grey px-4 py-1.5 rounded-lg border border-warm-border">
        <span className="text-base text-primary-dark font-medium font-serif">Due Date: </span>
        <span className="text-base text-primary">{dueDateStr}</span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Vendor & Customer Buttons */}
      <button className="px-4 py-2 text-base text-primary-dark border border-primary-dark rounded-lg hover:bg-light-grey transition-colors shrink-0">
        Vendors
      </button>
      <button className="px-4 py-2 text-base text-primary-dark border border-primary-dark rounded-lg hover:bg-light-grey transition-colors shrink-0">
        Customers
      </button>

      {/* Customer Directory Search */}
      <div className="shrink-0 hidden xl:block">
        <label className="text-sm font-semibold text-primary-dark block mb-1 font-serif">Customer Directory:</label>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-primary/50" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 text-sm border border-warm-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent w-48"
          />
        </div>
      </div>

      {/* Ask Scout */}
      <div className="shrink-0 hidden xl:flex items-center gap-2">
        <div>
          <label className="text-sm font-semibold text-primary-dark block mb-1 font-serif">Ask Scout:</label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-primary/50" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 text-sm border border-warm-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent w-40"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
