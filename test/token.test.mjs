/**
 * Tokens de los links de gas-api-cliente: reset, definir clave y verificar mail.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const m = require("../dist/index.js");

test("los tres tipos de token valen, otro no", () => {
  for (const t of ["reset", "definir-clave", "verificar-email"]) {
    assert.equal(m.TipoTokenSchema.safeParse(t).success, true, t);
  }
  assert.equal(m.TipoTokenSchema.safeParse("cambio-password").success, false);
});

test("consumir pide el token y al menos un tipo", () => {
  assert.equal(m.ConsumirTokenSchema.safeParse({ token: "abc", tipos: ["reset"] }).success, true);
  assert.equal(m.ConsumirTokenSchema.safeParse({ token: "abc", tipos: [] }).success, false);
  assert.equal(m.ConsumirTokenSchema.safeParse({ tipos: ["reset"] }).success, false);
});

test("el token guarda tipo y email", () => {
  const r = m.PasswordResetSchema.parse({ token: "h", tipo: "verificar-email", email: "a@x.com" });
  assert.equal(r.tipo, "verificar-email");
  assert.equal(r.email, "a@x.com");
});
