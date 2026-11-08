"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Emprendimiento } from "@/lib/types";
import { Aviso, Cargando, Confirmacion, EtiquetaCategoria, FotoEmprendimiento } from "@/components/ui";
import { useRequiereSesion } from "@/components/AuthProvider";

export default function Panel() {
  const { usuario, cargando } = useRequiereSesion();
  const [lista, setLista] = useState<Emprendimiento[] | null>(null);
  const [error, setError] = useState("");
  const [aEliminar, setAEliminar] = useState<Emprendimiento | null>(null);
  const [eliminando, setEliminando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const cargar = useCallback(() => {
    if (!usuario) return;
    api.listar({ ownerId: usuario.id }).then(setLista).catch((e: Error) => setError(e.message));
  }, [usuario]);

  useEffect(cargar, [cargar]);

  if (cargando || !usuario) return <Cargando />;

  async function confirmarEliminar() {
    if (!aEliminar) return;
    setEliminando(true);
    try {
      await api.eliminar(aEliminar.id);
      setMensaje(`“${aEliminar.nombre}” se eliminó.`);
      setAEliminar(null);
      cargar();
    } catch (e) {
      setError((e as Error).message);
      setAEliminar(null);
    } finally {
      setEliminando(false);
    }
  }

  return (
    <div className="contenedor py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-lg text-texto-suave">Hola, {usuario.nombre || "emprendedor"} 👋</p>
          <h1 className="text-3xl font-extrabold">Mis emprendimientos</h1>
        </div>
        <Link href="/panel/nuevo" className="btn-primario !text-lg">+ Crear emprendimiento</Link>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {mensaje && <Aviso tipo="ok">{mensaje}</Aviso>}
        {error && <Aviso>{error}</Aviso>}
        {!lista && !error && <Cargando />}
        {lista && lista.length === 0 && (
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-verde-50 px-6 py-12 text-center ring-1 ring-verde-100">
            <span className="text-5xl" aria-hidden="true">🏪</span>
            <p className="text-xl font-bold">Aún no has publicado emprendimientos</p>
            <p className="text-texto-suave">Crea el primero para que tus vecinos te encuentren.</p>
            <Link href="/panel/nuevo" className="btn-primario">+ Crear emprendimiento</Link>
          </div>
        )}
        {lista && lista.length > 0 && (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {lista.map((e) => (
              <li key={e.id} className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-verde-100">
                <Link href={`/emprendimiento/${e.id}`} aria-label={`Ver perfil de ${e.nombre}`}>
                  <FotoEmprendimiento e={e} className="h-40 w-full" />
                </Link>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <EtiquetaCategoria c={e.categoria} />
                  <h2 className="text-lg font-bold">{e.nombre}</h2>
                  <div className="mt-auto grid grid-cols-2 gap-2 pt-2">
                    <Link href={`/panel/editar/${e.id}`} className="btn-secundario !px-3">✏️ Editar</Link>
                    <button type="button" onClick={() => { setMensaje(""); setAEliminar(e); }}
                      className="btn-secundario !px-3 !text-red-700 !ring-red-200 hover:!bg-red-50">
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Confirmacion
        abierta={!!aEliminar}
        titulo="¿Eliminar este emprendimiento?"
        mensaje={`“${aEliminar?.nombre ?? ""}” dejará de aparecer en ComuniApp. Esta acción no se puede deshacer.`}
        textoConfirmar="Sí, eliminar"
        ocupado={eliminando}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setAEliminar(null)}
      />
    </div>
  );
}
