import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const m = require("../dist/index.js");

const PRESION = "reportes/Presion#valores.presion";
const base = (tipo, extra) => ({ id: "b1", tipo, titulo: "Presión en X", version: 1, ...extra });

const valor = base("valor", { idPunto: "p1", canales: [PRESION] });
const serie = base("serie", { series: ["a", "p1.presion"], desde: "2026-10-01", hasta: "2026-10-15" });
const registros = base("registros", {
  idPunto: "p1",
  canales: [PRESION],
  desde: "2026-10-01T03:00:00.000Z",
  hasta: "2026-10-02T03:00:00.000Z",
  zonaHoraria: "America/Argentina/Buenos_Aires",
});
const seguimiento = base("seguimiento", { idPunto: "p1", modo: "vivo", cadenciaEsperadaMin: 1 });
const puntos = base("puntos", { filtro: { estados: ["Alerta"], divisiones: ["Presión"] }, orden: "-fechaUltimoReporte" });

const ok = (b) => m.BloqueAsistenteSchema.safeParse(b).success;

test("los cinco tipos válidos pasan y el tipo discrimina", () => {
  for (const b of [valor, serie, registros, seguimiento, puntos]) {
    const r = m.BloqueAsistenteSchema.safeParse(b);
    assert.equal(r.success, true, `${b.tipo}: ${JSON.stringify(r.error?.issues)}`);
    assert.equal(r.data.tipo, b.tipo);
  }
  assert.deepEqual(m.TIPOS_BLOQUE_ASISTENTE, ["valor", "serie", "registros", "seguimiento", "puntos"]);
  assert.deepEqual(m.BloqueAsistenteSchema.options.map((o) => o.shape.tipo.value), m.TIPOS_BLOQUE_ASISTENTE);
});

test("tipo desconocido o campos de otro tipo: rechazado", () => {
  assert.equal(ok({ ...valor, tipo: "mapa" }), false);
  assert.equal(ok({ ...serie, tipo: "valor" }), false);
});

test("comunes: id, titulo y version entera desde 1", () => {
  assert.equal(ok({ ...valor, id: "" }), false);
  assert.equal(ok({ ...valor, id: "x".repeat(65) }), false);
  assert.equal(ok({ ...valor, titulo: "  " }), false);
  assert.equal(ok({ ...valor, version: 0 }), false);
  assert.equal(ok({ ...valor, version: 1.5 }), false);
  assert.equal(ok({ ...valor, version: 3 }), true);
});

test("canales: CanalRef válido, entre 1 y el máximo", () => {
  assert.equal(ok({ ...valor, canales: [] }), false);
  assert.equal(ok({ ...valor, canales: ["presion"] }), false);
  assert.equal(ok({ ...valor, canales: Array(m.MAX_CANALES_BLOQUE + 1).fill(PRESION) }), false);
  assert.equal(ok({ ...registros, canales: ["x"] }), false);
  assert.equal(ok({ ...seguimiento, canal: "x" }), false);
  assert.equal(ok({ ...seguimiento, canal: PRESION }), true);
});

test("serie: período absoluto, día o instante; hasta no anterior a desde", () => {
  assert.equal(ok({ ...serie, desde: "2026-10-15", hasta: "2026-10-15" }), true);
  assert.equal(ok({ ...serie, desde: "2026-10-01T00:00:00.000Z", hasta: "2026-10-02T00:00:00.000Z" }), true);
  assert.equal(ok({ ...serie, desde: "2026-10-16", hasta: "2026-10-15" }), false);
  assert.equal(ok({ ...serie, desde: "1W" }), false);
  assert.equal(ok({ ...serie, series: [] }), false);
  assert.equal(ok({ ...serie, series: Array(m.MAX_SERIES_GRAFICO + 1).fill("a") }), false);
});

test("registros: ventana no vacía y zona horaria IANA", () => {
  assert.equal(ok({ ...registros, hasta: registros.desde }), false);
  assert.equal(ok({ ...registros, zonaHoraria: "Argentina" }), false);
  assert.equal(ok({ ...registros, zonaHoraria: "UTC" }), true);
  const { zonaHoraria, ...sinZona } = registros;
  assert.ok(zonaHoraria);
  assert.equal(ok(sinZona), false);
});

test("seguimiento: modo cerrado y cadencia positiva", () => {
  for (const modo of ["vivo", "ultimoReporte", "ultimoEnvio"]) assert.equal(ok({ ...seguimiento, modo }), true);
  assert.equal(ok({ ...seguimiento, modo: "tiempoReal" }), false);
  assert.equal(ok({ ...seguimiento, cadenciaEsperadaMin: 0 }), false);
  assert.equal(ok({ ...seguimiento, modo: "ultimoEnvio", cadenciaEsperadaMin: 1440 }), true);
});

test("puntos: filtro con estados y divisiones del catálogo; vacío = sin filtro", () => {
  assert.equal(ok({ ...puntos, filtro: {} }), true);
  assert.equal(ok({ ...puntos, filtro: { estados: ["Roto"] } }), false);
  assert.equal(ok({ ...puntos, filtro: { divisiones: ["Gas"] } }), false);
  assert.equal(ok({ ...puntos, filtro: { estados: [] } }), false);
  assert.equal(ok({ ...puntos, filtro: { idsUnidadNegocio: ["un1"], idsCentroOperativo: ["co1"] } }), true);
});

test("marcador: el regex encuentra los ids que arma marcadorBloque", () => {
  const texto = `Antes ${m.marcadorBloque("b1")} medio ${m.marcadorBloque("b-2")} y {{bloque:}} {{bloque:a b}}`;
  assert.deepEqual([...texto.matchAll(m.regexMarcadorBloque())].map((x) => x[1]), ["b1", "b-2"]);
});

test("consulta: bloques opcional, sin ids repetidos", () => {
  const consulta = {
    idCliente: "c",
    idUsuario: "u",
    idConversacion: "k",
    pregunta: "presión ahora en X",
    respuesta: `La presión de X: ${m.marcadorBloque("b1")}`,
    resultado: "ok",
  };
  assert.equal(m.ConsultaAsistenteSchema.safeParse(consulta).success, true);
  assert.equal(m.ConsultaAsistenteSchema.safeParse({ ...consulta, bloques: [valor] }).success, true);
  assert.equal(m.CreateConsultaAsistenteSchema.safeParse({ ...consulta, bloques: [valor, { ...serie, id: "b2" }] }).success, true);
  assert.equal(m.ConsultaAsistenteSchema.safeParse({ ...consulta, bloques: [valor, serie] }).success, false);
  assert.equal(m.ConsultaAsistenteSchema.safeParse({ ...consulta, bloques: [{ ...valor, canales: [] }] }).success, false);
});
