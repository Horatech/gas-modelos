import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const m = require("../dist/index.js");

test("el consumo residencial por ámbito está en el catálogo como una acumulación diaria", () => {
  assert.equal(m.CANAL_CONSUMO_RESIDENCIAL, "resumendiariolocalidads/Ambito#consumoResidencial");
  const d = m.descriptorDe(m.CANAL_CONSUMO_RESIDENCIAL);
  assert.deepEqual(
    [d.quantityKind, d.accumulation, d.unidadCanonica, d.measuringPeriod, d.dominio, d.commodity, d.divisionRequerida, d.emitido],
    ["volumen", "delta", "m3", "diario", "proceso", "gas", "Residencial", true],
  );
  // Una acumulación se suma en el tiempo: nunca se promedia.
  assert.equal(m.aggDe(d), "sum");
  assert.equal(m.grupoDePromedio(d).clave, null);
  assert.equal(m.perfilDe(m.CANAL_CONSUMO_RESIDENCIAL), m.PERFIL_AMBITO);
});

test("los medidores del día son un canal de ámbito, pero el gráfico no los ofrece", () => {
  assert.deepEqual(m.CANALES_AMBITO, [m.CANAL_CONSUMO_RESIDENCIAL, m.CANAL_MEDIDORES_RESIDENCIALES]);
  assert.deepEqual(m.CANALES_AMBITO_GRAFICABLES, [m.CANAL_CONSUMO_RESIDENCIAL]);
  assert.equal(m.esCanalAmbito(m.CANAL_MEDIDORES_RESIDENCIALES), true);
  assert.equal(m.esCanalAmbito(m.CANALES_CLIMA[0]), false);
  assert.equal(m.esCanalClima(m.CANAL_CONSUMO_RESIDENCIAL), false);
  assert.equal(m.descriptorDe(m.CANAL_MEDIDORES_RESIDENCIALES).quantityKind, "conteo");
});

test("pedido de series por ámbito: Localidad, Centro Operativo o Unidad de Negocio, sólo con canales de ámbito", () => {
  const pedido = (items) => m.PedidoSeriesAmbitoSchema.safeParse({ items, desde: "2026-10-01T10:00:00.000Z", hasta: "2026-11-01T10:00:00.000Z" });
  for (const nivel of ["Localidad", "CentroOperativo", "UnidadNegocio"]) {
    assert.equal(pedido([{ canal: m.CANAL_CONSUMO_RESIDENCIAL, ambito: { nivel, id: "a" } }]).success, true, nivel);
  }
  assert.equal(pedido([{ canal: m.CANAL_CONSUMO_RESIDENCIAL, ambito: { nivel: "Cliente", id: "a" } }]).success, false);
  assert.equal(pedido([{ canal: m.CANALES_CLIMA[0], ambito: { nivel: "Localidad", id: "a" } }]).success, false);
  assert.equal(pedido([]).success, false);
  const muchos = Array.from({ length: m.MAX_ITEMS_SERIES_AMBITO + 1 }, (_, i) => ({ canal: m.CANAL_CONSUMO_RESIDENCIAL, ambito: { nivel: "Localidad", id: String(i) } }));
  assert.equal(pedido(muchos).success, false);
});

test("preset: el consumo va por Unidad de Negocio; el clima, no", () => {
  const serie = (canal, nivel) => m.SeriePresetSchema.safeParse({ canal, ambito: { nivel, id: "a" }, visible: true });
  assert.equal(serie(m.CANAL_CONSUMO_RESIDENCIAL, "UnidadNegocio").success, true);
  assert.equal(serie(m.CANAL_CONSUMO_RESIDENCIAL, "Localidad").success, true);
  assert.equal(serie(m.CANALES_CLIMA[0], "CentroOperativo").success, true);
  assert.equal(serie(m.CANALES_CLIMA[0], "UnidadNegocio").success, false);
});
