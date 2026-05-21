import type { FrameToOrder } from "./types";

const STORAGE_KEY = "frameshop_frame_statuses";

export type FrameStatus = "On List" | "Ordered" | "Received";

export function vendorToSlug(vendor: string): string {
  return vendor.toLowerCase().replace(/\s+/g, "-");
}

export function slugToVendor(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function loadStatuses(): Record<string, FrameStatus> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveStatus(id: string, status: FrameStatus): void {
  const current = loadStatuses();
  current[id] = status;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  window.dispatchEvent(new Event("orderListUpdated"));
}

// Returns vendor names (full) that have at least one "Ordered" frame
export function getOrderedVendors(frames: FrameToOrder[], overrides: Record<string, FrameStatus>): string[] {
  const vendorSet = new Set<string>();
  for (const f of frames) {
    const status = overrides[f.id] ?? f.status;
    if (status === "Ordered") {
      vendorSet.add(f.vendor);
    }
  }
  return Array.from(vendorSet).sort();
}
