import type { Order } from "@/lib/types";

export type KpiType =
  | "all"
  | "notStarted"
  | "notVerified"
  | "verifiedWaiting"
  | "verifiedReceived"
  | "builtWaiting"
  | "tabledWaiting"
  | "tabledBuilt"
  | "completed"
  | "mustHave"
  | "delayed";

export const KPI_LABELS: Record<KpiType, string> = {
  all: "All",
  notStarted: "Not Started",
  notVerified: "Not Verified",
  verifiedWaiting: "Verified & Waiting",
  verifiedReceived: "Verified & Received",
  builtWaiting: "Frames Built & Waiting",
  tabledWaiting: "Tabled & Waiting",
  tabledBuilt: "Tabled & Built",
  completed: "Completed",
  mustHave: "Must Have",
  delayed: "Delayed",
};

// KPI grid layout: 3 rows of 4, 4, 3
export const KPI_ROWS: KpiType[][] = [
  ["all", "notStarted", "notVerified", "verifiedWaiting"],
  ["verifiedReceived", "builtWaiting", "tabledWaiting", "tabledBuilt"],
  ["completed", "mustHave", "delayed"],
];

export function filterOrders(orders: Order[], kpi: KpiType): Order[] {
  switch (kpi) {
    case "all":
      return orders;

    case "notStarted":
      // No FrameToOrder record AND no progress timestamps
      return orders.filter(
        (o) =>
          !o.frameStatus &&
          !o.verifiedAt &&
          !o.tabledAt &&
          !o.builtAt &&
          !o.completedAt
      );

    case "notVerified":
      // Has a FrameToOrder record (frame is on the list) but not yet verified
      return orders.filter((o) => o.frameStatus && !o.verifiedAt);

    case "verifiedWaiting":
      // Verified but frame not yet received
      return orders.filter(
        (o) => o.verifiedAt && !o.frameReceivedDate
      );

    case "verifiedReceived":
      // Verified AND frame received, but not yet built
      return orders.filter(
        (o) => o.verifiedAt && o.frameReceivedDate && !o.builtAt
      );

    case "builtWaiting":
      // Frame built but not yet tabled
      return orders.filter((o) => o.builtAt && !o.tabledAt);

    case "tabledWaiting":
      // Tabled but frame not yet built
      return orders.filter((o) => o.tabledAt && !o.builtAt);

    case "tabledBuilt":
      // Both tabled and built, but not completed
      return orders.filter(
        (o) => o.tabledAt && o.builtAt && !o.completedAt
      );

    case "completed":
      // Completed but not picked up (already guaranteed by in-house filter)
      return orders.filter((o) => o.completedAt);

    case "mustHave":
      // Any in-house order with mustHave status set
      return orders.filter((o) => o.mustHaveStatus);

    case "delayed":
      // Any in-house order with delayed status set
      return orders.filter((o) => o.delayedStatus);

    default:
      return orders;
  }
}
