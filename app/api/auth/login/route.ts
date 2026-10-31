import { NextResponse } from "next/server";
import { createSession, getDemoUser } from "../../../../lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { email?: unknown; password?: unknown } | null;
  if (typeof body?.email !== "string" || typeof body.password !== "string") return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  const user = getDemoUser(body.email);
  const session = createSession(body.email);
  const valid = session && user && body.password === user.password;
  if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  const response = NextResponse.json({ redirect: `/${user.role}` });
  response.cookies.set("walkzy_session", session!, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 8 });
  return response;
}
