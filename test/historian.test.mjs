/**
 * Contrato del Historian (`hist.v1`) y de la serie SCADA consolidada
 * (gas/PLAN-HISTORIAN-CAMUZZI.md §2.1 y §8).
 *
 * Corre con el runner nativo de Node contra `dist/` (npm test hace el build antes).
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const m = require("../dist/index.js");

test("el subject de consulta queda fuera de los streams del canal SCADA", () => {
  const subject = m.subjectConsultaHistorian("r03");
  assert.equal(subject, "hist.v1.consulta.r03");
  for (const patron of m.STREAM_SUBJECTS_CANAL_SCADA) {
    assert.ok(!subject.startsWith(patron.replace(">", "")), `${patron} captura ${subject}`);
  }
});

test("la escalera de resoluciones es creciente y empieza en la grilla de archivo", () => {
  const ms = m.ResolucionHistorianSchema.options.map((r) => m.RESOLUCION_HISTORIAN_MS[r]);
  for (let i = 1; i < ms.length; i++) assert.ok(ms[i] > ms[i - 1]);
  assert.equal(m.RESOLUCION_HISTORIAN_CRUDA, m.ResolucionHistorianSchema.options[0]);
  assert.equal(m.RESOLUCION_HISTORIAN_MS["2m"], 120_000);
});

test("una consulta de serie válida pasa; sin tags o con demasiados, no", () => {
  const base = {
    consultaId: "c1",
    tipo: "serie",
    tags: ["AND_ESQ_ERP_BOLSON_UC_QI"],
    desde: "2026-09-01T00:00:00.000Z",
    hasta: "2026-09-02T00:00:00.000Z",
    resolucion: "1h",
    venceTs: "2026-10-08T20:00:00.000Z",
  };
  assert.ok(m.ConsultaHistorianSchema.safeParse(base).success);
  assert.ok(!m.ConsultaHistorianSchema.safeParse({ ...base, tags: [] }).success);
  const muchos = Array.from({ length: m.MAX_TAGS_CONSULTA_HISTORIAN + 1 }, (_, i) => `T${i}`);
  assert.ok(!m.ConsultaHistorianSchema.safeParse({ ...base, tags: muchos }).success);
  assert.ok(!m.ConsultaHistorianSchema.safeParse({ ...base, resolucion: "30s" }).success);
});

test("una muestra agregada exige la envolvente completa", () => {
  const ok = ["2026-09-01T00:00:00.000Z", 3730.5, 3701.2, 5598.7, 3];
  assert.ok(m.MuestraAgregadaHistorianSchema.safeParse(ok).success);
  assert.ok(!m.MuestraAgregadaHistorianSchema.safeParse(ok.slice(0, 3).concat([3])).success);
  assert.ok(!m.MuestraAgregadaHistorianSchema.safeParse([...ok.slice(0, 4), 4]).success, "calidad fuera de 0..3");
});

test("respuesta: OK, RECHAZADA y ERROR_HISTORIAN", () => {
  const ok = {
    consultaId: "c1",
    estado: "OK",
    msHistorian: 49,
    series: [
      {
        tag: "AND_ESQ_ERP_BOLSON_UC_PS",
        nombreHistorian: "FIX.AND_ESQ_ERP_BOLSON_UC_PS.F_CV",
        unidad: "bar",
        muestras: [["2026-10-08T19:14:00.000Z", 3.923566818, 3]],
      },
    ],
  };
  assert.ok(m.RespuestaHistorianSchema.safeParse(ok).success);
  assert.ok(m.RespuestaHistorianSchema.safeParse({ consultaId: "c1", estado: "RECHAZADA", motivo: "TAG_NO_DECLARADO" }).success);
  assert.ok(!m.RespuestaHistorianSchema.safeParse({ consultaId: "c1", estado: "RECHAZADA", motivo: "OTRO" }).success);
  assert.ok(m.RespuestaHistorianSchema.safeParse({ consultaId: "c1", estado: "ERROR_HISTORIAN", codigo: -24 }).success);
});

test("serie consolidada: puntos crudos y agregados conviven, con tramos", () => {
  const serie = {
    puntos: [
      ["2026-08-01T00:00:00.000Z", 3700, 3650, 5598],
      ["2026-10-08T19:14:00.000Z", 3734.4],
    ],
    tramos: [
      { fuente: "historian", desde: "2026-08-01T00:00:00.000Z", hasta: "2026-09-09T00:00:00.000Z", resolucion: "1h", estado: "ok" },
      { fuente: "local", desde: "2026-09-09T00:00:00.000Z", hasta: "2026-10-08T19:15:00.000Z", resolucion: "cambio", estado: "ok" },
    ],
    truncado: false,
  };
  assert.ok(m.SerieScadaSchema.safeParse(serie).success);
  assert.ok(!m.SerieScadaSchema.safeParse({ ...serie, tramos: [{ ...serie.tramos[0], estado: "caido" }] }).success);
});

test("el pedido de serie acepta maxPuntos como texto de query y respeta el tope", () => {
  const r = m.PedidoSerieScadaSchema.safeParse({ desde: "a", hasta: "b", maxPuntos: "5000" });
  assert.ok(r.success);
  assert.equal(r.data.maxPuntos, 5000);
  assert.ok(!m.PedidoSerieScadaSchema.safeParse({ desde: "a", hasta: "b", maxPuntos: "20000" }).success);
});
