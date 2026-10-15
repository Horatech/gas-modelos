import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const m = require("../dist/index.js");

test("variable sin los campos: con límites y replicada en iFix, como siempre", () => {
  assert.equal(m.usaLimites({}), true);
  assert.equal(m.replicaEnIfix({}), true);
});

test("sin límites no se replica; con límites puede quedar sólo en INSIDEht", () => {
  assert.equal(m.usaLimites({ conLimites: false }), false);
  assert.equal(m.replicaEnIfix({ conLimites: false, replicarEnIfix: true }), false);
  assert.equal(m.replicaEnIfix({ conLimites: true, replicarEnIfix: false }), false);
  assert.equal(m.replicaEnIfix({ conLimites: true }), true);
});

test("el schema acepta los dos campos", () => {
  const r = m.UpdateScadaSchema.safeParse({ conLimites: false, replicarEnIfix: false });
  assert.equal(r.success, true);
  assert.equal(r.data.conLimites, false);
});
