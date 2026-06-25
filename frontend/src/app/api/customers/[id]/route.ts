import { getCustomerById } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await getCustomerById(id);
  if (!result) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json({ customer: result.customer });
}
