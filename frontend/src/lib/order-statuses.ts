const STORAGE_KEY = "frameshop_order_statuses";

export interface OrderStatusRecord {
  must?: boolean;
  delayed?: boolean;
  verified?: boolean;
  verifiedDate?: string;
  tabled?: boolean;
  tabledDate?: string;
  built?: boolean;
  builtDate?: string;
  completed?: boolean;
  completedDate?: string;
}

type ToggleableField = "must" | "delayed" | "verified" | "tabled" | "built" | "completed";
type DateField = "verifiedDate" | "tabledDate" | "builtDate" | "completedDate";

const DATE_FIELD_MAP: Partial<Record<ToggleableField, DateField>> = {
  verified: "verifiedDate",
  tabled: "tabledDate",
  built: "builtDate",
  completed: "completedDate",
};

export function loadOrderStatuses(): Record<string, OrderStatusRecord> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveOrderStatuses(
  statuses: Record<string, OrderStatusRecord>
): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses));
  window.dispatchEvent(new Event("orderStatusUpdated"));
}

export function toggleOrderStatus(
  allStatuses: Record<string, OrderStatusRecord>,
  orderId: string,
  field: ToggleableField
): Record<string, OrderStatusRecord> {
  const current = allStatuses[orderId] ?? {};
  const newValue = !current[field];
  const dateField = DATE_FIELD_MAP[field];

  const updated: OrderStatusRecord = {
    ...current,
    [field]: newValue,
  };

  if (dateField) {
    if (newValue) {
      updated[dateField] = new Date().toISOString().split("T")[0];
    } else {
      delete updated[dateField];
    }
  }

  return { ...allStatuses, [orderId]: updated };
}

// Merge dummy-data values with localStorage overrides.
// localStorage wins; if a field isn't in localStorage yet, fall back to the order prop.
export function resolveStatus(
  orderId: string,
  field: ToggleableField,
  fallback: boolean,
  allStatuses: Record<string, OrderStatusRecord>
): boolean {
  const rec = allStatuses[orderId];
  if (!rec || rec[field] === undefined) return fallback;
  return rec[field]!;
}

export function resolveDate(
  orderId: string,
  dateField: DateField,
  fallback: string | undefined,
  allStatuses: Record<string, OrderStatusRecord>
): string | undefined {
  const rec = allStatuses[orderId];
  if (!rec || rec[dateField] === undefined) return fallback;
  return rec[dateField];
}
