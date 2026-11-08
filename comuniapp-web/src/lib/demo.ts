"use client";

import type { Backend } from "./api";
import type { Emprendimiento, Usuario } from "./types";

/**
 * Backend de demostración: guarda todo en el navegador (localStorage).
 * Solo se usa cuando no hay credenciales de Supabase configuradas.
 */

type UsuarioDemo = Usuario & { password: string; acepto_terminos_at: string };
const K_EMP = "comuniapp-demo-emprendimientos";
const K_USR = "comuniapp-demo-usuarios";
const K_SES = "comuniapp-demo-sesion";

const VECINA = "demo-vecina";
const ahora = () => new Date().toISOString();

const SEMILLA: Emprendimiento[] = [
  {
    id: "tamales-dona-marta", owner_id: VECINA, nombre: "Tamales Doña Marta", categoria: "Alimentos",
    descripcion: "Tamales tolimenses y lechona para fines de semana y festivos. Pedidos con un día de anticipación.",
    horario: "Sábados y domingos, 8:00 a. m. – 5:00 p. m.", whatsapp: "3001234567",
    foto_url: null, foto_path: null, created_at: "2026-10-01T10:00:00Z", updated_at: "2026-10-01T10:00:00Z",
  },
  {
    id: "mascotas-galet", owner_id: VECINA, nombre: "Mascotas Galet", categoria: "Mascotas",
    descripcion: "Alimento, arena, juguetes y accesorios para perros y gatos. Entrega en tu torre sin costo.",
    horario: "Lunes a sábado, 9:00 a. m. – 7:00 p. m.", whatsapp: "3109876543",
    foto_url: null, foto_path: null, created_at: "2026-10-02T10:00:00Z", updated_at: "2026-10-02T10:00:00Z",
  },
  {
    id: "postres-caseros", owner_id: VECINA, nombre: "Postres Caseros", categoria: "Alimentos",
    descripcion: "Tortas, brownies y postres de tres leches hechos en casa. Se reciben encargos para cumpleaños.",
    horario: "Martes a domingo, 10:00 a. m. – 6:00 p. m.", whatsapp: "3157654321",
    foto_url: null, foto_path: null, created_at: "2026-10-03T10:00:00Z", updated_at: "2026-10-03T10:00:00Z",
  },
  {
    id: "techfix", owner_id: VECINA, nombre: "TechFix", categoria: "Tecnología",
    descripcion: "Reparación de computadores y celulares, formateo e instalación de programas a domicilio.",
    horario: "Lunes a viernes, 6:00 p. m. – 9:00 p. m.", whatsapp: "3201112233",
    foto_url: null, foto_path: null, created_at: "2026-10-04T10:00:00Z", updated_at: "2026-10-04T10:00:00Z",
  },
  {
    id: "unas-by-caro", owner_id: VECINA, nombre: "Uñas by Caro", categoria: "Belleza",
    descripcion: "Manicure, pedicure y uñas en gel. Atención con cita previa en el apartamento.",
    horario: "Miércoles a sábado, 2:00 p. m. – 8:00 p. m.", whatsapp: "3014445566",
    foto_url: null, foto_path: null, created_at: "2026-10-05T10:00:00Z", updated_at: "2026-10-05T10:00:00Z",
  },
  {
    id: "arreglos-don-jorge", owner_id: VECINA, nombre: "Arreglos Don Jorge", categoria: "Hogar",
    descripcion: "Plomería, electricidad básica, instalación de repisas y pequeños arreglos en el apartamento.",
    horario: "Todos los días, 7:00 a. m. – 5:00 p. m.", whatsapp: "3187778899",
    foto_url: null, foto_path: null, created_at: "2026-10-06T10:00:00Z", updated_at: "2026-10-06T10:00:00Z",
  },
];

function leer<T>(k: string, def: T): T {
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : def;
  } catch {
    return def;
  }
}
function guardar(k: string, v: unknown) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {
    throw new Error("No se pudo guardar en el navegador (modo demostración).");
  }
}
const emps = () => leer<Emprendimiento[]>(K_EMP, SEMILLA);
const usuarios = () => leer<UsuarioDemo[]>(K_USR, []);
const listeners = new Set<(u: Usuario | null) => void>();
const avisar = (u: Usuario | null) => listeners.forEach((l) => l(u));

function sesion(): Usuario | null {
  const id = leer<string | null>(K_SES, null);
  const u = usuarios().find((x) => x.id === id);
  return u ? { id: u.id, email: u.email, nombre: u.nombre } : null;
}

const aDataUrl = (f: File) =>
  new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = () => rej(new Error("No se pudo leer la foto."));
    r.readAsDataURL(f);
  });

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export const demoBackend: Backend = {
  async listar({ categoria, q, ownerId, limite }) {
    let lista = [...emps()].sort((a, b) => b.created_at.localeCompare(a.created_at));
    if (categoria) lista = lista.filter((e) => e.categoria === categoria);
    if (ownerId) lista = lista.filter((e) => e.owner_id === ownerId);
    if (q && q.trim()) {
      const t = norm(q.trim());
      lista = lista.filter((e) => norm(e.nombre).includes(t) || norm(e.descripcion).includes(t));
    }
    return limite ? lista.slice(0, limite) : lista;
  },
  async obtener(id) {
    return emps().find((e) => e.id === id) ?? null;
  },
  async crear(datos, foto) {
    const u = sesion();
    if (!u) throw new Error("Debes iniciar sesión.");
    const nuevo: Emprendimiento = {
      ...datos, id: crypto.randomUUID(), owner_id: u.id,
      foto_url: foto ? await aDataUrl(foto) : null, foto_path: null, created_at: ahora(), updated_at: ahora(),
    };
    guardar(K_EMP, [nuevo, ...emps()]);
    return nuevo;
  },
  async actualizar(id, datos, foto, quitarFoto) {
    const u = sesion();
    const lista = emps();
    const i = lista.findIndex((e) => e.id === id);
    if (!u || i < 0 || lista[i].owner_id !== u.id) throw new Error("No tienes permiso para hacer este cambio.");
    const foto_url = foto ? await aDataUrl(foto) : quitarFoto ? null : lista[i].foto_url;
    lista[i] = { ...lista[i], ...datos, foto_url, updated_at: ahora() };
    guardar(K_EMP, lista);
  },
  async eliminar(id) {
    const u = sesion();
    const lista = emps();
    const e = lista.find((x) => x.id === id);
    if (!u || !e || e.owner_id !== u.id) throw new Error("No tienes permiso para hacer este cambio.");
    guardar(K_EMP, lista.filter((x) => x.id !== id));
  },
  async registrar(nombre, email, password) {
    const lista = usuarios();
    if (lista.some((u) => u.email.toLowerCase() === email.toLowerCase()))
      throw new Error("Ya existe una cuenta con este correo.");
    if (password.length < 6) throw new Error("La contraseña debe tener al menos 6 caracteres.");
    const u: UsuarioDemo = { id: crypto.randomUUID(), email, nombre, password, acepto_terminos_at: ahora() };
    guardar(K_USR, [...lista, u]);
    guardar(K_SES, u.id);
    avisar(sesion());
    return { necesitaConfirmar: false };
  },
  async ingresar(email, password) {
    const u = usuarios().find((x) => x.email.toLowerCase() === email.toLowerCase() && x.password === password);
    if (!u) throw new Error("Correo o contraseña incorrectos.");
    guardar(K_SES, u.id);
    avisar(sesion());
  },
  async salir() {
    guardar(K_SES, null);
    avisar(null);
  },
  async usuarioActual() {
    return sesion();
  },
  alCambiarSesion(cb) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
};
