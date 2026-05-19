"use client";

import { useState } from "react";
import {
  CheckCircle,
  Type,
  Square,
  Smile,
  Star,
  AlertCircle,
  MessageCircle,
} from "lucide-react";

type StatusType =
  | "verified"
  | "tabled"
  | "built"
  | "completed"
  | "must"
  | "delayed"
  | "comment";

const iconMap = {
  verified: CheckCircle,
  tabled: Type,
  built: Square,
  completed: Smile,
  must: Star,
  delayed: AlertCircle,
  comment: MessageCircle,
};

const activeColorMap: Record<StatusType, string> = {
  verified: "text-[#00BF63]",
  tabled: "text-[#485074]",
  built: "text-[#485074]",
  completed: "text-[#00BF63]",
  must: "text-[#EBCD5A]",
  delayed: "text-[#FF3131]",
  comment: "text-[#00BF63]",
};

interface StatusIconButtonProps {
  type: StatusType;
  active?: boolean;
  onClick?: () => void;
  size?: number;
  indicatorOnly?: boolean;
}

export function StatusIconButton({
  type,
  active: controlledActive,
  onClick,
  size = 20,
  indicatorOnly = false,
}: StatusIconButtonProps) {
  const [internalActive, setInternalActive] = useState(
    controlledActive ?? false
  );
  const isActive = controlledActive !== undefined ? controlledActive : internalActive;
  const Icon = iconMap[type];
  const activeColor = activeColorMap[type];

  const handleClick = () => {
    if (indicatorOnly) return;
    if (onClick) {
      onClick();
    } else {
      setInternalActive(!internalActive);
    }
  };

  if (indicatorOnly) {
    return (
      <span className={`inline-flex ${isActive ? activeColor : "text-primary/30"}`}>
        <Icon size={size} />
      </span>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex p-1.5 rounded-lg transition-colors hover:bg-light-grey ${
        isActive ? activeColor : "text-primary/30 hover:text-primary/50"
      }`}
      title={type.charAt(0).toUpperCase() + type.slice(1)}
    >
      <Icon size={size} />
    </button>
  );
}
