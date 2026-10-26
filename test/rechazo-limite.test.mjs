/**
 * Clasificación de los rechazos OPC UA: por tag (configuración u operación) vs integración (salud
 * del puente). Lista cerrada de códigos de integración; el resto es por tag. Ver
 * `PLAN-ESTADO-ONPREMISE.md` § 6.bis.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const m = require("../dist/index.js");

test("lo que el servidor contesta sobre un tag es por tag (configuración)", () => {
  for (const c of [
    "BadOutOfRange",
    "BadNodeIdUnknown",
    "BadNodeIdInvalid",
    "BadUserAccessDenied",
    "BadConfigurationError",
    "BadUnexpectedError",
    "BadNotWritable",
    "BadTypeMismatch",
    "BadAttributeIdInvalid",
    "TAG_NO_ENCONTRADO",
  ]) {
    assert.equal(m.esRechazoDeConfiguracion(c), true, c);
    assert.equal(m.esRechazoDeIntegracion(c), false, c);
  }
});

test("transporte, canal, sesión, servidor y credenciales son de integración", () => {
  for (const c of [
    "BadTimeout",
    "BadRequestTimeout",
    "BadCommunicationError",
    "BadNoCommunication",
    "BadConnectionClosed",
    "BadTooManySessions",
    "BadSessionIdInvalid",
    "BadSessionClosed",
    "BadSecureChannelClosed",
    "BadServerHalted",
    "BadServerNotConnected",
    "BadSubscriptionIdInvalid",
    "BadIdentityTokenRejected",
    "BadCertificateInvalid",
  ]) {
    assert.equal(m.esRechazoDeIntegracion(c), true, c);
    assert.equal(m.esRechazoDeConfiguracion(c), false, c);
  }
});

test("sin código es de integración, nunca de configuración", () => {
  for (const c of ["", undefined]) {
    assert.equal(m.esRechazoDeIntegracion(c), true, String(c));
    assert.equal(m.esRechazoDeConfiguracion(c), false, String(c));
  }
});
