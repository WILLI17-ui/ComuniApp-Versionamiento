"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { CATEGORIA_INFO, type Categoria, type Emprendimiento } from "@/lib/types";

export function LogoIcono({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="#1E7A4C" />
      <path
        d="M20 13H44A8 8 0 0 1 52 21V35A8 8 0 0 1 44 43H30L18 53L20.5 43H20A8 8 0 0 1 12 35V21A8 8 0 0 1 20 13Z"
        fill="#FFFFFF"
      />
      <path d="M21 29.5L32 19.5L43 29.5Z" fill="#1E7A4C" />
      <rect x="25" y="28" width="14" height="10" rx="1.5" fill="#1E7A4C" />
      <rect x="30" y="31.5" width="4" height="6.5" rx="1" fill="#8FD6A2" />
    </svg>
  );
}

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <span className="flex items-center gap-2">
      <LogoIcono size={size} />
      <span className="text-2xl font-extrabold tracking-tight">
        <span className="text-verde-700">Comuni</span>
        <span className="text-verde-500">App</span>
      </span>
    </span>
  );
}

/** Imagen del emprendimiento o, si no tiene foto, una imagen por defecto según la categoría (HU05, HU11). */
export function FotoEmprendimiento({ e, className = "" }: { e: Emprendimiento; className?: string }) {
  const info = CATEGORIA_INFO[e.categoria];
  if (e.foto_url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={e.foto_url} alt={`Foto de ${e.nombre}`} className={`object-cover ${className}`} />;
  }
  return (
    <div
      className={`flex flex-col items-center justify-center gap-1 ${className}`}
      style={{ background: info.fondo }}
      role="img"
      aria-label={`${e.nombre} (sin foto)`}
    >
      <span className="text-5xl" aria-hidden="true">{info.icono}</span>
      <span className="text-sm font-medium text-texto-suave">Sin foto</span>
    </div>
  );
}

export function EtiquetaCategoria({ c }: { c: Categoria }) {
  return (
    <span className="inline-flex w-fit items-center gap-1 rounded-full bg-verde-50 px-3 py-1 text-sm font-semibold text-verde-800 ring-1 ring-verde-200">
      <span aria-hidden="true">{CATEGORIA_INFO[c].icono}</span> {c}
    </span>
  );
}

export function TarjetaEmprendimiento({ e }: { e: Emprendimiento }) {
  return (
    <Link
      href={`/emprendimiento/${e.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-verde-100 transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-3 focus-visible:outline-verde-600"
    >
      <FotoEmprendimiento e={e} className="h-44 w-full" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <EtiquetaCategoria c={e.categoria} />
        <h3 className="text-lg font-bold text-texto group-hover:text-verde-700">{e.nombre}</h3>
        <p className="line-clamp-2 text-base text-texto-suave">{e.descripcion}</p>
        <span className="mt-auto pt-2 text-base font-semibold text-verde-700">Ver perfil →</span>
      </div>
    </Link>
  );
}

export function Cargando({ texto = "Cargando..." }: { texto?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-lg text-texto-suave" role="status">
      <span className="h-6 w-6 animate-spin rounded-full border-4 border-verde-200 border-t-verde-600" />
      {texto}
    </div>
  );
}

export function Aviso({ tipo = "error", children }: { tipo?: "error" | "ok" | "info"; children: React.ReactNode }) {
  const estilos = {
    error: "bg-red-50 text-red-800 ring-red-200",
    ok: "bg-verde-50 text-verde-800 ring-verde-200",
    info: "bg-amber-50 text-amber-900 ring-amber-200",
  }[tipo];
  return (
    <div role={tipo === "error" ? "alert" : "status"} className={`rounded-xl px-4 py-3 text-base ring-1 ${estilos}`}>
      {children}
    </div>
  );
}

/** Ventana de confirmación accesible (HU15). */
export function Confirmacion({
  abierta, titulo, mensaje, textoConfirmar, onConfirmar, onCancelar, ocupado,
}: {
  abierta: boolean; titulo: string; mensaje: string; textoConfirmar: string;
  onConfirmar: () => void; onCancelar: () => void; ocupado?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (abierta && !d.open) d.showModal();
    if (!abierta && d.open) d.close();
  }, [abierta]);
  return (
    <dialog
      ref={ref}
      onCancel={(ev) => { ev.preventDefault(); onCancelar(); }}
      className="m-auto w-[min(92vw,440px)] rounded-2xl p-0 shadow-xl backdrop:bg-black/40"
    >
      <div className="flex flex-col gap-4 p-6">
        <h2 className="text-xl font-bold text-texto">{titulo}</h2>
        <p className="text-base text-texto-suave">{mensaje}</p>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancelar} className="btn-secundario" disabled={ocupado}>
            Cancelar
          </button>
          <button type="button" onClick={onConfirmar} className="btn-peligro" disabled={ocupado}>
            {ocupado ? "Eliminando..." : textoConfirmar}
          </button>
        </div>
      </div>
    </dialog>
  );
}
