"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { FrameToOrder } from "@/lib/types";
import { loadStatuses, saveStatus, vendorToSlug, type FrameStatus } from "@/lib/vendor-orders";

interface FramesToOrderTableProps {
  frames: FrameToOrder[];
}

const VENDORS_ORDER = ["Larson Juhl", "Decor Moulding", "Roma Moulding", "Bella Moulding"];

function getLastName(fullName: string): string {
  const parts = fullName.trim().split(" ");
  return parts[parts.length - 1];
}

export function FramesToOrderTable({ frames }: FramesToOrderTableProps) {
  const router = useRouter();
  const [statuses, setStatuses] = useState<Record<string, FrameStatus>>({});
  const [disappearing, setDisappearing] = useState<Set<string>>(new Set());

  useEffect(() => {
    setStatuses(loadStatuses());
  }, []);

  const getStatus = useCallback(
    (frame: FrameToOrder): FrameStatus => statuses[frame.id] ?? frame.status,
    [statuses]
  );

  const handleOrder = (frame: FrameToOrder) => {
    const next: FrameStatus = "Ordered";
    saveStatus(frame.id, next);
    setStatuses((prev) => ({ ...prev, [frame.id]: next }));
    router.refresh();
  };

  const handleReceived = (frame: FrameToOrder) => {
    saveStatus(frame.id, "Received");
    setStatuses((prev) => ({ ...prev, [frame.id]: "Received" }));
    setDisappearing((prev) => new Set(prev).add(frame.id));
    setTimeout(() => {
      setDisappearing((prev) => {
        const next = new Set(prev);
        next.delete(frame.id);
        return next;
      });
    }, 800);
  };

  // Group by vendor, then sort by SKU within each vendor
  const groups = VENDORS_ORDER.map((vendor) => {
    const vendorFrames = frames
      .filter((f) => f.vendor === vendor && getStatus(f) !== "Received" && !disappearing.has(f.id))
      .sort((a, b) => a.frameSku.localeCompare(b.frameSku));
    return { vendor, frames: vendorFrames };
  }).filter((g) => g.frames.length > 0);

  if (groups.length === 0) {
    return (
      <div className="px-6 py-10 text-center text-base text-primary/60">
        No frames to order
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groups.map(({ vendor, frames: vendorFrames }) => (
        <div key={vendor} className="rounded-xl overflow-hidden border border-primary-dark/15">
          {/* Vendor heading row */}
          <div className="bg-primary-dark px-5 py-2.5">
            <span className="text-base font-bold text-white">{vendor}</span>
          </div>

          <table className="w-full">
            <thead>
              <tr className="bg-primary-dark/8 border-b border-primary-dark/15">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-primary-dark uppercase tracking-wide">Order #</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-primary-dark uppercase tracking-wide">Last Name</th>
                <th className="text-center px-4 py-2.5 text-xs font-semibold text-primary-dark uppercase tracking-wide">Qty</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-primary-dark uppercase tracking-wide">Frame SKU</th>
                <th className="text-center px-4 py-2.5 text-xs font-semibold text-primary-dark uppercase tracking-wide">Footage</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-primary-dark uppercase tracking-wide">Description</th>
                <th className="text-center px-4 py-2.5 text-xs font-semibold text-primary-dark uppercase tracking-wide w-28">Received</th>
                <th className="text-center px-4 py-2.5 text-xs font-semibold text-primary-dark uppercase tracking-wide w-24">Order</th>
              </tr>
            </thead>
            <tbody>
              {vendorFrames.map((frame, idx) => {
                const status = getStatus(frame);
                const isOrdered = status === "Ordered";
                const isEven = idx % 2 === 0;
                return (
                  <tr
                    key={frame.id}
                    className={`border-b border-primary-dark/10 transition-opacity duration-700 ${
                      disappearing.has(frame.id) ? "opacity-0" : "opacity-100"
                    } ${isEven ? "bg-white" : "bg-light-grey"}`}
                  >
                    <td className="px-4 py-3 text-sm text-primary-dark font-mono">{frame.orderNumber}</td>
                    <td className="px-4 py-3 text-sm text-primary-dark">{getLastName(frame.customerName)}</td>
                    <td className="px-4 py-3 text-sm text-primary text-center">(x{frame.qty})</td>
                    <td className="px-4 py-3 text-sm text-primary-dark font-mono">{frame.frameSku}</td>
                    <td className="px-4 py-3 text-sm text-primary text-center">{frame.footage}</td>
                    <td className="px-4 py-3 text-sm text-primary/70">[{frame.frameNotes}]</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleReceived(frame)}
                        className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                          status === "Received"
                            ? "bg-primary-dark text-panel border-primary-dark"
                            : "bg-transparent text-primary-dark border-primary-dark hover:bg-primary-dark/10"
                        }`}
                      >
                        Received
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => !isOrdered && handleOrder(frame)}
                        className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                          isOrdered
                            ? "bg-primary-dark text-panel border-primary-dark cursor-default"
                            : "bg-transparent text-primary-dark border-primary-dark hover:bg-primary-dark/10"
                        }`}
                      >
                          Order
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
