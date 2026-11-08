"use client";

import { useEffect, useState } from "react";
import type { MatToOrder } from "@/lib/types";
import { formatDate } from "@/lib/due-date";
import {
  markMatReceived,
  returnMatToList,
  removeReceivedMat,
  setMatOrdered,
  clearMatOrdered,
} from "@/app/actions/mat-orders";

interface MatTableProps {
  mats: MatToOrder[];
  /** "list" = Mat List (Mat Received / Order buttons); "received" = Received Mats (Return / Remove) */
  mode: "list" | "received";
}

const pillBase = "px-3 py-1 text-xs rounded-md border transition-colors disabled:opacity-50 whitespace-nowrap";
const pillOutline = `${pillBase} border-primary-dark/40 text-primary-dark bg-transparent hover:bg-primary-dark/10`;

export function MatTable({ mats, mode }: MatTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [removing, setRemoving] = useState<MatToOrder | null>(null);

  const run = async (id: string, fn: () => Promise<void>) => {
    if (loadingId) return;
    setLoadingId(id);
    try {
      await fn();
    } finally {
      setLoadingId(null);
    }
  };

  // Esc closes the confirmation modal
  useEffect(() => {
    if (!removing) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setRemoving(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [removing]);

  if (mats.length === 0) {
    return (
      <div className="px-6 py-10 text-center text-base text-primary/60">
        {mode === "list" ? "No mats to order" : "No received mats"}
      </div>
    );
  }

  const th = "px-4 py-3 text-sm font-semibold text-white whitespace-nowrap";

  return (
    <>
      <div className="rounded-xl overflow-x-auto border border-primary-dark/15">
        <table className="w-full">
          <thead>
            <tr className="bg-primary-dark">
              <th className={`text-left ${th}`}>Order #</th>
              <th className={`text-center ${th}`}>Qty</th>
              <th className={`text-left ${th}`}>Due Date</th>
              <th className={`text-left ${th}`}>Size</th>
              <th className={`text-left ${th}`}>Mat Indicator</th>
              <th className={`text-left ${th}`}>Mat SKU</th>
              {mode === "list" ? (
                <>
                  <th className={`text-center no-print ${th}`}>Mat Received</th>
                  <th className={`text-center no-print ${th}`}>Order</th>
                </>
              ) : (
                <>
                  <th className={`text-center no-print ${th}`}>Return</th>
                  <th className={`text-center no-print ${th}`}>Remove</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {mats.map((mat, idx) => {
              const isLoading = loadingId === mat.id;
              return (
                <tr
                  key={mat.id}
                  className={`border-b border-primary-dark/10 ${idx % 2 === 0 ? "bg-white" : "bg-light-grey"}`}
                >
                  <td className="px-4 py-3 text-sm text-primary-dark font-mono">{mat.orderNumber}</td>
                  <td className="px-4 py-3 text-sm text-primary text-center">(x{mat.itemCount})</td>
                  <td className="px-4 py-3 text-sm text-primary-dark">{formatDate(mat.dueDate)}</td>
                  <td className="px-4 py-3 text-sm text-primary-dark">{mat.frameSize}</td>
                  <td className="px-4 py-3 text-sm text-primary-dark">{mat.position}</td>
                  <td className="px-4 py-3 text-sm text-primary-dark font-mono">{mat.matSku}</td>

                  {mode === "list" ? (
                    <>
                      <td className="px-4 py-3 text-center no-print">
                        <button
                          onClick={() => run(mat.id, () => markMatReceived(mat.id))}
                          disabled={isLoading}
                          className={pillOutline}
                        >
                          Mat Received
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center no-print">
                        <button
                          onClick={() =>
                            run(mat.id, () =>
                              mat.orderedDate ? clearMatOrdered(mat.id) : setMatOrdered(mat.id)
                            )
                          }
                          disabled={isLoading}
                          className={`${pillBase} ${
                            mat.orderedDate
                              ? "bg-primary-dark text-white border-primary-dark"
                              : "bg-transparent text-primary-dark border-primary-dark hover:bg-primary-dark/10"
                          }`}
                        >
                          Order
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 text-center no-print">
                        <button
                          onClick={() => run(mat.id, () => returnMatToList(mat.id))}
                          disabled={isLoading}
                          className={pillOutline}
                        >
                          Return
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center no-print">
                        <button
                          onClick={() => setRemoving(mat)}
                          disabled={isLoading}
                          className={`${pillBase} border-primary-dark/40 text-primary-dark bg-transparent hover:bg-red-50 hover:border-red-400 hover:text-red-600`}
                        >
                          Remove
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {removing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={() => setRemoving(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
            <p className="text-base text-primary-dark mb-6">
              Are you sure you want to remove order {removing.orderNumber} ({removing.position} mat) from the list?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setRemoving(null)}
                className="px-4 py-2 text-sm rounded-lg border border-primary-dark/40 text-primary-dark hover:bg-primary-dark/10 transition-colors"
              >
                No
              </button>
              <button
                onClick={() => {
                  const target = removing;
                  setRemoving(null);
                  void run(target.id, () => removeReceivedMat(target.id));
                }}
                className="px-4 py-2 text-sm rounded-lg bg-primary-dark text-white hover:opacity-90 transition-opacity"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
