"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { CATEGORIAS, CATEGORIA_INFO, type Emprendimiento } from "@/lib/types";
import { Aviso, Cargando, TarjetaEmprendimiento } from "@/components/ui";
import { useAuth } from "@/components/AuthProvider";

export default function Inicio() {
  const { usuario } = useAuth();
  const [destacados, setDestacados] = useState<Emprendimiento[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.listar({ limite: 3 }).then(setDestacados).catch((e: Error) => setError(e.message));
  }, []);

  return (
    <>
      {/* Propuesta de valor (HU01) */}
      <section className="bg-gradient-to-b from-verde-50 to-white">
        <div className="contenedor grid items-center gap-8 py-12 md:grid-cols-2 md:py-16">
          <div className="flex flex-col gap-5">
            <p className="w-fit rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-verde-800 ring-1 ring-verde-200">
              📍 Ciudad La Salle Galet
            </p>
            <h1 className="text-4xl font-extrabold leading-tight text-texto md:text-5xl">
              Encuentra lo que necesitas <span className="text-verde-700">aquí en tu conjunto</span>
            </h1>
            <p className="text-lg text-texto-suave">
              Comida, mascotas, arreglos, belleza y más. Todos los emprendimientos de tus vecinos en un solo lugar, sin
              perderse entre los mensajes de WhatsApp.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/directorio" className="btn-primario !text-lg">Explorar servicios</Link>
              <Link href={usuario ? "/panel/nuevo" : "/registro"} className="btn-secundario !text-lg">
                Publicar mi emprendimiento
              </Link>
            </div>
          </div>
          <div className="hidden justify-center md:flex" aria-hidden="true">
            <div className="grid grid-cols-2 gap-4">
              {["🍲", "🐾", "🛠️", "💅"].map((i, n) => (
                <div
                  key={i}
                  className={`flex h-36 w-36 items-center justify-center rounded-3xl bg-white text-6xl shadow-md ring-1 ring-verde-100 ${n % 2 ? "translate-y-6" : ""}`}
                >
                  {i}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="contenedor py-10" aria-labelledby="titulo-categorias">
        <h2 id="titulo-categorias" className="mb-5 text-2xl font-bold">¿Qué estás buscando?</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          {CATEGORIAS.map((c) => (
            <Link
              key={c}
              href={`/directorio?categoria=${encodeURIComponent(c)}`}
              className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl p-3 text-center ring-1 ring-verde-100 transition hover:-translate-y-0.5 hover:ring-verde-300"
              style={{ background: CATEGORIA_INFO[c].fondo }}
            >
              <span className="text-4xl" aria-hidden="true">{CATEGORIA_INFO[c].icono}</span>
              <span className="font-bold text-texto">{c}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Destacados */}
      <section className="contenedor py-6" aria-labelledby="titulo-destacados">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 id="titulo-destacados" className="text-2xl font-bold">Emprendimientos destacados</h2>
          <Link href="/directorio" className="font-semibold text-verde-700 hover:underline">Ver todos →</Link>
        </div>
        {error && <Aviso>{error}</Aviso>}
        {!destacados && !error && <Cargando />}
        {destacados && destacados.length === 0 && (
          <Aviso tipo="info">Todavía no hay emprendimientos publicados. ¡Sé el primero!</Aviso>
        )}
        {destacados && destacados.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {destacados.map((e) => <TarjetaEmprendimiento key={e.id} e={e} />)}
          </div>
        )}
      </section>

      {/* Cómo funciona */}
      <section className="contenedor py-10" aria-labelledby="titulo-como">
        <h2 id="titulo-como" className="mb-5 text-2xl font-bold">Así de fácil funciona</h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {[
            ["1", "Busca", "Escribe lo que necesitas o elige una categoría."],
            ["2", "Mira el perfil", "Revisa la foto, la descripción y el horario del emprendimiento."],
            ["3", "Escribe por WhatsApp", "Con un solo botón hablas directamente con tu vecino."],
          ].map(([n, t, d]) => (
            <li key={n} className="flex gap-4 rounded-2xl bg-verde-50 p-5 ring-1 ring-verde-100">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-verde-700 text-lg font-bold text-white">
                {n}
              </span>
              <div>
                <h3 className="text-lg font-bold">{t}</h3>
                <p className="text-texto-suave">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
