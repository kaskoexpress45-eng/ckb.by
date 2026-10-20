import test from "node:test";
import assert from "node:assert/strict";
import { validateLead, createRateLimiter, deliverLead } from "../lib/lead.ts";
const base = {
  name: "Тест",
  contact: "+375 29 123-45-67",
  direction: "development",
  message: "Нужен разбор переговоров",
  page: "/kontakty",
  consent: true,
  utm: { utm_source: "test", password: "not-retained" },
};
test("phone and Telegram contacts are alternatives; only allowed attribution is retained", () => {
  const p = validateLead(base);
  assert.equal(p.lead.phone, base.contact);
  assert.equal(p.lead.telegram, null);
  assert.deepEqual(p.lead.utm, { utm_source: "test" });
  const t = validateLead({ ...base, contact: "@test_person" });
  assert.equal(t.lead.telegram, "@test_person");
  assert.equal(t.lead.phone, null);
});
test("rejects missing consent, malformed contact, unexpected direction and excessive content", () => {
  for (const change of [
    { consent: false },
    { contact: "xxx" },
    { direction: "unknown" },
    { message: "a".repeat(2001) },
    { name: "a".repeat(101) },
    { page: "https://attacker.example" },
  ])
    assert.ok("error" in validateLead({ ...base, ...change }));
});
test("malformed payload types cannot bypass validation", () => {
  for (const value of [
    null,
    [],
    false,
    "x",
    {},
    { ...base, contact: { phone: "123" } },
    { ...base, message: [] },
    { ...base, consent: "true" },
  ])
    assert.ok("error" in validateLead(value));
});
test("honeypot is ignored without delivery", () =>
  assert.deepEqual(validateLead({ ...base, website: "spam.example" }), {
    spam: true,
  }));
test("rate limiter expires and bounds storage", () => {
  const allow = createRateLimiter(2, 100, 2);
  assert.equal(allow("a", 0), true);
  assert.equal(allow("a", 1), true);
  assert.equal(allow("a", 2), false);
  assert.equal(allow("b", 2), true);
  assert.equal(allow("c", 3), false);
  assert.equal(allow("a", 101), true);
});
test("one real delivery suffices; partial delivery failures stay explicit", async () => {
  const result = await deliverLead(validateLead(base).lead, [
    async () => {},
    async () => {
      throw new Error("offline");
    },
  ]);
  assert.deepEqual(result, { accepted: true, failed: 1 });
});
test("no channels or all failed channels cannot report success", async () => {
  const lead = validateLead(base).lead;
  assert.equal((await deliverLead(lead, [])).accepted, false);
  assert.deepEqual(
    await deliverLead(lead, [
      async () => {
        throw new Error("offline");
      },
    ]),
    { accepted: false, failed: 1 },
  );
});
