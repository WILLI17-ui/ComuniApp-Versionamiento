"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Cargando } from "@/components/ui";
import { useRequiereSesion } from "@/components/AuthProvider";
import { FormularioEmprendimiento } from "@/components/FormularioEmprendimiento";

export default function Nuevo() {
  const { usuario, cargando } = useRequiereSesion();
  const router = useRouter();
  if (cargando || !usuario) return <Cargando />;
  return (
    <div className="contenedor flex justify-center py-8">
      <div className="w-full max-w-2xl">
        <Link href="/panel" className="inline-flex min-h-11 items-center font-semibold text-verde-700 hover:underline">← Mis emprendimientos</Link>
        <div className="mt-3 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-verde-100 sm:p-8">
          <h1 className="text-3xl font-extrabold">Crear emprendimiento</h1>
          <p className="mb-6 mt-1 text-texto-suave">Los campos con * son obligatorios.</p>
          <FormularioEmprendimiento
            textoBoton="Guardar emprendimiento"
            onGuardar={async (datos, foto) => {
              const nuevo = await api.crear(datos, foto);
              router.push(`/emprendimiento/${nuevo.id}`);
            }}
          />
        </div>
      </div>
    </div>
  );
}
