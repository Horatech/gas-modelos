/**
 * Los seis errores que este trabajo existe para impedir, fijados en tests.
 *
 * Corre con el runner nativo de Node (`node --test`): **cero dependencias
 * nuevas**. Requiere `npm run build` antes, porque prueba contra `dist/` — que es
 * el entrypoint que consumen los servicios NestJS, no `src/`.
 *
 * Referencia: /PLAN-MODELO-CANONICO-MULTIVERTICAL.md §5.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const m = require("../dist/index.js");

const {
  CATALOGO_CANALES,
  aggDe,
  sumable,
  neteable,
  canalRef,
  parseCanalRef,
  descriptorDe,
  mismoGrupoDeAgregacion,
} = m;

const NUC = CATALOGO_CANALES.find((p) => p.clave === "NUC").campos;
const NME = CATALOGO_CANALES.find((p) => p.clave === "NME").campos;

// ── Caso 1 — energía importada vs exportada ────────────────────────────────
// Tienen TODOS los ejes idénticos salvo el sentido. Son físicamente sumables
// (energía que cruzó el medidor) y NO neteables: restar un sentido del otro borra
// cuánto se inyectó, que es el dato con el que se evalúa el alivio de carga del
// transformador de la zona. El motivo es operativo, no de facturación: la
// plataforma no valoriza.
test("1. whImportada y whExportada: sumables, NO neteables", () => {
  assert.equal(
    sumable(NME.whImportada, NME.whExportada),
    true,
    "físicamente sumables: mismo quantityKind, unidad, condición y ventana",
  );
  assert.equal(
    neteable(NME.whImportada, NME.whExportada),
    false,
    "netear importada con exportada borra la inyección",
  );
});

// Sentidos opuestos NO se netean, y no hay forma de declarar una excepción: el
// predicado no consulta ningún campo que un perfil pueda usar para opt-in.
test("1b. la prohibición de netear sentidos opuestos no es declarable", () => {
  const conSentidoInvertido = { ...NME.whImportada, flowDirection: "saliente" };
  assert.equal(neteable(NME.whImportada, conSentidoInvertido), false);
  // Mismo sentido y misma banda: netear es sumar, y eso sí se permite.
  assert.equal(neteable(NME.whImportada, { ...NME.whImportada }), true);
});

// Bandas distintas tampoco: T1 contra T2 no se restan.
test("1c. bandas distintas no se netean", () => {
  const t2 = { ...NME.whImportadaT1, tou: "T2" };
  assert.equal(neteable(NME.whImportadaT1, t2), false);
});

// ── Caso 2 — volumen corregido vs sin corregir ─────────────────────────────
// Misma magnitud, misma unidad, mismo período. Distinta condición de medición:
// Vb tiene corrección metrológica PTZ y Vm no. Es el bug que produjo
// `volumenGasTotal`.
test("2. Vb y Vm NO son sumables", () => {
  assert.equal(
    sumable(NUC.correctedParcializado, NUC.uncorrectedParcializado),
    false,
  );
  assert.equal(NUC.correctedParcializado.condicionMedicion, "corregidaPTZ");
  assert.equal(NUC.uncorrectedParcializado.condicionMedicion, "medida");
});

// ── Caso 3 — odómetro ──────────────────────────────────────────────────────
test("3. el volumen totalizado es odómetro: last, y no se suma ni consigo mismo", () => {
  assert.equal(aggDe(NUC.correctedTotalizado), "last");
  assert.equal(
    sumable(NUC.correctedTotalizado, NUC.correctedTotalizado),
    false,
    "sumar dos lecturas de un odómetro no significa nada",
  );
});

// ── Caso 4 — demanda máxima ────────────────────────────────────────────────
// Es el extremo alcanzado DENTRO del intervalo, y la variable de facturación de
// electricidad. Se agrega con max; sumarla inventa un pico que nunca existió.
test("4. la demanda máxima se agrega con max, nunca con sum", () => {
  assert.equal(NME.demandaMaxImportadaW.accumulation, "extremoIntervalo");
  assert.equal(aggDe(NME.demandaMaxImportadaW), "max");
  assert.equal(
    sumable(NME.demandaMaxImportadaW, NME.demandaMaxImportadaW),
    false,
  );
});

// ── Caso 5 — banda tarifaria contra total ──────────────────────────────────
test("5. una banda tarifaria no se suma con su total (doble conteo)", () => {
  assert.equal(sumable(NME.whImportadaT1, NME.whImportada), false);
  assert.equal(sumable(NME.whImportada, NME.whImportadaT1), false, "simétrico");
  assert.equal(
    NME.whImportadaT1.particion.esParteDe,
    "registromedidorelectricos/NME#whImportada",
  );
  assert.equal(
    NME.whImportadaT1.particion.sumanAlTotal,
    true,
    "las bandas SÍ suman al total; lo que no se puede es mezclar una banda con el total",
  );
});

// ── Caso 6 — puntos con rol de red distinto ────────────────────────────────
// Descriptores idénticos y sin embargo no agregables: es el promedio de
// 39.083 m³/día contra una mediana de 1.621.
test("6. dos puntos con rol de red distinto no son agregables", () => {
  const cityGate = {
    rolesRed: ["FUENTE"],
    nivelRed: { commodity: "gas", codigo: "ALTA", orden: 2 },
  };
  const comercio = {
    rolesRed: ["CONSUMO"],
    nivelRed: { commodity: "gas", codigo: "ALTA", orden: 2 },
  };
  assert.equal(mismoGrupoDeAgregacion(cityGate, comercio), false);

  const otroComercio = {
    rolesRed: ["CONSUMO"],
    nivelRed: { commodity: "gas", codigo: "ALTA", orden: 2 },
  };
  assert.equal(mismoGrupoDeAgregacion(comercio, otroComercio), true);
});

// ── Retrocompatibilidad ────────────────────────────────────────────────────
// El estado actual de los 4.467 puntos en producción es "sin clasificación".
// Mientras nadie esté clasificado, ninguna agregación nueva se habilita: "no sé"
// nunca autoriza. Es lo que permite desplegar esto sin cambiar ningún número.
test("retrocompat: sin clasificación no se autoriza ninguna agregación", () => {
  assert.equal(mismoGrupoDeAgregacion(undefined, undefined), false);
  assert.equal(mismoGrupoDeAgregacion({ rolesRed: ["CONSUMO"] }, undefined), false);
  assert.equal(
    mismoGrupoDeAgregacion({ rolesRed: ["CONSUMO"] }, { rolesRed: ["CONSUMO"] }),
    false,
    "sin nivel de red tampoco alcanza",
  );
});

// Nada en este PR está emitido a un consumidor: el gate de verdad es que un canal
// no entendido no se publica.
test("retrocompat: un canal sin semántica confiable no se emite", () => {
  assert.equal(
    NUC.bateria.emitido,
    false,
    "la batería de correctora es passthrough crudo y su escala depende de la marca",
  );
  assert.equal(sumable(NUC.bateria, NUC.bateria), false, "emitido:false nunca agrega");
});

// ── Invariantes del catálogo ───────────────────────────────────────────────
test("invariante: dominio dispositivo o ambiente ⇒ commodity 'na'", () => {
  for (const perfil of CATALOGO_CANALES) {
    for (const [campo, d] of Object.entries(perfil.campos ?? {})) {
      if (d.dominio === "dispositivo" || d.dominio === "ambiente") {
        assert.equal(
          d.commodity,
          "na",
          `${perfil.clave}#${campo}: dominio ${d.dominio} no puede tener commodity ${d.commodity}`,
        );
      } else {
        assert.notEqual(
          d.commodity,
          "na",
          `${perfil.clave}#${campo}: dominio proceso exige commodity`,
        );
      }
    }
  }
});

test("invariante: todo alias apunta a un canal que existe en el catálogo", () => {
  for (const perfil of CATALOGO_CANALES) {
    for (const [campo, d] of Object.entries(perfil.campos ?? {})) {
      if (d.aliasDe) {
        assert.ok(
          descriptorDe(d.aliasDe),
          `${perfil.clave}#${campo}: aliasDe apunta a ${d.aliasDe}, que no está en el catálogo`,
        );
      }
      if (d.particion?.esParteDe) {
        assert.ok(
          descriptorDe(d.particion.esParteDe),
          `${perfil.clave}#${campo}: esParteDe apunta a ${d.particion.esParteDe}, que no está en el catálogo`,
        );
      }
    }
  }
});

test("invariante: unidad distinta ⇒ nunca sumable (kWh vs Wh es factor 1000)", () => {
  assert.equal(sumable(NME.whImportada, NME.kwhImportada), false);
  assert.equal(NME.kwhImportada.aliasDe, "registromedidorelectricos/NME#whImportada");
});

test("invariante: la reactiva no se suma con la activa", () => {
  assert.equal(sumable(NME.whImportada, NME.varhImportada), false);
});

// ── CanalRef ───────────────────────────────────────────────────────────────
test("canalRef: ida y vuelta", () => {
  const ref = canalRef("registros", "NUC", "presion");
  assert.equal(ref, "registros/NUC#presion");
  assert.deepEqual(parseCanalRef(ref), {
    origen: "registros",
    perfil: "NUC",
    selector: "presion",
  });
  // Selector de forma angosta (SCADA): el tag lleva guiones bajos y no rompe.
  assert.deepEqual(
    parseCanalRef("reportes/SCADA#tag:AND_ESQ_ERP_BOLSON_UC_PE"),
    {
      origen: "reportes",
      perfil: "SCADA",
      selector: "tag:AND_ESQ_ERP_BOLSON_UC_PE",
    },
  );
  // Perfil con marca de correctora.
  assert.equal(parseCanalRef("registros/NUC:Corus#bateria").perfil, "NUC:Corus");
});

test("canalRef: entradas mal formadas devuelven null", () => {
  for (const malo of ["", "registros", "registros/NUC", "#presion", "/NUC#p", "registros/#p", "registros/NUC#"]) {
    assert.equal(parseCanalRef(malo), null, `debería ser null: ${JSON.stringify(malo)}`);
  }
});

test("descriptorDe resuelve el catálogo y devuelve undefined para lo no cubierto", () => {
  assert.equal(descriptorDe("registros/NUC#presion").quantityKind, "presion");
  assert.equal(descriptorDe("registros/NUC#noExiste"), undefined);
  assert.equal(descriptorDe("reportes/SML#valores.consumo"), undefined, "SML no está en el slice");
});
