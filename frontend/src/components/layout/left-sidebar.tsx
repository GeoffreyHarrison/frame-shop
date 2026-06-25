"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  Check,
  Drill,
  Star,
  Camera,
  ScanLine,
  Printer,
  Infinity,
  TrendingUp,
  RectangleVertical,
} from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";

// Custom T icon (capital letter, no suitable lucide equivalent)
function TIcon({ size = 18 }: { size?: number }) {
  return (
    <span
      style={{ fontSize: size, lineHeight: 1 }}
      className="font-bold text-white select-none"
    >
      T
    </span>
  );
}

// Custom exclamation icon for Delayed Orders
function ExclamationIcon({ size = 18 }: { size?: number }) {
  return (
    <span
      style={{ fontSize: size, lineHeight: 1 }}
      className="font-bold text-white select-none"
    >
      !
    </span>
  );
}

type NavIcon =
  | React.ComponentType<{ size?: number; className?: string }>
  | "T"
  | "exclamation";

const framingLinks: { href: string; label: string; icon: NavIcon }[] = [
  { href: "/framing-orders", label: "Framing Orders", icon: CalendarDays },
  { href: "/orders-to-verify", label: "Orders to Verify", icon: Check },
  { href: "/orders-to-table", label: "Orders to Table", icon: "T" },
  { href: "/frames-to-build", label: "Frames to Build", icon: RectangleVertical },
  { href: "/orders-to-fit", label: "Orders to Fit", icon: Drill },
  { href: "/must-have-orders", label: "Must Have Orders", icon: Star },
  { href: "/delayed-orders", label: "Delayed Orders", icon: "exclamation" },
];

const photoLinks: { href: string; label: string; icon: NavIcon }[] = [
  { href: "/photo-orders", label: "Photo Orders", icon: Camera },
  { href: "/to-scan", label: "To Scan", icon: ScanLine },
  { href: "/ready-to-print", label: "Ready to Print", icon: Printer },
];

const otherLinks: { href: string; label: string; icon: NavIcon }[] = [
  { href: "/all-orders", label: "All Orders", icon: Infinity },
  { href: "/daily-summaries", label: "Daily Summaries", icon: TrendingUp },
];

export function LeftSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    const q = searchQuery.trim();
    router.push(`/order-search${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  };

  const renderIcon = (icon: NavIcon) => {
    if (icon === "T") return <TIcon size={18} />;
    if (icon === "exclamation") return <ExclamationIcon size={20} />;
    const Icon = icon as React.ComponentType<{ size?: number; className?: string }>;
    return <Icon size={18} className="text-white" />;
  };

  const renderLink = (link: { href: string; label: string; icon: NavIcon }) => {
    const isActive = pathname.startsWith(link.href);
    return (
      <Link
        key={link.href}
        href={link.href}
        className={`group flex items-center gap-3 px-3 py-1.5 rounded-lg transition-all ${
          isActive
            ? "bg-light-grey"
            : "hover:bg-light-grey/60 hover:translate-x-1"
        }`}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-dark shrink-0 transition-transform group-hover:scale-110">
          {renderIcon(link.icon)}
        </span>
        <span className={`text-base text-primary ${isActive ? "font-medium" : ""}`}>
          {link.label}
        </span>
      </Link>
    );
  };

  return (
    <aside className="w-72 bg-panel rounded-2xl shadow-lg border border-warm-border flex flex-col p-5 overflow-y-auto scrollbar-hide shrink-0">
      <div className="mb-4">
        <label className="text-sm font-semibold text-primary-dark uppercase tracking-wide font-serif">
          Current Orders:
        </label>
        <SearchInput
          placeholder="Search orders..."
          className="mt-2 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSearch={handleSearch}
        />
      </div>

      <nav className="flex flex-col gap-0.5">
        {framingLinks.map(renderLink)}
        <hr className="my-2 border-primary-dark/30" />
        {photoLinks.map(renderLink)}
        <hr className="my-2 border-primary-dark/30" />
        {otherLinks.map(renderLink)}
      </nav>
    </aside>
  );
}
