"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Order } from "@/lib/types";
import { SummaryTable } from "./summary-table";
import { KPIBoxes } from "./kpi-boxes";

interface DailySummariesClientProps {
  initialDate: string;
  initialOrdersCreated: Order[];
  initialOrdersCompleted: Order[];
  initialOrdersPickedUp: Order[];
}

export function DailySummariesClient({
  initialDate,
  initialOrdersCreated,
  initialOrdersCompleted,
  initialOrdersPickedUp,
}: DailySummariesClientProps) {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [ordersCreated, setOrdersCreated] = useState(initialOrdersCreated);
  const [ordersCompleted, setOrdersCompleted] = useState(initialOrdersCompleted);
  const [ordersPickedUp, setOrdersPickedUp] = useState(initialOrdersPickedUp);
  const [isLoading, setIsLoading] = useState(false);

  const handleDateChange = async (newDate: string) => {
    setSelectedDate(newDate);
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/daily-summaries?date=${encodeURIComponent(newDate)}`
      );
      const data = await response.json();

      setOrdersCreated(data.ordersCreated || []);
      setOrdersCompleted(data.ordersCompleted || []);
      setOrdersPickedUp(data.ordersPickedUp || []);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    handleDateChange(date.toISOString().split("T")[0]);
  };

  const handleNextDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    handleDateChange(date.toISOString().split("T")[0]);
  };

  const handleToday = () => {
    const today = new Date().toISOString().split("T")[0];
    if (selectedDate !== today) {
      handleDateChange(today);
    }
  };

  // Format date for display
  const displayDate = new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
    "en-US",
    { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <div className="space-y-6">
      {/* Calendar Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePreviousDay}
            disabled={isLoading}
            className="p-2 rounded-lg hover:bg-primary/10 transition-colors disabled:opacity-50"
          >
            <ChevronLeft size={20} className="text-primary-dark" />
          </button>

          <div className="flex flex-col gap-1">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              disabled={isLoading}
              className="px-3 py-2 border border-primary-dark/20 rounded-lg text-primary-dark focus:outline-none focus:border-primary-dark"
            />
            <span className="text-sm text-primary/70">{displayDate}</span>
          </div>

          <button
            onClick={handleNextDay}
            disabled={isLoading}
            className="p-2 rounded-lg hover:bg-primary/10 transition-colors disabled:opacity-50"
          >
            <ChevronRight size={20} className="text-primary-dark" />
          </button>

          <button
            onClick={handleToday}
            disabled={isLoading}
            className="ml-4 px-4 py-2 bg-primary-dark text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-sm font-medium"
          >
            Today
          </button>
        </div>
      </div>

      {/* KPI Boxes */}
      <KPIBoxes
        ordersCreatedCount={ordersCreated.length}
        ordersCompletedCount={ordersCompleted.length}
        ordersPickedUpCount={ordersPickedUp.length}
        isLoading={isLoading}
      />

      {/* Tables */}
      <div className="space-y-6">
        <SummaryTable
          title="Orders Taken"
          orders={ordersCreated}
          isLoading={isLoading}
        />
        <SummaryTable
          title="Orders Completed"
          orders={ordersCompleted}
          isLoading={isLoading}
        />
        <SummaryTable
          title="Orders Picked Up"
          orders={ordersPickedUp}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
