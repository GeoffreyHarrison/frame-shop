/**
 * Calculate the default due date: 2.5 weeks (18 days) from today,
 * excluding Sundays. If the result lands on a Sunday, push to Monday.
 */
export function getDefaultDueDate(from: Date = new Date()): Date {
  let daysToAdd = 18;
  const result = new Date(from);
  result.setHours(0, 0, 0, 0);

  while (daysToAdd > 0) {
    result.setDate(result.getDate() + 1);
    // Skip Sundays (0 = Sunday)
    if (result.getDay() !== 0) {
      daysToAdd--;
    }
  }

  return result;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
}

export function getDayName(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

export function formatDateForUrl(dateStr: string): string {
  return dateStr; // Already in YYYY-MM-DD format
}

export function getTodayString(): string {
  const today = new Date();
  return today.toISOString().split("T")[0];
}
