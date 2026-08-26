/**
 * El ciclo de facturación: los bordes que hay que no equivocar.
 *
 * Mismo runner nativo que `predicados.test.mjs` (`node --test`, cero dependencias) y
 * contra `dist/`, que es lo que consumen los servicios.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const m = require("../dist/index.js");

const {
  periodoFacturacion,
  periodoDeFecha,
  periodosFacturacion,
  esDiaCierreValido,
  DIA_CIERRE_MIN,
  DIA_CIERRE_MAX,
} = m;

test("el período se rotula por el mes de cierre y arranca en el mes anterior", () => {
  const p = periodoFacturacion(5, 2026, 8);
  assert.deepEqual(p.inicio, { anio: 2026, mes: 7, dia: 5 });
  assert.deepEqual(p.fin, { anio: 2026, mes: 8, dia: 5 });
  assert.equal(p.label, "Agosto 2026");
});

test("el período de enero cruza el año hacia atrás", () => {
  const p = periodoFacturacion(10, 2026, 1);
  assert.deepEqual(p.inicio, { anio: 2025, mes: 12, dia: 10 });
  assert.deepEqual(p.fin, { anio: 2026, mes: 1, dia: 10 });
  assert.equal(p.label, "Enero 2026");
});

test("períodos consecutivos no se solapan ni dejan huecos: el fin de uno es el inicio del siguiente", () => {
  const agosto = periodoFacturacion(5, 2026, 8);
  const septiembre = periodoFacturacion(5, 2026, 9);
  assert.deepEqual(agosto.fin, septiembre.inicio);
});

test("el día de cierre cae en el período SIGUIENTE (el borde es exclusive)", () => {
  // Con cierre el 5: el 4 de agosto todavía es "Agosto"; el 5 ya es "Septiembre".
  assert.equal(periodoDeFecha(5, { anio: 2026, mes: 8, dia: 4 }).label, "Agosto 2026");
  assert.equal(
    periodoDeFecha(5, { anio: 2026, mes: 8, dia: 5 }).label,
    "Septiembre 2026",
  );
});

test("periodoDeFecha cruza el año en diciembre", () => {
  const p = periodoDeFecha(20, { anio: 2026, mes: 12, dia: 25 });
  assert.equal(p.label, "Enero 2027");
  assert.deepEqual(p.inicio, { anio: 2026, mes: 12, dia: 20 });
});

test("una fecha cae siempre en el período que la contiene, para todo día de cierre", () => {
  // Barrido: para cada cierre válido y cada día de un mes de 31, el período que
  // periodoDeFecha devuelve tiene que contener la fecha en [inicio, fin).
  const comparable = (f) => f.anio * 10000 + f.mes * 100 + f.dia;
  for (let cierre = DIA_CIERRE_MIN; cierre <= DIA_CIERRE_MAX; cierre++) {
    for (let dia = 1; dia <= 31; dia++) {
      const fecha = { anio: 2026, mes: 3, dia };
      const p = periodoDeFecha(cierre, fecha);
      const f = comparable(fecha);
      assert.ok(
        comparable(p.inicio) <= f && f < comparable(p.fin),
        `cierre ${cierre}, día ${dia}: ${JSON.stringify(fecha)} fuera de ${JSON.stringify(p)}`,
      );
    }
  }
});

test("periodosFacturacion devuelve del más reciente al más viejo y cruza el año", () => {
  const ps = periodosFacturacion(5, 2026, 2, 4);
  assert.deepEqual(
    ps.map((p) => p.label),
    ["Febrero 2026", "Enero 2026", "Diciembre 2025", "Noviembre 2025"],
  );
});

test("periodosFacturacion encadena: cada período empieza donde termina el anterior", () => {
  const ps = periodosFacturacion(15, 2026, 6, 12);
  for (let i = 1; i < ps.length; i++) {
    assert.deepEqual(ps[i].fin, ps[i - 1].inicio);
  }
});

test("esDiaCierreValido rechaza lo que rompería el período", () => {
  assert.equal(esDiaCierreValido(1), true);
  assert.equal(esDiaCierreValido(28), true);
  // 29/30/31 no existen en todos los meses: el período quedaría sin definir en febrero.
  assert.equal(esDiaCierreValido(29), false);
  assert.equal(esDiaCierreValido(31), false);
  assert.equal(esDiaCierreValido(0), false);
  assert.equal(esDiaCierreValido(5.5), false);
  assert.equal(esDiaCierreValido("5"), false);
  assert.equal(esDiaCierreValido(undefined), false);
  assert.equal(esDiaCierreValido(null), false);
});

test("un día de cierre inválido tira, no devuelve un período mal calculado", () => {
  assert.throws(() => periodoFacturacion(31, 2026, 8), RangeError);
  assert.throws(() => periodoDeFecha(0, { anio: 2026, mes: 8, dia: 1 }), RangeError);
});
