"use client";

import type { ReactNode } from "react";
import { Download } from "lucide-react";

interface ListPageHeaderProps {
  title: string;
  /** Extra buttons shown to the left of the download button (e.g. "Received Mats") */
  actions?: ReactNode;
  /** Hide the print/download button (e.g. Received Mats page) */
  showDownload?: boolean;
}

// Heading + right-aligned buttons shared by every list page.
// Contains the print styles: anything with `no-print` is hidden when printing.
export function ListPageHeader({ title, actions, showDownload = true }: ListPageHeaderProps) {
  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { color: black !important; background: white !important; }
          * { color: black !important; background: transparent !important; border-color: #ccc !important; box-shadow: none !important; }
        }
      `}</style>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary-dark font-serif">{title}</h1>
        <div className="flex items-center gap-3 no-print">
          {actions}
          {showDownload && (
            <button
              onClick={() => window.print()}
              className="w-9 h-9 rounded-full bg-primary-dark flex items-center justify-center hover:opacity-80 transition-opacity"
              title="Print list as PDF"
            >
              <Download size={16} className="text-panel" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
