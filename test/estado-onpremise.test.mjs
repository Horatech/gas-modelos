/**
 * Estado on-premise en tres componentes: túnel, puente OPC-UA y conector Historian
 * (gas/PLAN-HISTORIAN-CAMUZZI.md §10).
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const m = require("../dist/index.js");

test("el heartbeat del conector viaja fuera de los streams del canal", () => {
  const s = m.subjectEstadoHistorian("r01");
  assert.equal(s, "hist.v1.estado.r01");
  for (const patron of m.STREAM_SUBJECTS_CANAL_SCADA) assert.ok(!s.startsWith(patron.replace(">", "")));
});

test("con el túnel caído, puente y conector tienen un estado sin alerta que precede a todos", () => {
  assert.equal(m.EstadoIntegracionScadaSchema.options[0], "Sin información");
  assert.equal(m.EstadoConectorHistorianSchema.options[0], "Sin información");
  assert.equal(m.TIPO_ALERTA_POR_ESTADO_INTEGRACION["Sin información"], undefined);
  assert.equal(m.TIPO_ALERTA_POR_ESTADO_HISTORIAN["Sin información"], undefined);
  assert.equal(m.TIPO_ALERTA_POR_ESTADO_HISTORIAN["Pausado"], undefined, "la pausa es deliberada: no alerta");
});

test("toda alerta de estado es un tipo on-premise (sólo admin global)", () => {
  const tipos = [
    ...Object.values(m.TIPO_ALERTA_POR_ESTADO_ENLACE),
    ...Object.values(m.TIPO_ALERTA_POR_ESTADO_INTEGRACION),
    ...Object.values(m.TIPO_ALERTA_POR_ESTADO_HISTORIAN),
  ];
  for (const t of tipos) {
    assert.ok(m.TIPOS_ALERTA_ONPREMISE.includes(t), t);
    assert.ok(m.TipoAlertaSchema.safeParse(t).success, t);
  }
});

test("heartbeat del conector válido; sin token ni sonda no pasa", () => {
  const hb = {
    arranque: "2026-10-09T12:10:00.000Z",
    enviado: "2026-10-09T12:15:00.000Z",
    version: "fc62344",
    habilitado: true,
    tagsDeclarados: 1221,
    tagsPermitidos: 2,
    token: { fuente: "archivo", ok: true, vence: "2026-10-10T00:08:09.000Z" },
    sonda: { ultimaOk: "2026-10-09T12:14:00.000Z", ms: 106, colaLectura: 0 },
    consultas: { ok: 4, rechazadas: 1, errores: 0 },
    cortacircuitoAbierto: false,
  };
  assert.ok(m.HeartbeatConectorHistorianSchema.safeParse(hb).success);
  const { token, ...sinToken } = hb;
  assert.ok(!m.HeartbeatConectorHistorianSchema.safeParse(sinToken).success);
  assert.ok(!m.HeartbeatConectorHistorianSchema.safeParse({ ...hb, token: { ...token, fuente: "otra" } }).success);
});

test("el documento de estado admite los tres componentes y la sonda del túnel", () => {
  const doc = {
    idCliente: "x",
    enlace: {
      estado: "Conectado",
      desde: "a",
      sondas: { r01: { fecha: "b", ok: true, rttMs: 174, ultimaOk: "b" }, r03: { fecha: "b", ok: false, error: "timeout" } },
    },
    integracionScada: { estado: "Sin información", desde: "a" },
    historian: { estado: "Operativo", desde: "a" },
    transiciones: [{ fecha: "a", componente: "historian", de: "Sin señal", a: "Operativo", modo: "observacion" }],
  };
  assert.ok(m.EstadoOnPremiseSchema.safeParse(doc).success);
  assert.ok(m.ConfigOnPremiseSchema.safeParse({ modo: "observacion", historian: true }).success);
});
