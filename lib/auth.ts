import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Role } from "./domain";

const COOKIE_NAME = "walkzy_session";
const SECRET = process.env.SESSION_SECRET || "development-only-walkzy-secret";
const DEMO_USERS: Record<string, { password: string; role: Role; name: string }> = {
  "customer@demo.walkzy": { password: "CustomerDemo123!", role: "customer", name: "Rishabh" },
  "walker@demo.walkzy": { password: "WalkerDemo123!", role: "walker", name: "Ananya" },
  "merchant@demo.walkzy": { password: "MerchantDemo123!", role: "merchant", name: "Green Basket Market" },
  "admin@demo.walkzy": { password: "AdminDemo123!", role: "admin", name: "Walkzy Admin" }
};

function sign(value: string) {
  return createHmac("sha256", SECRET).update(value).digest("base64url");
}

export function createSession(email: string) {
  const user = DEMO_USERS[email.toLowerCase()];
  if (!user) return null;
  const payload = `${email.toLowerCase()}|${user.role}|${user.name}`;
  return `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;
}

export function getDemoUser(email: string) {
  return DEMO_USERS[email.toLowerCase()];
}

export function verifySession(value: string | undefined) {
  if (!value) return null;
  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) return null;
  const payload = Buffer.from(encoded, "base64url").toString("utf8");
  const expected = sign(payload);
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  const [email, role, name] = payload.split("|");
  if (!email || !name || !["customer", "walker", "merchant", "admin"].includes(role)) return null;
  return { email, role: role as Role, name };
}

export async function getSession() {
  return verifySession((await cookies()).get(COOKIE_NAME)?.value);
}

export async function requireRole(role: Role) {
  const session = await getSession();
  if (!session) redirect(`/auth?next=/${role}`);
  if (session.role !== role) redirect(`/${session.role}`);
  return session;
}

export { COOKIE_NAME, DEMO_USERS };
