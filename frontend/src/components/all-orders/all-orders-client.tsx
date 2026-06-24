"use client";

import { useState, useMemo } from "react";
import type { Order } from "@/lib/types";
import { KpiGrid } from "./kpi-grid";
import { AllOrdersTable } from "./all-orders-table";
import { type KpiType, filterOrders } from "./kpi-filters";

interface AllOrdersClientProps {
  orders: Order[];
}

export function AllOrdersClient({ orders }: AllOrdersClientProps) {
  const [selectedKpi, setSelectedKpi] = useState<KpiType>("all");

  const filteredOrders = useMemo(
    () => filterOrders(orders, selectedKpi),
    [orders, selectedKpi]
  );

  return (
    <div className="space-y-6">
      <KpiGrid orders={orders} selected={selectedKpi} onSelect={setSelectedKpi} />
      <AllOrdersTable orders={filteredOrders} kpi={selectedKpi} />
    </div>
  );
}
