// Pruebas de integración de la API: se ejecutan contra una base de datos de prueba.
// Uso: DATABASE_URL=<base de pruebas> JWT_SECRET=prueba npm test
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import request from 'supertest';
import app from '../src/app.js';
import { pool } from '../src/db/pool.js';

const correo = `prueba${Date.now()}@correo.com`;
let token;
let tokenOtro;
let idEmp;

const emprendimiento = {
  nombre: 'Arepas de la Torre 3',
  descripcion: 'Arepas rellenas hechas en casa, pedidos con un día de anticipación.',
  categoria: 'Alimentos',
  horario: 'Lunes a sábado',
  whatsapp: '57 300 123 4567',
};

before(async () => {
  await pool.query(await readFile(new URL('../src/db/schema.sql', import.meta.url), 'utf8'));
});
after(async () => {
  await pool.query("delete from a4_emprendedores where email like 'prueba%@correo.com' or email like 'otro%@correo.com'");
  await pool.end();
});

test('health responde con la base conectada', async () => {
  const r = await request(app).get('/api/health');
  assert.equal(r.status, 200);
  assert.equal(r.body.baseDeDatos, 'conectada');
});

test('registro rechaza datos inválidos y devuelve el detalle por campo', async () => {
  const r = await request(app).post('/api/auth/registro').send({ nombre: 'A', email: 'malo', password: '123', aceptaTerminos: false });
  assert.equal(r.status, 400);
  assert.ok(r.body.error.detalles.email);
  assert.ok(r.body.error.detalles.aceptaTerminos);
});

test('registro crea la cuenta y devuelve un token', async () => {
  const r = await request(app).post('/api/auth/registro').send({ nombre: 'Luisa', email: correo, password: 'clave-segura-1', aceptaTerminos: true });
  assert.equal(r.status, 201);
  assert.ok(r.body.token);
  token = r.body.token;
});

test('no permite registrar dos veces el mismo correo', async () => {
  const r = await request(app).post('/api/auth/registro').send({ nombre: 'Luisa', email: correo, password: 'clave-segura-1', aceptaTerminos: true });
  assert.equal(r.status, 409);
});

test('login con contraseña equivocada devuelve 401', async () => {
  const r = await request(app).post('/api/auth/login').send({ email: correo, password: 'otra-clave' });
  assert.equal(r.status, 401);
});

test('crear emprendimiento exige sesión', async () => {
  const r = await request(app).post('/api/emprendimientos').send(emprendimiento);
  assert.equal(r.status, 401);
});

test('el emprendedor crea un emprendimiento y queda visible al público', async () => {
  const r = await request(app).post('/api/emprendimientos').set('Authorization', `Bearer ${token}`).send(emprendimiento);
  assert.equal(r.status, 201);
  idEmp = r.body.id;

  const lista = await request(app).get('/api/emprendimientos').query({ q: 'arepas', categoria: 'Alimentos' });
  assert.equal(lista.status, 200);
  assert.ok(lista.body.datos.some((e) => e.id === idEmp));
  assert.equal(lista.body.datos.find((e) => e.id === idEmp).whatsapp, '573001234567');
});

test('otro emprendedor no puede editar ni borrar lo ajeno', async () => {
  const r = await request(app).post('/api/auth/registro').send({ nombre: 'Otro', email: `otro${Date.now()}@correo.com`, password: 'clave-segura-2', aceptaTerminos: true });
  tokenOtro = r.body.token;
  const edit = await request(app).put(`/api/emprendimientos/${idEmp}`).set('Authorization', `Bearer ${tokenOtro}`).send(emprendimiento);
  assert.equal(edit.status, 404);
  const del = await request(app).delete(`/api/emprendimientos/${idEmp}`).set('Authorization', `Bearer ${tokenOtro}`);
  assert.equal(del.status, 404);
});

test('el dueño edita y luego elimina su emprendimiento', async () => {
  const edit = await request(app).put(`/api/emprendimientos/${idEmp}`).set('Authorization', `Bearer ${token}`).send({ ...emprendimiento, horario: 'Todos los días' });
  assert.equal(edit.status, 200);
  const det = await request(app).get(`/api/emprendimientos/${idEmp}`);
  assert.equal(det.body.dato.horario, 'Todos los días');
  const del = await request(app).delete(`/api/emprendimientos/${idEmp}`).set('Authorization', `Bearer ${token}`);
  assert.equal(del.status, 204);
  const det2 = await request(app).get(`/api/emprendimientos/${idEmp}`);
  assert.equal(det2.status, 404);
});

test('rutas inexistentes e ids mal formados responden 404 con formato de error', async () => {
  const a = await request(app).get('/api/no-existe');
  assert.equal(a.status, 404);
  assert.ok(a.body.error.mensaje);
  const b = await request(app).get('/api/emprendimientos/123');
  assert.equal(b.status, 404);
});

test('la especificación OpenAPI está disponible para Swagger', async () => {
  const r = await request(app).get('/api/openapi.json');
  assert.equal(r.status, 200);
  assert.equal(r.body.openapi, '3.0.3');
});
