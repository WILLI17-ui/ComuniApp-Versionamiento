"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Emprendimiento } from "@/lib/types";
import { Cargando } from "@/components/ui";
import { useRequiereSesion } from "@/components/AuthProvider";
import { FormularioEmprendimiento } from "@/components/FormularioEmprendimiento";

export default function Editar() {
  const { id } = useParams<{ id: string }>();
  const { usuario, cargando } = useRequiereSesion();
  const router = useRouter();
  const [e, setE] = useState<Emprendimiento | null | undefined>(undefined);

  useEffect(() => {
    api.obtener(id).then(setE);
  }, [id]);

  if (cargando || !usuario || e === undefined) return <Cargando />;

  // Solo el dueño puede editar (HU14)
  if (!e || e.owner_id !== usuario.id)
    return (
      <div className="contenedor flex flex-col items-center gap-4 py-20 text-center">
        <span className="text-5xl" aria-hidden="true">🔒</span>
        <h1 className="text-2xl font-bold">No tienes permiso para editar este emprendimiento</h1>
        <Link href="/panel" className="btn-primario">Ir a mis emprendimientos</Link>
      </div>
    );

  return (
    <div className="contenedor flex justify-center py-8">
      <div className="w-full max-w-2xl">
        <Link href="/panel" className="inline-flex min-h-11 items-center font-semibold text-verde-700 hover:underline">← Mis emprendimientos</Link>
        <div className="mt-3 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-verde-100 sm:p-8">
          <h1 className="text-3xl font-extrabold">Editar emprendimiento</h1>
          <p className="mb-6 mt-1 text-texto-suave">Actualiza la información y guarda los cambios.</p>
          <FormularioEmprendimiento
            inicial={e}
            textoBoton="Guardar cambios"
            onGuardar={async (datos, foto, quitarFoto) => {
              await api.actualizar(e.id, datos, foto, quitarFoto);
              router.push(`/emprendimiento/${e.id}`);
            }}
          />
        </div>
      </div>
    </div>
  );
}
