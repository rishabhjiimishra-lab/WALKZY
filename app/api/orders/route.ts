import { NextResponse } from "next/server";
import { canTransition, type OrderStatus } from "../../../lib/domain";
import { getSession } from "../../../lib/auth";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  if (!["merchant", "walker", "admin"].includes(session.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await request.json().catch(() => null) as { from?: OrderStatus; to?: OrderStatus } | null;
  if (!body?.from || !body.to || !canTransition(body.from, body.to)) {
    return NextResponse.json({ error: "Invalid order transition" }, { status: 422 });
  }
  return NextResponse.json({ ok: true, from: body.from, to: body.to });
}
