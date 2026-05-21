"use client";

import { useState } from "react";
import { Star, Check, Smile, RectangleVertical, MessageSquare } from "lucide-react";

export type StatusType =
  | "verified"
  | "tabled"
  | "built"
  | "completed"
  | "must"
  | "delayed"
  | "comment";

// ─── Circle icons: must / delayed ───────────────────────────────────────────

const circleActiveBg: Record<"must" | "delayed", string> = {
  must: "bg-accent-yellow",
  delayed: "bg-accent-red",
};

function MustDelayedCircle({
  type,
  active,
  size,
}: {
  type: "must" | "delayed";
  active: boolean;
  size: number;
}) {
  const iconSize = Math.round(size * 0.48);
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-full flex items-center justify-center shrink-0 transition-colors ${
        active ? circleActiveBg[type] : "bg-primary/20"
      }`}
    >
      {type === "must" && (
        <Star size={iconSize} className="text-panel" strokeWidth={2} />
      )}
      {type === "delayed" && (
        <span
          style={{ fontSize: iconSize + 3, lineHeight: 1 }}
          className="text-panel font-bold select-none"
        >
          !
        </span>
      )}
    </div>
  );
}

// ─── Badge circles: verified / tabled / built / completed ───────────────────
// All four are equal-size rounded-full circles.

function BadgeCircle({
  type,
  active,
  size,
}: {
  type: "verified" | "tabled" | "built" | "completed";
  active: boolean;
  size: number;
}) {
  const iconSize = Math.round(size * 0.52);
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-full flex items-center justify-center shrink-0 transition-colors ${
        active
          ? "bg-primary-dark"
          : "border border-primary/25 bg-transparent"
      }`}
    >
      {type === "verified" && (
        <Check
          size={iconSize}
          className={active ? "text-panel" : "text-primary/25"}
          strokeWidth={2.5}
        />
      )}
      {type === "tabled" && (
        <span
          style={{ fontSize: iconSize + 1, lineHeight: 1 }}
          className={`font-bold select-none ${active ? "text-panel" : "text-primary/25"}`}
        >
          T
        </span>
      )}
      {type === "built" && (
        <RectangleVertical
          size={iconSize}
          className={active ? "text-panel" : "text-primary/25"}
          strokeWidth={2}
        />
      )}
      {type === "completed" && (
        <Smile
          size={iconSize}
          className={active ? "text-panel" : "text-primary/25"}
          strokeWidth={2}
        />
      )}
    </div>
  );
}

// ─── Comment circle (used by CommentDialog) ──────────────────────────────────

export function CommentCircle({
  hasComments,
  size = 32,
  onClick,
}: {
  hasComments: boolean;
  size?: number;
  onClick?: () => void;
}) {
  const iconSize = Math.round(size * 0.48);
  return (
    <button
      onClick={onClick}
      style={{ width: size, height: size }}
      className={`rounded-full flex items-center justify-center shrink-0 transition-colors hover:opacity-80 ${
        hasComments ? "bg-accent-green" : "bg-primary/20"
      }`}
      title="Comments"
    >
      <MessageSquare size={iconSize} className="text-panel" strokeWidth={2} />
    </button>
  );
}

// ─── Main StatusIconButton ────────────────────────────────────────────────────

interface StatusIconButtonProps {
  type: StatusType;
  active?: boolean;
  onClick?: () => void;
  size?: number;
  indicatorOnly?: boolean;
}

export function StatusIconButton({
  type,
  active,
  onClick,
  size = 32,
  indicatorOnly = false,
}: StatusIconButtonProps) {
  // indicatorOnly: pure display — bypass all state, read active prop directly so
  // it stays in sync when the parent re-renders after loading localStorage.
  if (indicatorOnly) {
    const isActive = active ?? false;
    if (type === "must" || type === "delayed") {
      return <MustDelayedCircle type={type} active={isActive} size={size} />;
    }
    if (type === "verified" || type === "tabled" || type === "built" || type === "completed") {
      return <BadgeCircle type={type} active={isActive} size={size} />;
    }
    return null;
  }

  // Uncontrolled fallback — only used when neither active nor onClick is supplied
  const [internalActive, setInternalActive] = useState(active ?? false);

  // Controlled when both active + onClick are provided; otherwise use internal state
  const isControlled = active !== undefined && onClick !== undefined;
  const isActive = isControlled ? active : internalActive;

  const handleClick = () => {
    if (isControlled) {
      onClick!();
    } else {
      setInternalActive((v) => !v);
    }
  };

  if (type === "must" || type === "delayed") {
    return (
      <button
        onClick={handleClick}
        className="hover:scale-105 transition-transform cursor-pointer shrink-0"
        title={type === "must" ? "Must Have" : "Delayed"}
      >
        <MustDelayedCircle type={type} active={isActive} size={size} />
      </button>
    );
  }

  if (
    type === "verified" ||
    type === "tabled" ||
    type === "built" ||
    type === "completed"
  ) {
    return (
      <button
        onClick={handleClick}
        className="hover:scale-105 transition-transform cursor-pointer shrink-0"
        title={type.charAt(0).toUpperCase() + type.slice(1)}
      >
        <BadgeCircle type={type} active={isActive} size={size} />
      </button>
    );
  }

  return null;
}
