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

test("la aceptación distingue un tag booleano de uno no vigente", () => {
  const ok = (estado) => m.AceptacionComandoScadaSchema.safeParse({ comandoId: "c1", estado }).success;
  assert.equal(ok("TAG_BOOLEANO"), true);
  assert.equal(ok("TAG_NO_VIGENTE"), true);
  assert.equal(ok("BOOLEANO"), false);
});

test("un lote sólo puede ser autoritativo del canal", () => {
  const muestra = { tag: "T", timestamp: "2026-09-29T12:00:00.000Z", valorActual: 1.5 };
  assert.equal(m.LoteTelemetriaSchema.safeParse(lote([muestra])).success, true);
  assert.equal(
    m.LoteTelemetriaSchema.safeParse({ ...lote([muestra]), autoritativo: "http" }).success,
    false,
  );
});

test("la huella no tiene origen HTTP", () => {
  assert.equal(m.OrigenHuellaScadaSchema.safeParse("adaptador-canal").success, true);
  assert.equal(m.OrigenHuellaScadaSchema.safeParse("adaptador-http").success, false);
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

const m_ = m;

// ── Huella por minuto ────────────────────────────────────────────────────────────────────────

const muestra = (extra = {}) => ({
  tag: "BAC_PEH_ERP_AMERICA1_TP_PE",
  timestamp: "2026-09-30T19:22:03.658Z",
  valorActual: 21.7275,
  limiteHH: 30,
  ...extra,
});

test("la firma es la misma antes y después de viajar como JSON", () => {
  const m = muestra({ limiteH: undefined, calidad: 0, tsServidor: "2026-09-30T19:22:04Z" });
  const viajada = JSON.parse(JSON.stringify(m));
  assert.equal(m_.firmaMuestraScada(m), m_.firmaMuestraScada(viajada));
});

test("la firma distingue null de ausente y cambia con cualquier campo persistido", () => {
  const base = m_.firmaMuestraScada(muestra());
  assert.notEqual(m_.firmaMuestraScada(muestra({ limiteL: null })), base);
  assert.notEqual(m_.firmaMuestraScada(muestra({ valorActual: 21.7276 })), base);
  assert.notEqual(m_.firmaMuestraScada(muestra({ timestamp: "2026-09-30T19:22:03.659Z" })), base);
  assert.notEqual(m_.firmaMuestraScada(muestra({ tag: "OTRO" })), base);
  assert.notEqual(m_.firmaMuestraScada(muestra({ valorActual: true })), m_.firmaMuestraScada(muestra({ valorActual: 1 })));
  // Lo que no se persiste no entra en la firma.
  assert.equal(m_.firmaMuestraScada(muestra({ calidad: 5, tsServidor: "x" })), base);
});

test("el minuto sale del timestamp de la muestra, en UTC", () => {
  assert.equal(m_.minutoHuellaScada("2026-09-30T19:22:59.999Z"), "2026-09-30T19:22Z");
  assert.equal(m_.minutoHuellaScada("2026-09-30T16:22:10.000-03:00"), "2026-09-30T19:22Z");
  assert.equal(m_.minutoHuellaScada(undefined), "sin-hora");
  assert.equal(m_.minutoHuellaScada("no es fecha"), "sin-hora");
});

test("el acumulador agrupa por minuto y queda vacío al extraer", () => {
  const a = new m_.AcumuladorHuellasScada();
  a.agregar(muestra());
  a.agregar(muestra({ timestamp: "2026-09-30T19:22:40.000Z" }));
  a.agregar(muestra({ timestamp: "2026-09-30T19:23:01.000Z" }));
  const h = a.extraer();
  assert.deepEqual(Object.keys(h), ["2026-09-30T19:22Z", "2026-09-30T19:23Z"]);
  assert.equal(h["2026-09-30T19:22Z"].n, 2);
  assert.match(h["2026-09-30T19:23Z"].x, /^[0-9a-f]{16}$/);
  assert.equal(a.vacio, true);
  assert.deepEqual(a.extraer(), {});
  for (const v of Object.values(h)) assert.ok(m_.HuellaMinutoScadaSchema.safeParse(v).success);
});

test("las parciales se combinan en cualquier orden y dan lo mismo que acumular todo junto", () => {
  const muestras = Array.from({ length: 50 }, (_, i) =>
    muestra({ tag: `T${i % 7}`, timestamp: `2026-09-30T19:2${i % 3}:0${i % 10}.000Z`, valorActual: i }),
  );
  const todo = new m_.AcumuladorHuellasScada();
  muestras.forEach((m) => todo.agregar(m));
  const esperado = todo.extraer();

  const parciales = [];
  const a = new m_.AcumuladorHuellasScada();
  muestras.forEach((m, i) => {
    a.agregar(m);
    if (i % 13 === 12) parciales.push(a.extraer());
  });
  parciales.push(a.extraer());
  assert.deepEqual(m_.combinarHuellasScada(parciales), esperado);
  assert.deepEqual(m_.combinarHuellasScada([...parciales].reverse()), esperado);
});

test("una muestra duplicada o faltante cambia la huella del minuto", () => {
  const a = new m_.AcumuladorHuellasScada();
  const b = new m_.AcumuladorHuellasScada();
  const c = new m_.AcumuladorHuellasScada();
  const ms = [muestra(), muestra({ tag: "B" }), muestra({ tag: "C" })];
  ms.forEach((m) => a.agregar(m));
  [...ms, ms[1]].forEach((m) => b.agregar(m)); // duplicada
  ms.slice(0, 2).forEach((m) => c.agregar(m)); // faltante
  const [ha, hb, hc] = [a, b, c].map((x) => x.extraer()["2026-09-30T19:22Z"]);
  assert.notDeepEqual(hb, ha);
  assert.notDeepEqual(hc, ha);
});

test("el parcial emitido valida contra su schema", () => {
  const a = new m_.AcumuladorHuellasScada();
  a.agregar(muestra());
  const parcial = { origen: "consumidor", inst: "r03", emitidoTs: new Date().toISOString(), minutos: a.extraer() };
  assert.ok(m_.HuellaParcialScadaSchema.safeParse(parcial).success);
  assert.equal(m_.HuellaParcialScadaSchema.safeParse({ ...parcial, origen: "otro" }).success, false);
});
