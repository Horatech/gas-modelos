/**
 * El símbolo de la biblioteca del unifilar. Corre con el runner nativo contra `dist/`.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { CreateSimboloSchema, UpdateSimboloSchema } = require("../dist/index.js");

const base = {
  idCliente: "6aa30000000000000000ca01",
  codigo: "ERP-MED",
  nombre: "Estación Reguladora de Presión c/Medición",
  categoria: "INST · ESTACIONES",
  svg: '<rect x="4" y="5" width="48" height="26" rx="3" fill="none" stroke="#c8c8c8"/>',
  cuerpo: { x: 4, y: 5, w: 48, h: 26 },
};

test("acepta un símbolo de la guía", () => {
  assert.equal(CreateSimboloSchema.safeParse(base).success, true);
});

test("el código lleva al menos un guión: los tipos de fila no son símbolos", () => {
  for (const codigo of ["PE", "QI", "TXT", "erp-med", "ERP_MED", "ERP-"]) {
    assert.equal(CreateSimboloSchema.safeParse({ ...base, codigo }).success, false, codigo);
  }
  assert.equal(CreateSimboloSchema.safeParse({ ...base, codigo: "VLV-BLQ" }).success, true);
});

test("el cuerpo tiene ancho y alto positivos", () => {
  assert.equal(CreateSimboloSchema.safeParse({ ...base, cuerpo: { x: 4, y: 5, w: 0, h: 26 } }).success, false);
});

test("al actualizar no se cambia ni el cliente ni el código", () => {
  const r = UpdateSimboloSchema.parse({ codigo: "OTRO-COD", idCliente: "x", nombre: "n" });
  assert.deepEqual(r, { nombre: "n" });
});
