import test from "node:test";
import assert from "node:assert/strict";
import { canTransition, scoreMatch } from "../lib/domain.ts";
test("order state machine rejects skipping preparation", () => assert.equal(canTransition("PENDING", "DELIVERED"), false));
test("order state machine allows merchant acceptance", () => assert.equal(canTransition("PENDING", "MERCHANT_ACCEPTED"), true));
test("route matcher rejects overweight requests", () => assert.equal(scoreMatch({ pickupKm: .4, detourMinutes: 3, weightKg: 4 }), null));
test("route matcher scores eligible requests", () => assert.equal(scoreMatch({ pickupKm: .4, detourMinutes: 3, weightKg: 1 }), 73));
