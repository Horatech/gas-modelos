import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const m = require("../dist/index.js");

const aviso = (extra) => ({
  id: "b1", tipo: "aviso", titulo: "Dejar de recibir un aviso", version: 1,
  codigo: 0, filas: [{ nivel: "Global" }], descripcion: "Dejar de recibir X", ...extra,
});

test("bloque aviso: valida y rechaza", () => {
  assert.ok(m.BloqueAsistenteSchema.safeParse(aviso()).success);
  assert.ok(!m.BloqueAsistenteSchema.safeParse(aviso({ codigo: 5 })).success);
  assert.ok(!m.BloqueAsistenteSchema.safeParse(aviso({ filas: [] })).success);
  assert.ok(!m.BloqueAsistenteSchema.safeParse(aviso({ descripcion: "" })).success);
  assert.ok(m.TIPOS_BLOQUE_ASISTENTE.includes("aviso"));
  assert.equal(m.NOMBRES_AVISO_PERFIL[4], "Medidores Residenciales - Sensor desconectado");
});
