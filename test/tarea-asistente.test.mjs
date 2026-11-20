import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const m = require("../dist/index.js");

const HASTA = "2026-11-21T21:00:00.000Z"; // 21/11 18:00 en Argentina
const ORIGEN = { canal: "web" };
const VAR = { fuente: "scada", id: "s1" };

const pedido = (o) => m.PedidoTareaAsistenteSchema.safeParse({ hasta: HASTA, origen: ORIGEN, ...o });
const errores = (r) => (r.success ? [] : r.error.issues.map((i) => i.message));

test("pedido: cada tipo lleva su regla y sólo la suya", () => {
  assert.ok(pedido({ tipo: "umbral", variable: VAR, umbral: { operador: "menor", valor: 1.2, repetir: "unaVez" } }).success);
  assert.ok(pedido({ tipo: "reporte", variable: VAR, reporte: { cadaMin: 30 } }).success);
  assert.ok(pedido({ tipo: "consulta", consulta: { pregunta: "Resumime las alertas", horas: ["07:00"] } }).success);

  assert.deepEqual(errores(pedido({ tipo: "umbral", variable: VAR })), ["umbral requiere umbral"]);
  assert.deepEqual(errores(pedido({ tipo: "reporte", reporte: { cadaMin: 30 } })), ["reporte requiere variable"]);
  assert.deepEqual(
    errores(pedido({ tipo: "consulta", variable: VAR, consulta: { pregunta: "Resumime", cadaMin: 60 } })),
    ["consulta no lleva variable"],
  );
  assert.deepEqual(
    errores(pedido({ tipo: "reporte", variable: VAR, reporte: { cadaMin: 30 }, umbral: { operador: "mayor", valor: 1, repetir: "unaVez" } })),
    ["reporte no lleva umbral"],
  );
});

test("umbral: fueraDe con banda, los demás sin valor2; enfriamiento sólo con cadaCruce", () => {
  const u = (umbral) => pedido({ tipo: "umbral", variable: VAR, umbral });
  assert.ok(u({ operador: "fueraDe", valor: 1, valor2: 2, repetir: "cadaCruce", enfriamientoMin: 30 }).success);
  assert.equal(u({ operador: "fueraDe", valor: 2, valor2: 2, repetir: "unaVez" }).success, false);
  assert.equal(u({ operador: "fueraDe", valor: 1, repetir: "unaVez" }).success, false);
  assert.equal(u({ operador: "mayor", valor: 1, valor2: 2, repetir: "unaVez" }).success, false);
  assert.equal(u({ operador: "mayor", valor: 1, repetir: "unaVez", enfriamientoMin: 10 }).success, false);
  assert.equal(u({ operador: "mayor", valor: 1, repetir: "unaVez", histeresis: -1 }).success, false);
});

test("consulta: cadaMin u horas, una de las dos; horas HH:mm sin repetir", () => {
  const c = (consulta) => pedido({ tipo: "consulta", consulta: { pregunta: "Resumime las alertas", ...consulta } });
  assert.ok(c({ cadaMin: 60 }).success);
  assert.ok(c({ horas: ["07:00", "19:30"] }).success);
  assert.equal(c({}).success, false);
  assert.equal(c({ cadaMin: 60, horas: ["07:00"] }).success, false);
  assert.equal(c({ horas: ["7:00"] }).success, false);
  assert.equal(c({ horas: ["24:00"] }).success, false);
  assert.equal(c({ horas: ["07:00", "07:00"] }).success, false);
  assert.equal(c({ pregunta: "x".repeat(501), cadaMin: 60 }).success, false);
});

test("hasta: ISO con zona", () => {
  assert.equal(pedido({ tipo: "reporte", variable: VAR, reporte: { cadaMin: 5 }, hasta: "mañana" }).success, false);
  assert.ok(pedido({ tipo: "reporte", variable: VAR, reporte: { cadaMin: 5 }, hasta: "2026-11-21T18:00:00-03:00" }).success);
});

