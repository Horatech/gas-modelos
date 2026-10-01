/**
 * Clasificación de los rechazos OPC UA: configuración (por tag) vs comunicación (salud de la
 * integración). Ver `PLAN-ESTADO-ONPREMISE.md` § 6.bis.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const m = require("../dist/index.js");

test("rango y nodo inexistente son de configuración", () => {
  assert.equal(m.esRechazoDeConfiguracion("BadOutOfRange"), true);
  assert.equal(m.esRechazoDeConfiguracion("BadNodeIdUnknown"), true);
});

test("las fallas de comunicación y lo desconocido no son de configuración", () => {
  for (const c of ["BadTooManySessions", "BadTimeout", "BadSessionIdInvalid", "BadSubscriptionIdInvalid", "OtroError", "", undefined]) {
    assert.equal(m.esRechazoDeConfiguracion(c), false, String(c));
  }
});
