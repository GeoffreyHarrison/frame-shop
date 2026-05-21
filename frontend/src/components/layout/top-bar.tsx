"use client";

import Image from "next/image";
import { User } from "lucide-react";
import { getDefaultDueDate } from "@/lib/due-date";
import { useState, useEffect } from "react";
import { SearchInput } from "@/components/ui/search-input";

function toInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function todayInputValue(): string {
  return toInputValue(new Date());
}

export function TopBar() {
  const today = new Date();
  const todayStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const defaultDueDate = toInputValue(getDefaultDueDate(today));
  const [dueDate, setDueDate] = useState(defaultDueDate);

  useEffect(() => {
    const todayKey = todayInputValue();
    try {
      const stored = localStorage.getItem("frameshop_duedate");
      if (stored) {
        const { date, setOnDay } = JSON.parse(stored);
        if (setOnDay === todayKey) {
          setDueDate(date);
          return;
        }
      }
    } catch {}
    setDueDate(defaultDueDate);
  }, [defaultDueDate]);

  function handleDueDateChange(value: string) {
    setDueDate(value);
    try {
      localStorage.setItem(
        "frameshop_duedate",
        JSON.stringify({ date: value, setOnDay: todayInputValue() })
      );
    } catch {}
  }

  return (
    // items-end + pb-3: all interactive elements share the same bottom baseline
    <header className="h-20 bg-panel rounded-2xl shadow-lg border border-warm-border flex items-end px-6 pb-3 gap-5 shrink-0">
      {/* Logo — self-center keeps it visually centered while everything else bottom-aligns */}
      <div className="shrink-0 self-center">
        <Image src="/logo.jpg" alt="Frame Shop" width={160} height={46} className="h-11 w-auto" priority />
      </div>

      {/* Date stacked above Due Date — due date box bottom-aligns with buttons/inputs */}
      <div className="flex flex-col items-start shrink-0">
        <span className="text-base font-bold text-primary-dark hidden md:block mb-1">
          {todayStr}
        </span>
        <div className="flex items-center gap-1.5 bg-primary-dark px-3 py-1.5 rounded-lg">
          <span className="text-sm font-semibold text-white font-serif whitespace-nowrap">Due Date:</span>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => handleDueDateChange(e.target.value)}
            className="text-sm text-white bg-transparent border-none outline-none cursor-pointer"
          />
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Vendors — no label above it, so it naturally bottom-aligns with the circles and search bars */}
      <button className="px-4 py-2 text-sm font-medium text-white bg-primary-dark rounded-lg hover:bg-primary transition-colors shrink-0 mr-6">
        Vendors
      </button>

      {/* Customer circle + Directory search */}
      <div className="shrink-0 hidden xl:flex flex-col gap-1">
        <label className="text-sm font-semibold text-primary-dark font-serif">Customer Directory:</label>
        <div className="flex items-center gap-1.5">
          <button
            className="w-9 h-9 rounded-full bg-primary-dark flex items-center justify-center text-white hover:bg-primary transition-colors shrink-0"
            title="Customers"
          >
            <User size={18} />
          </button>
          <SearchInput placeholder="Search..." className="w-44" />
        </div>
      </div>

      {/* Ask Scout circle + search */}
      <div className="shrink-0 hidden xl:flex flex-col gap-1">
        <label className="text-sm font-semibold text-primary-dark font-serif">Ask Scout:</label>
        <div className="flex items-center gap-1.5">
          <button
            className="w-9 h-9 rounded-full bg-primary-dark flex items-center justify-center text-white hover:bg-primary transition-colors shrink-0 font-bold text-lg leading-none"
            title="Ask Scout"
          >
            ?
          </button>
          <SearchInput placeholder="Search..." className="w-40" />
        </div>
      </div>
    </header>
  );
}
