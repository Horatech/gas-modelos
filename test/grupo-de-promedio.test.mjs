import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const m = require("../dist/index.js");

const temperaturaNuc = m.descriptorDe("registros/NUC#temperatura");
const presionNuc = m.descriptorDe("registros/NUC#presion");
const presionUnidad = m.descriptorDe("reportes/Presion#valores.presion");
const caudalNuc = m.descriptorDe("registros/NUC#caudalPromedio");
const media = { commodity: "gas", codigo: "MEDIA", orden: 3 };
const alta = { commodity: "gas", codigo: "ALTA", orden: 2 };

test("los canales del caso existen en el catálogo", () => {
  for (const d of [temperaturaNuc, presionNuc, presionUnidad, caudalNuc]) assert.ok(d);
  assert.equal(presionNuc.referencia, "absoluta");
  assert.equal(presionUnidad.referencia, "manometrica");
});

test("la temperatura del gas se promedia entre todos los puntos, con o sin clasificación", () => {
  const sin = m.grupoDePromedio(temperaturaNuc);
  const con = m.grupoDePromedio(temperaturaNuc, { nivelRed: alta, rolesRed: ["ENTREGA"] });
  assert.ok(sin.clave);
  assert.equal(sin.clave, con.clave);
  assert.equal(sin.faltaClasificacion, false);
});

test("la presión sin nivel de red no entra en el promedio y avisa", () => {
  assert.deepEqual(m.grupoDePromedio(presionNuc), { clave: null, faltaClasificacion: true });
  assert.deepEqual(m.grupoDePromedio(presionNuc, { commodity: "gas" }), { clave: null, faltaClasificacion: true });
});

test("la presión se agrupa por nivel de red y referencia; los roles no se exigen", () => {
  const a = m.grupoDePromedio(presionUnidad, { nivelRed: media, rolesRed: ["ENTREGA"] });
  const b = m.grupoDePromedio(presionUnidad, { nivelRed: media });
  const otroNivel = m.grupoDePromedio(presionUnidad, { nivelRed: alta });
  assert.ok(a.clave);
  assert.equal(a.clave, b.clave);
  assert.notEqual(a.clave, otroNivel.clave);
  // Absoluta (correctora) y manométrica (unidad de presión) del mismo nivel no se mezclan.
  assert.notEqual(m.grupoDePromedio(presionNuc, { nivelRed: media }).clave, a.clave);
});

test("la referencia por defecto vale, pero avisa; declarada y con roles, no", () => {
  const clasificacion = { nivelRed: media, rolesRed: ["ENTREGA"] };
  assert.equal(m.grupoDePromedio(presionUnidad, clasificacion).faltaClasificacion, true);
  assert.equal(m.grupoDePromedio(presionUnidad, clasificacion, "manometrica").faltaClasificacion, false);
  assert.equal(m.grupoDePromedio(presionUnidad, { nivelRed: media }, "manometrica").faltaClasificacion, true);
  // "desconocida" declarada no dice nada: rige la por defecto.
  assert.deepEqual(
    m.grupoDePromedio(presionUnidad, clasificacion, "desconocida"),
    m.grupoDePromedio(presionUnidad, clasificacion),
  );
});

test("la referencia declarada manda sobre la por defecto del canal", () => {
  const clasificacion = { nivelRed: media };
  assert.equal(
    m.grupoDePromedio(presionNuc, clasificacion, "manometrica").clave,
    m.grupoDePromedio(presionUnidad, clasificacion).clave,
  );
});

test("un nivel de red de otro commodity no sirve", () => {
  const agua = { commodity: "agua", codigo: "DISTRIBUCION", orden: 2 };
  assert.deepEqual(m.grupoDePromedio(presionUnidad, { nivelRed: agua }), { clave: null, faltaClasificacion: true });
});

test("lo que no es un instantáneo de proceso, o no tiene regla, no se promedia entre puntos", () => {
  assert.deepEqual(m.grupoDePromedio(caudalNuc, { nivelRed: media }), { clave: null, faltaClasificacion: false });
  const volumen = m.descriptorDe("registros/NUC#correctedParcializado");
  assert.ok(volumen);
  assert.equal(m.grupoDePromedio(volumen).clave, null);
  assert.equal(m.grupoDePromedio({ ...temperaturaNuc, emitido: false }).clave, null);
  assert.equal(m.grupoDePromedio({ ...temperaturaNuc, dominio: "dispositivo" }).clave, null);
});
