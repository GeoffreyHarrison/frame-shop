import { getOrdersCreatedOnDate, getOrdersCompletedOnDate, getOrdersPickedUpOnDate } from "@/lib/db";
import { DailySummariesClient } from "@/components/daily-summaries/daily-summaries-client";

export const dynamic = "force-dynamic";

export default async function DailySummariesPage() {
  // Get today's date in ISO format
  const today = new Date().toISOString().split("T")[0];

  // Fetch orders for today
  const ordersCreated = await getOrdersCreatedOnDate(today);
  const ordersCompleted = await getOrdersCompletedOnDate(today);
  const ordersPickedUp = await getOrdersPickedUpOnDate(today);

  return (
    <div className="space-y-4 max-w-6xl">
      {/* Heading */}
      <div className="bg-primary-dark rounded-t-xl px-6 py-4">
        <span className="text-xl font-bold text-white">Daily Summaries</span>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <DailySummariesClient
          initialDate={today}
          initialOrdersCreated={ordersCreated}
          initialOrdersCompleted={ordersCompleted}
          initialOrdersPickedUp={ordersPickedUp}
        />
      </div>
    </div>
  );
}
