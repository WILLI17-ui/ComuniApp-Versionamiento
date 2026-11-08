"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Categoria, Emprendimiento, EmprendimientoInput, Usuario } from "./types";
import { demoBackend } from "./demo";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Si no hay credenciales de Supabase, la app funciona en modo demostración (datos en el navegador). */
export const MODO_DEMO = !URL || !KEY;

export type Filtros = { categoria?: Categoria | null; q?: string | null; ownerId?: string; limite?: number };

export type Backend = {
  listar(f: Filtros): Promise<Emprendimiento[]>;
  obtener(id: string): Promise<Emprendimiento | null>;
  crear(datos: EmprendimientoInput, foto: File | null): Promise<Emprendimiento>;
  actualizar(id: string, datos: EmprendimientoInput, foto: File | null, quitarFoto: boolean): Promise<void>;
  eliminar(id: string): Promise<void>;
  registrar(nombre: string, email: string, password: string): Promise<{ necesitaConfirmar: boolean }>;
  ingresar(email: string, password: string): Promise<void>;
  salir(): Promise<void>;
  usuarioActual(): Promise<Usuario | null>;
  alCambiarSesion(cb: (u: Usuario | null) => void): () => void;
};

/** Quita caracteres que romperían el filtro de búsqueda de PostgREST. */
export function limpiarBusqueda(q: string) {
  return q.replace(/[%,()*\\]/g, " ").trim();
}

let cliente: SupabaseClient | null = null;
function sb() {
  if (!cliente) cliente = createClient(URL!, KEY!);
  return cliente;
}

function aUsuario(u: { id: string; email?: string; user_metadata?: Record<string, unknown> } | null): Usuario | null {
  if (!u) return null;
  return { id: u.id, email: u.email ?? "", nombre: String(u.user_metadata?.nombre ?? "") };
}

function traducirError(mensaje: string): string {
  const m = mensaje.toLowerCase();
  if (m.includes("invalid login credentials")) return "Correo o contraseña incorrectos.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "Ya existe una cuenta con este correo.";
  if (m.includes("password should be at least")) return "La contraseña debe tener al menos 6 caracteres.";
  if (m.includes("invalid") && m.includes("email")) return "El correo no tiene un formato válido.";
  if (m.includes("row-level security") || m.includes("permission"))
    return "No tienes permiso para hacer este cambio.";
  if (m.includes("payload too large") || m.includes("maximum allowed size"))
    return "La foto pesa más de 2 MB.";
  if (m.includes("mime type")) return "La foto debe ser JPG o PNG.";
  return "Ocurrió un error. Inténtalo de nuevo.";
}

async function subirFoto(userId: string, foto: File) {
  const ext = foto.type === "image/png" ? "png" : "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await sb().storage.from("fotos").upload(path, foto, { contentType: foto.type });
  if (error) throw new Error(traducirError(error.message));
  const { data } = sb().storage.from("fotos").getPublicUrl(path);
  return { foto_path: path, foto_url: data.publicUrl };
}

const supabaseBackend: Backend = {
  async listar({ categoria, q, ownerId, limite }) {
    let query = sb().from("emprendimientos").select("*").order("created_at", { ascending: false });
    if (categoria) query = query.eq("categoria", categoria);
    if (ownerId) query = query.eq("owner_id", ownerId);
    const texto = q ? limpiarBusqueda(q) : "";
    if (texto) query = query.or(`nombre.ilike.%${texto}%,descripcion.ilike.%${texto}%`);
    if (limite) query = query.limit(limite);
    const { data, error } = await query;
    if (error) throw new Error(traducirError(error.message));
    return (data ?? []) as Emprendimiento[];
  },
  async obtener(id) {
    const { data, error } = await sb().from("emprendimientos").select("*").eq("id", id).maybeSingle();
    if (error) return null;
    return (data as Emprendimiento) ?? null;
  },
  async crear(datos, foto) {
    const u = await this.usuarioActual();
    if (!u) throw new Error("Debes iniciar sesión.");
    const extra = foto ? await subirFoto(u.id, foto) : { foto_path: null, foto_url: null };
    const { data, error } = await sb()
      .from("emprendimientos")
      .insert({ ...datos, ...extra, owner_id: u.id })
      .select()
      .single();
    if (error) throw new Error(traducirError(error.message));
    return data as Emprendimiento;
  },
  async actualizar(id, datos, foto, quitarFoto) {
    const u = await this.usuarioActual();
    if (!u) throw new Error("Debes iniciar sesión.");
    const actual = await this.obtener(id);
    if (!actual || actual.owner_id !== u.id) throw new Error("No tienes permiso para hacer este cambio.");
    let cambiosFoto = {};
    if (foto) cambiosFoto = await subirFoto(u.id, foto);
    else if (quitarFoto) cambiosFoto = { foto_path: null, foto_url: null };
    const { error } = await sb().from("emprendimientos").update({ ...datos, ...cambiosFoto }).eq("id", id);
    if (error) throw new Error(traducirError(error.message));
    if ((foto || quitarFoto) && actual.foto_path) await sb().storage.from("fotos").remove([actual.foto_path]);
  },
  async eliminar(id) {
    const u = await this.usuarioActual();
    const actual = await this.obtener(id);
    if (!u || !actual || actual.owner_id !== u.id) throw new Error("No tienes permiso para hacer este cambio.");
    const { error } = await sb().from("emprendimientos").delete().eq("id", id);
    if (error) throw new Error(traducirError(error.message));
    if (actual.foto_path) await sb().storage.from("fotos").remove([actual.foto_path]);
  },
  async registrar(nombre, email, password) {
    const { data, error } = await sb().auth.signUp({
      email,
      password,
      options: { data: { nombre, acepto_terminos_at: new Date().toISOString() } },
    });
    if (error) throw new Error(traducirError(error.message));
    // Supabase no devuelve error si el correo ya existe y la confirmación está activa: identities viene vacío
    if (data.user && data.user.identities && data.user.identities.length === 0)
      throw new Error("Ya existe una cuenta con este correo.");
    return { necesitaConfirmar: !data.session };
  },
  async ingresar(email, password) {
    const { error } = await sb().auth.signInWithPassword({ email, password });
    if (error) throw new Error("Correo o contraseña incorrectos.");
  },
  async salir() {
    await sb().auth.signOut();
  },
  async usuarioActual() {
    const { data } = await sb().auth.getSession();
    return aUsuario(data.session?.user ?? null);
  },
  alCambiarSesion(cb) {
    const { data } = sb().auth.onAuthStateChange((_e, session) => cb(aUsuario(session?.user ?? null)));
    return () => data.subscription.unsubscribe();
  },
};

export const api: Backend = MODO_DEMO ? demoBackend : supabaseBackend;
