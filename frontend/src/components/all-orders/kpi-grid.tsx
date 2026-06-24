"use client";

import type { Order } from "@/lib/types";
import { type KpiType, KPI_LABELS, KPI_ROWS, filterOrders } from "./kpi-filters";

interface KpiGridProps {
  orders: Order[];
  selected: KpiType;
  onSelect: (kpi: KpiType) => void;
}

export function KpiGrid({ orders, selected, onSelect }: KpiGridProps) {
  return (
    <div className="space-y-2">
      {KPI_ROWS.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className={`grid gap-2 ${
            row.length === 4 ? "grid-cols-4" : "grid-cols-3"
          }`}
        >
          {row.map((kpi) => {
            const count = filterOrders(orders, kpi).length;
            const isActive = selected === kpi;
            return (
              <button
                key={kpi}
                onClick={() => onSelect(kpi)}
                className={`rounded-lg p-4 text-left transition-all border-2 ${
                  isActive
                    ? "bg-primary-dark border-primary-dark text-white"
                    : "bg-white border-primary-dark/15 text-primary-dark hover:border-primary-dark/40 hover:bg-primary/5"
                }`}
              >
                <p
                  className={`text-xs font-medium mb-1 ${
                    isActive ? "text-white/70" : "text-primary/60"
                  }`}
                >
                  {KPI_LABELS[kpi]}
                </p>
                <p className="text-3xl font-bold">{count}</p>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
