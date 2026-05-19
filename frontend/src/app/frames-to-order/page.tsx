import { FramesToOrderTable } from "@/components/frames/frames-to-order-table";
import framesToOrderData from "@/data/dummy-frames-to-order.json";
import type { FrameToOrder } from "@/lib/types";

export default function FramesToOrderPage() {
  const frames = framesToOrderData as FrameToOrder[];

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-4">
        Frames to Order
      </h1>

      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm text-gray-500">
          {frames.length} frame{frames.length !== 1 ? "s" : ""} pending
        </span>
        <span className="text-sm text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded">
          {frames.filter((f) => f.status === "On List").length} on list
        </span>
        <span className="text-sm text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
          {frames.filter((f) => f.status === "Ordered").length} ordered
        </span>
        <span className="text-sm text-green-700 bg-green-50 px-2 py-0.5 rounded">
          {frames.filter((f) => f.status === "Received").length} received
        </span>
      </div>

      <FramesToOrderTable frames={frames} />
    </div>
  );
}
