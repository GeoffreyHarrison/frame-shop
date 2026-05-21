import { FramesToOrderTable } from "@/components/frames/frames-to-order-table";
import { getAllFramesToOrder } from "@/lib/db";

export default async function FramesToOrderPage() {
  const frames = await getAllFramesToOrder();

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-dark font-serif mb-6">Frame List</h1>
      <FramesToOrderTable frames={frames} />
    </div>
  );
}
