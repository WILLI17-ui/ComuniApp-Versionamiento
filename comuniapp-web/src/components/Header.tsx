"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthProvider";
import { Logo } from "./ui";
import { api, MODO_DEMO } from "@/lib/api";

function Buscador({ id }: { id: string }) {
  const params = useSearchParams();
  const pathname = usePathname();
  const inicial = pathname === "/directorio" ? params.get("q") ?? "" : "";
  return <FormularioBusqueda key={`${pathname}|${inicial}`} id={id} inicial={inicial} />;
}

function FormularioBusqueda({ id, inicial }: { id: string; inicial: string }) {
  const router = useRouter();
  const [q, setQ] = useState(inicial);
  return (
    <form
      role="search"
      className="relative w-full"
      onSubmit={(ev) => {
        ev.preventDefault();
        const sp = new URLSearchParams();
        if (q.trim()) sp.set("q", q.trim());
        router.push(`/directorio${sp.size ? `?${sp}` : ""}`);
      }}
    >
      <label htmlFor={id} className="sr-only">Buscar servicios</label>
      <input
        id={id}
        type="search"
        value={q}
        onChange={(ev) => setQ(ev.target.value)}
        placeholder="Buscar servicios (ej: tamales, uñas)"
        className="campo !min-h-11 !rounded-full !py-2 pl-11"
      />
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-texto-suave" aria-hidden="true">
        🔍
      </span>
    </form>
  );
}

function MenuCuenta() {
  const { usuario } = useAuth();
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cerrar = (ev: MouseEvent) => {
      if (ref.current && !ref.current.contains(ev.target as Node)) setAbierto(false);
    };
    document.addEventListener("click", cerrar);
    return () => document.removeEventListener("click", cerrar);
  }, []);
  if (!usuario) return null;
  const inicial = (usuario.nombre || usuario.email).charAt(0).toUpperCase();
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-haspopup="menu"
        className="flex min-h-11 items-center gap-2 rounded-full bg-verde-50 py-1 pl-1 pr-3 font-semibold text-verde-800 ring-1 ring-verde-200 hover:bg-verde-100"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-verde-700 text-white">{inicial}</span>
        <span className="max-w-32 truncate">Mi perfil</span>
        <span aria-hidden="true">▾</span>
      </button>
      {abierto && (
        <div role="menu" className="absolute right-0 z-30 mt-2 w-64 overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-verde-100">
          <div className="border-b border-verde-100 px-4 py-3">
            <p className="font-bold text-texto">{usuario.nombre || "Emprendedor"}</p>
            <p className="truncate text-sm text-texto-suave">{usuario.email}</p>
          </div>
          <Link role="menuitem" href="/panel" onClick={() => setAbierto(false)} className="block px-4 py-3 hover:bg-verde-50">
            📋 Mis emprendimientos
          </Link>
          <button
            role="menuitem"
            type="button"
            onClick={async () => {
              setAbierto(false);
              await api.salir();
              router.replace("/");
            }}
            className="block w-full px-4 py-3 text-left font-semibold text-red-700 hover:bg-red-50"
          >
            ↩ Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const { usuario, cargando } = useAuth();
  const pathname = usePathname();
  const [menuEn, setMenuEn] = useState<string | null>(null);
  const menuMovil = menuEn === pathname;

  const enlace = (href: string, texto: string) => (
    <Link
      href={href}
      className={`rounded-lg px-3 py-2 font-semibold hover:bg-verde-50 ${pathname === href ? "text-verde-700" : "text-texto"}`}
      aria-current={pathname === href ? "page" : undefined}
    >
      {texto}
    </Link>
  );

  return (
    <header className="sticky top-0 z-20 border-b border-verde-100 bg-white/95 backdrop-blur">
      {MODO_DEMO && (
        <div className="bg-amber-100 px-4 py-1.5 text-center text-sm font-medium text-amber-900">
          Modo demostración: los datos se guardan solo en este navegador.
        </div>
      )}
      <div className="contenedor flex min-h-18 items-center gap-4 py-3">
        <Link href="/" aria-label="ComuniApp, ir al inicio" className="shrink-0">
          <Logo size={38} />
        </Link>
        <div className="hidden flex-1 md:block md:max-w-sm lg:max-w-md">
          <Suspense><Buscador id="buscar-escritorio" /></Suspense>
        </div>
        <nav aria-label="Principal" className="ml-auto hidden items-center gap-1 md:flex">
          {enlace("/", "Inicio")}
          {enlace("/directorio", "Directorio")}
          {!cargando && !usuario && (
            <>
              {enlace("/ingresar", "Iniciar sesión")}
              <Link href="/registro" className="btn-primario ml-1 !min-h-11 !py-2">Registrarse</Link>
            </>
          )}
          {!cargando && usuario && <MenuCuenta />}
        </nav>
        <button
          type="button"
          className="ml-auto flex h-12 w-12 items-center justify-center rounded-xl text-2xl ring-1 ring-verde-200 md:hidden"
          aria-label={menuMovil ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuMovil}
          onClick={() => setMenuEn(menuMovil ? null : pathname)}
        >
          {menuMovil ? "✕" : "☰"}
        </button>
      </div>
      <div className="contenedor pb-3 md:hidden">
        <Suspense><Buscador id="buscar-movil" /></Suspense>
      </div>
      {menuMovil && (
        <nav aria-label="Menú móvil" className="border-t border-verde-100 bg-white md:hidden">
          <div className="contenedor flex flex-col gap-1 py-3">
            {enlace("/", "Inicio")}
            {enlace("/directorio", "Directorio")}
            {!cargando && !usuario && (
              <>
                {enlace("/ingresar", "Iniciar sesión")}
                <Link href="/registro" className="btn-primario mt-2">Registrarse</Link>
              </>
            )}
            {!cargando && usuario && (
              <>
                <p className="px-3 pt-2 text-sm text-texto-suave">Mi perfil · {usuario.nombre || usuario.email}</p>
                {enlace("/panel", "Mis emprendimientos")}
                <BotonSalirMovil />
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

function BotonSalirMovil() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await api.salir();
        router.replace("/");
      }}
      className="btn-secundario mt-2 !text-red-700"
    >
      ↩ Cerrar sesión
    </button>
  );
}
