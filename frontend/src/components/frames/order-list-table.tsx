"use client";

import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import type { FrameToOrder } from "@/lib/types";
import { loadStatuses, type FrameStatus } from "@/lib/vendor-orders";
import { markFrameOrdered, removeFrameFromOrderList } from "@/app/actions/frame-orders";

interface OrderListTableProps {
  frames: FrameToOrder[];
  vendor: string;
}

function getLastName(fullName: string): string {
  const parts = fullName.trim().split(" ");
  return parts[parts.length - 1];
}

export function OrderListTable({ frames, vendor }: OrderListTableProps) {
  const [statuses, setStatuses] = useState<Record<string, FrameStatus>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    setStatuses(loadStatuses());
    const handler = () => setStatuses(loadStatuses());
    window.addEventListener("orderListUpdated", handler);
    return () => window.removeEventListener("orderListUpdated", handler);
  }, []);

  const orderedFrames = frames
    .filter((f) => {
      const status = statuses[f.id] ?? f.status;
      return f.vendor === vendor && status === "Ordered";
    })
    .sort((a, b) => a.frameSku.localeCompare(b.frameSku));

  const handleOrdered = async (frame: FrameToOrder) => {
    if (loadingId) return;
    setLoadingId(frame.id);
    try {
      await markFrameOrdered(frame.id);
    } finally {
      setLoadingId(null);
    }
  };

  const handleRemove = async (frame: FrameToOrder) => {
    if (loadingId) return;
    setLoadingId(frame.id);
    try {
      await removeFrameFromOrderList(frame.id);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { color: black !important; background: white !important; }
          * { color: black !important; background: transparent !important; border-color: #ccc !important; box-shadow: none !important; }
        }
      `}</style>

      <div className="flex justify-end mb-4 no-print">
        <button
          onClick={() => window.print()}
          className="w-9 h-9 rounded-full bg-primary-dark flex items-center justify-center hover:opacity-80 transition-opacity"
          title="Print order list as PDF"
        >
          <Download size={16} className="text-panel" />
        </button>
      </div>

      {orderedFrames.length === 0 ? (
        <div className="px-6 py-10 text-center text-base text-primary/60">
          No frames ordered for this vendor yet
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden border border-primary-dark/15">
          <table className="w-full">
            <thead>
              <tr className="bg-primary-dark">
                <th className="text-left px-4 py-3 text-sm font-semibold text-white">Order #</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-white">Last Name</th>
                <th className="text-center px-4 py-3 text-sm font-semibold text-white">Qty</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-white">Frame SKU</th>
                <th className="text-center px-4 py-3 text-sm font-semibold text-white">Footage</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-white">Description</th>
                <th className="text-center px-4 py-3 text-sm font-semibold text-white no-print">Ordered</th>
                <th className="text-center px-4 py-3 text-sm font-semibold text-white no-print">Remove</th>
              </tr>
            </thead>
            <tbody>
              {orderedFrames.map((frame, idx) => {
                const isOrdered = !!frame.orderedDate;
                const isLoading = loadingId === frame.id;
                return (
                  <tr
                    key={frame.id}
                    className={`border-b border-primary-dark/10 ${idx % 2 === 0 ? "bg-white" : "bg-light-grey"}`}
                  >
                    <td className="px-4 py-3 text-sm text-primary-dark font-mono">{frame.orderNumber}</td>
                    <td className="px-4 py-3 text-sm text-primary-dark">{getLastName(frame.customerName)}</td>
                    <td className="px-4 py-3 text-sm text-primary text-center">(x{frame.qty})</td>
                    <td className="px-4 py-3 text-sm text-primary-dark font-mono">{frame.frameSku}</td>
                    <td className="px-4 py-3 text-sm text-primary text-center">{frame.footage}</td>
                    <td className="px-4 py-3 text-sm text-primary/70">[{frame.frameNotes}]</td>
                    <td className="px-4 py-3 text-center no-print">
                      <button
                        onClick={() => handleOrdered(frame)}
                        disabled={isLoading}
                        className={`px-3 py-1 text-xs rounded-md border transition-colors disabled:opacity-50 ${
                          isOrdered
                            ? "bg-primary-dark text-panel border-primary-dark"
                            : "bg-transparent text-primary-dark border-primary-dark hover:bg-primary-dark/10"
                        }`}
                      >
                        Ordered
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center no-print">
                      <button
                        onClick={() => handleRemove(frame)}
                        disabled={isLoading}
                        className="px-3 py-1 text-xs rounded-md border border-primary-dark/40 text-primary-dark bg-transparent hover:bg-red-50 hover:border-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
