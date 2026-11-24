import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const m = require("../dist/index.js");

test("recorrido: android e ios comparten el canal app", () => {
  assert.equal(m.canalRecorridoAsistente("web"), "web");
  assert.equal(m.canalRecorridoAsistente("android"), "app");
  assert.equal(m.canalRecorridoAsistente("ios"), "app");
});

test("recorrido: el usuario guarda cuándo lo vio por canal", () => {
  const visto = { web: "2026-11-24T10:00:00.000Z" };
  assert.deepEqual(m.UsuarioSchema.parse({ recorridoAsistente: visto }).recorridoAsistente, visto);
  assert.deepEqual(m.UpdateUsuarioSchema.parse({ recorridoAsistente: { app: "x" } }).recorridoAsistente, { app: "x" });
  assert.equal(m.UsuarioSchema.safeParse({ recorridoAsistente: { web: 3 } }).success, false);
});