test("vigencia: posterior y hasta 48 h", () => {
  const d = "2026-11-20T12:00:00.000Z";
  assert.ok(m.vigenciaTareaAsistenteValida(d, "2026-11-22T12:00:00.000Z"));
  assert.equal(m.vigenciaTareaAsistenteValida(d, "2026-11-22T12:00:00.001Z"), false);
  assert.equal(m.vigenciaTareaAsistenteValida(d, d), false);
  assert.equal(m.vigenciaTareaAsistenteValida(d, "x"), false);
});

test("separación entre horas, contando la medianoche", () => {
  assert.equal(m.menorSeparacionHorasMin(["07:00"]), 1440);
  assert.equal(m.menorSeparacionHorasMin(["07:00", "19:00"]), 720);
  assert.equal(m.menorSeparacionHorasMin(["23:30", "00:15"]), 45);
  assert.equal(m.menorSeparacionHorasMin(["08:00", "07:00", "12:00"]), 60);
});

test("intervalo efectivo: usuario, si no cliente, si no 60", () => {
  const cli = { config: { asistente: { intervaloConsultaMin: 120 } } };
  assert.equal(m.intervaloConsultaEfectivoMin({ intervaloConsultaMin: 30 }, cli), 30);
  assert.equal(m.intervaloConsultaEfectivoMin({}, cli), 120);
  assert.equal(m.intervaloConsultaEfectivoMin(undefined, undefined), 60);
  assert.equal(m.intervaloConsultaEfectivoMin({ intervaloConsultaMin: null }, { config: null }), 60);

  assert.ok(m.consultaRespetaIntervalo({ pregunta: "x", cadaMin: 60 }, 60));
  assert.equal(m.consultaRespetaIntervalo({ pregunta: "x", cadaMin: 59 }, 60), false);
  assert.ok(m.consultaRespetaIntervalo({ pregunta: "x", horas: ["07:00", "19:00"] }, 60));
  assert.equal(m.consultaRespetaIntervalo({ pregunta: "x", horas: ["23:30", "00:15"] }, 60), false);
});

test("descripción armada por código, en hora de Argentina y coma decimal", () => {
  const variable = { nombre: "ERP Tandil · PS", unidad: "bar" };
  assert.equal(
    m.describirTareaAsistente({ tipo: "umbral", hasta: HASTA, variable, umbral: { operador: "menor", valor: 1.2, repetir: "unaVez" } }),
    "Avisar si «ERP Tandil · PS» baja de 1,2 bar (una vez), hasta el 21/11 18:00",
  );
  assert.equal(
    m.describirTareaAsistente({ tipo: "umbral", hasta: HASTA, variable, umbral: { operador: "fueraDe", valor: 1, valor2: 2.5, repetir: "cadaCruce" } }),
    "Avisar si «ERP Tandil · PS» sale de 1 bar a 2,5 bar (cada vez que pase), hasta el 21/11 18:00",
  );
  assert.equal(
    m.describirTareaAsistente({ tipo: "reporte", hasta: HASTA, variable, reporte: { cadaMin: 30 } }),
    "Mandar «ERP Tandil · PS» cada 30 min, hasta el 21/11 18:00",
  );
  assert.equal(
    m.describirTareaAsistente({ tipo: "consulta", hasta: HASTA, consulta: { pregunta: "Resumime las alertas", horas: ["19:00", "07:00"] } }),
    "Responder «Resumime las alertas» a las 07:00 y 19:00, hasta el 21/11 18:00",
  );
});

test("la consulta acepta el aviso de una tarea y sigue valiendo sin él", () => {
  const base = { idCliente: "c", idUsuario: "u", idConversacion: "k", pregunta: "¿?", resultado: "ok" };
  assert.ok(m.ConsultaAsistenteSchema.safeParse(base).success);
  const aviso = { origen: "tarea", tarea: { idTarea: "t", evento: "cruce", valores: [{ valor: 1.1, unidad: "bar", fechaDato: HASTA }] } };
  assert.ok(m.CreateConsultaAsistenteSchema.safeParse({ ...base, ...aviso }).success);
  assert.equal(m.ConsultaAsistenteSchema.safeParse({ ...base, ...aviso, tarea: { idTarea: "t", evento: "otro" } }).success, false);
});
