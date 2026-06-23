"use client";

interface KPIBoxesProps {
  ordersCreatedCount: number;
  ordersCompletedCount: number;
  ordersPickedUpCount: number;
  isLoading: boolean;
}

export function KPIBoxes({
  ordersCreatedCount,
  ordersCompletedCount,
  ordersPickedUpCount,
  isLoading,
}: KPIBoxesProps) {
  const kpis = [
    {
      label: "Orders Taken",
      count: ordersCreatedCount,
    },
    {
      label: "Orders Completed",
      count: ordersCompletedCount,
    },
    {
      label: "Orders Picked Up",
      count: ordersPickedUpCount,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="bg-primary-dark rounded-lg p-6 text-center shadow-sm"
        >
          <p className="text-white/70 text-sm font-medium mb-2">{kpi.label}</p>
          <p className={`text-4xl font-bold text-white transition-opacity ${
            isLoading ? "opacity-50" : ""
          }`}>
            {kpi.count}
          </p>
        </div>
      ))}
    </div>
  );
}
