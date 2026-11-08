"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { CATEGORIAS, CATEGORIA_INFO, type Categoria, type Emprendimiento } from "@/lib/types";
import { Aviso, Cargando, TarjetaEmprendimiento } from "@/components/ui";

function Directorio() {
  const params = useSearchParams();
  const router = useRouter();
  const catParam = params.get("categoria");
  const categoria = (CATEGORIAS as readonly string[]).includes(catParam ?? "") ? (catParam as Categoria) : null;
  const q = params.get("q") ?? "";
  const clave = `${categoria ?? ""}|${q}`;
  const [resultado, setResultado] = useState<{ clave: string; lista: Emprendimiento[] | null; error: string }>({
    clave: "", lista: null, error: "",
  });
  const lista = resultado.clave === clave ? resultado.lista : null;
  const error = resultado.clave === clave ? resultado.error : "";

  useEffect(() => {
    let activo = true;
    api
      .listar({ categoria, q })
      .then((l) => activo && setResultado({ clave, lista: l, error: "" }))
      .catch((e: Error) => activo && setResultado({ clave, lista: null, error: e.message }));
    return () => { activo = false; };
  }, [categoria, q, clave]);

  const ir = (c: Categoria | null) => {
    const sp = new URLSearchParams();
    if (c) sp.set("categoria", c);
    if (q) sp.set("q", q);
    router.push(`/directorio${sp.size ? `?${sp}` : ""}`);
  };

  return (
    <div className="contenedor py-8">
      <h1 className="text-3xl font-extrabold">Directorio de servicios</h1>
      <p className="mt-1 text-lg text-texto-suave">Explora los emprendimientos y servicios disponibles en la comunidad.</p>

      {/* Filtro por categoría (HU03) */}
      <div className="mt-6" role="group" aria-label="Filtrar por categoría">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => ir(null)}
            aria-pressed={!categoria}
            className={`min-h-11 rounded-full px-4 py-2 font-semibold ring-1 transition ${!categoria ? "bg-verde-700 text-white ring-verde-700" : "bg-white text-texto ring-verde-200 hover:bg-verde-50"}`}
          >
            Todas
          </button>
          {CATEGORIAS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => ir(c)}
              aria-pressed={categoria === c}
              className={`min-h-11 rounded-full px-4 py-2 font-semibold ring-1 transition ${categoria === c ? "bg-verde-700 text-white ring-verde-700" : "bg-white text-texto ring-verde-200 hover:bg-verde-50"}`}
            >
              <span aria-hidden="true">{CATEGORIA_INFO[c].icono}</span> {c}
            </button>
          ))}
        </div>
      </div>

      {(q || categoria) && (
        <p className="mt-4 text-base text-texto-suave" aria-live="polite">
          {lista ? `${lista.length} resultado${lista.length === 1 ? "" : "s"}` : "Buscando"}
          {q && <> para <strong className="text-texto">“{q}”</strong></>}
          {categoria && <> en <strong className="text-texto">{categoria}</strong></>}
          {" · "}
          <Link href="/directorio" className="font-semibold text-verde-700 underline">Ver todos los emprendimientos</Link>
        </p>
      )}

      <div className="mt-6">
        {error && <Aviso>{error}</Aviso>}
        {!lista && !error && <Cargando />}
        {lista && lista.length === 0 && (
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-verde-50 px-6 py-12 text-center ring-1 ring-verde-100">
            <span className="text-5xl" aria-hidden="true">🔎</span>
            <p className="text-xl font-bold">No se encontraron emprendimientos</p>
            <p className="text-texto-suave">Prueba con otra palabra o revisa todas las categorías.</p>
            <Link href="/directorio" className="btn-primario">Ver todos los emprendimientos</Link>
          </div>
        )}
        {lista && lista.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {lista.map((e) => <TarjetaEmprendimiento key={e.id} e={e} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Cargando />}>
      <Directorio />
    </Suspense>
  );
}
