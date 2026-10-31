export type Role = "customer" | "walker" | "merchant" | "admin";
export type OrderStatus = "PENDING" | "MERCHANT_ACCEPTED" | "PREPARING" | "READY_FOR_PICKUP" | "WALKER_ASSIGNED" | "PICKED_UP" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";

export const transitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["MERCHANT_ACCEPTED", "CANCELLED"], MERCHANT_ACCEPTED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY_FOR_PICKUP", "CANCELLED"], READY_FOR_PICKUP: ["WALKER_ASSIGNED", "CANCELLED"],
  WALKER_ASSIGNED: ["PICKED_UP", "CANCELLED"], PICKED_UP: ["OUT_FOR_DELIVERY"], OUT_FOR_DELIVERY: ["DELIVERED"], DELIVERED: [], CANCELLED: []
};

export function canTransition(from: OrderStatus, to: OrderStatus) { return transitions[from].includes(to); }

export type MatchInput = { pickupKm: number; detourMinutes: number; weightKg: number; maxRadiusKm?: number; maxDetourMinutes?: number; maxWeightKg?: number };
export function scoreMatch(input: MatchInput) {
  const radius = input.maxRadiusKm ?? 2;
  const detour = input.maxDetourMinutes ?? 8;
  const weight = input.maxWeightKg ?? 3;
  if (input.pickupKm > radius || input.detourMinutes > detour || input.weightKg > weight) return null;
  return Math.round(Math.max(0, 100 - input.pickupKm * 20 - input.detourMinutes * 5 - input.weightKg * 4));
}
