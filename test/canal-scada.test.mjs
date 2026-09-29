/**
 * Contrato del canal SCADA por el túnel (gas/PLAN-SCADA-POR-TUNEL.md §2).
 *
 * Corre con el runner nativo de Node contra `dist/` (npm test hace el build antes).
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const m = require("../dist/index.js");

/** Match de subjects NATS: `*` un token, `>` uno o más tokens al final. */
function captura(patron, subject) {
  const p = patron.split(".");
  const s = subject.split(".");
  for (let i = 0; i < p.length; i++) {
    if (p[i] === ">") return s.length > i;
    if (i >= s.length) return false;
    if (p[i] !== "*" && p[i] !== s[i]) return false;
  }
  return p.length === s.length;
}

test("ningún subject de stream captura petición/respuesta ni el heartbeat", () => {
  const s = m.subjectsCanalScada("r03");
  const fueraDeStream = [s.tags, s.escribir, s.leer, s.estado];
  const enStream = [s.telemetria, s.rechazo, s.limites, s.resultadoComando];
  for (const patron of m.STREAM_SUBJECTS_CANAL_SCADA) {
    for (const subj of fueraDeStream) {
      assert.equal(captura(patron, subj), false, `${patron} captura ${subj}`);
    }
  }
  for (const subj of enStream) {
    assert.ok(
      m.STREAM_SUBJECTS_CANAL_SCADA.some((p) => captura(p, subj)),
      `${subj} no entra a ningún stream`,
    );
  }
});

test("Nats-Msg-Id es <inst>:<arranqueId>:<seq>", () => {
  assert.equal(m.natsMsgIdCanalScada("r03", "a1b2", 42), "r03:a1b2:42");
});

const lote = (muestras) => ({
  inst: "r03",
  arranqueId: "a1b2",
  seq: 7,
  armadoTs: "2026-09-29T12:00:00.000Z",
  autoritativo: "nats",
  motivo: "REGIMEN",
  muestras,
});

test("un lote lleva entre 1 y 200 muestras", () => {
  const muestra = { tag: "T", timestamp: "2026-09-29T12:00:00.000Z", valorActual: 1.5 };
  assert.equal(m.LoteTelemetriaSchema.safeParse(lote([])).success, false);
  assert.equal(m.LoteTelemetriaSchema.safeParse(lote([muestra])).success, true);
  assert.equal(
    m.LoteTelemetriaSchema.safeParse(lote(Array(m.MAX_MUESTRAS_LOTE_SCADA).fill(muestra))).success,
    true,
  );
  assert.equal(
    m.LoteTelemetriaSchema.safeParse(lote(Array(m.MAX_MUESTRAS_LOTE_SCADA + 1).fill(muestra)))
      .success,
    false,
  );
});

test("una muestra puede traer los cuatro límites de un tag juntos", () => {
  const r = m.MuestraScadaSchema.safeParse({
    tag: "T",
    timestamp: "2026-09-29T12:00:00.000Z",
    limiteHH: 90,
    limiteH: 80,
    limiteL: 20,
    limiteLL: 10,
    calidad: 0,
  });
  assert.equal(r.success, true);
});

test("el comando de escritura acepta sólo límites", () => {
  const base = {
    comandoId: "c1",
    tag: "T",
    valor: 1,
    emitidoTs: "2026-09-29T12:00:00.000Z",
    venceTs: "2026-09-29T12:05:00.000Z",
    origen: "USUARIO",
  };
  assert.equal(m.ComandoEscribirLimiteSchema.safeParse({ ...base, propiedad: "E_HI" }).success, true);
  assert.equal(m.ComandoEscribirLimiteSchema.safeParse({ ...base, propiedad: "CV" }).success, false);
});

test("un heartbeat sin los campos del canal sigue validando", () => {
  const r = m.HeartbeatIntegracionScadaSchema.safeParse({
    arranque: "2026-09-28T17:57:29.000Z",
    enviado: "2026-09-29T12:00:00.000Z",
    conectado: true,
    rechazosOpc: 0,
    tags: 1051,
    monitoredItems: 4927,
    sesionesAbiertas: 1,
  });
  assert.equal(r.success, true);
});
