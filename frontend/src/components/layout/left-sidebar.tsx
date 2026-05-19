"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Frame,
  CheckCircle,
  Table2,
  Hammer,
  Wrench,
  Star,
  AlertCircle,
  Camera,
  ScanLine,
  Printer,
  List,
  CalendarDays,
} from "lucide-react";

const framingLinks = [
  { href: "/framing-orders", label: "Framing Orders", icon: Frame },
  { href: "/orders-to-verify", label: "Orders to Verify", icon: CheckCircle },
  { href: "/orders-to-table", label: "Orders to Table", icon: Table2 },
  { href: "/frames-to-build", label: "Frames to Build", icon: Hammer },
  { href: "/orders-to-fit", label: "Orders to Fit", icon: Wrench },
  { href: "/must-have-orders", label: "Must Have Orders", icon: Star },
  { href: "/delayed-orders", label: "Delayed Orders", icon: AlertCircle },
];

const photoLinks = [
  { href: "/photo-orders", label: "Photo Orders", icon: Camera },
  { href: "/to-scan", label: "To Scan", icon: ScanLine },
  { href: "/ready-to-print", label: "Ready to Print", icon: Printer },
];

const otherLinks = [
  { href: "/all-orders", label: "All Orders", icon: List },
  { href: "/daily-summaries", label: "Daily Summaries", icon: CalendarDays },
];

export function LeftSidebar() {
  const pathname = usePathname();

  const renderLink = (link: { href: string; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }) => {
    const isActive = pathname.startsWith(link.href);
    const Icon = link.icon;
    return (
      <Link
        key={link.href}
        href={link.href}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
          isActive ? "bg-light-grey" : "hover:bg-light-grey/60"
        }`}
      >
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary-dark shrink-0">
          <Icon size={18} className="text-white" />
        </span>
        <span className={`text-base text-primary ${isActive ? "font-medium" : ""}`}>
          {link.label}
        </span>
      </Link>
    );
  };

  return (
    <aside className="w-64 bg-panel rounded-2xl shadow-lg border border-warm-border flex flex-col p-5 overflow-y-auto shrink-0">
      <div className="mb-5">
        <label className="text-sm font-semibold text-primary-dark uppercase tracking-wide font-serif">
          Current Orders:
        </label>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-primary/50" />
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-warm-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent"
          />
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {framingLinks.map(renderLink)}
        <hr className="my-3 border-warm-border" />
        {photoLinks.map(renderLink)}
        <hr className="my-3 border-warm-border" />
        {otherLinks.map(renderLink)}
      </nav>
    </aside>
  );
}
