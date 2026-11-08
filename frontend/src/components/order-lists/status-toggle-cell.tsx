"use client";

import { StatusIconButton } from "@/components/framing-orders/status-icon-button";
import { updateOrderStatus, clearOrderStatus } from "@/app/actions/order-status";
import type { Order } from "@/lib/types";

export type ListStatus = "verified" | "tabled" | "built" | "completed" | "must" | "delayed";

// UI status name -> Server Action status name (only must differs)
const actionStatus = {
  verified: "verified",
  tabled: "tabled",
  built: "built",
  completed: "completed",
  must: "mustHave",
  delayed: "delayed",
} as const;

export function isStatusActive(order: Order, status: ListStatus): boolean {
  switch (status) {
    case "verified": return Boolean(order.verifiedAt);
    case "tabled": return Boolean(order.tabledAt);
    case "built": return Boolean(order.builtAt);
    case "completed": return Boolean(order.completedAt);
    case "must": return Boolean(order.mustHaveStatus);
    case "delayed": return Boolean(order.delayedStatus);
  }
}

interface StatusToggleCellProps {
  order: Order;
  status: ListStatus;
  /** True while any action for this row is running */
  busy: boolean;
  /** Wraps the action so the table can disable the whole row while it runs */
  run: (orderId: string, fn: () => Promise<unknown>) => Promise<void>;
}

// Round status icon for one order + one status. Writes the same DB column through
// the same Server Actions as Daily Detail / Order Details, so state stays in sync.
export function StatusToggleCell({ order, status, busy, run }: StatusToggleCellProps) {
  const active = isStatusActive(order, status);

  const handleClick = () => {
    if (busy) return;
    void run(order.id, () =>
      active
        ? clearOrderStatus(order.id, actionStatus[status])
        : updateOrderStatus(order.id, actionStatus[status])
    );
  };

  return (
    <div className={`inline-flex ${busy ? "opacity-50 pointer-events-none" : ""}`}>
      <StatusIconButton type={status} active={active} onClick={handleClick} size={34} />
    </div>
  );
}
