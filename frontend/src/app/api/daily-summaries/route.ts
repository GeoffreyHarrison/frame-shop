import { getOrdersCreatedOnDate, getOrdersCompletedOnDate, getOrdersPickedUpOnDate } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return Response.json(
      { error: "Date parameter is required" },
      { status: 400 }
    );
  }

  try {
    const [ordersCreated, ordersCompleted, ordersPickedUp] = await Promise.all([
      getOrdersCreatedOnDate(date),
      getOrdersCompletedOnDate(date),
      getOrdersPickedUpOnDate(date),
    ]);

    return Response.json({
      ordersCreated,
      ordersCompleted,
      ordersPickedUp,
    });
  } catch (error) {
    console.error("Error fetching daily summaries:", error);
    return Response.json(
      { error: "Failed to fetch daily summaries" },
      { status: 500 }
    );
  }
}
