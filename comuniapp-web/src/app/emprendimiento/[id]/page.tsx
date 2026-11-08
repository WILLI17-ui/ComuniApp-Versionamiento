"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { whatsappLink, type Emprendimiento } from "@/lib/types";
import { Cargando, EtiquetaCategoria, FotoEmprendimiento } from "@/components/ui";
import { useAuth } from "@/components/AuthProvider";

export default function Perfil() {
  const { id } = useParams<{ id: string }>();
  const { usuario } = useAuth();
  const [e, setE] = useState<Emprendimiento | null | undefined>(undefined);

  useEffect(() => {
    api.obtener(id).then(setE);
  }, [id]);

  if (e === undefined) return <Cargando />;
  if (e === null)
    return (
      <div className="contenedor flex flex-col items-center gap-4 py-20 text-center">
        <span className="text-5xl" aria-hidden="true">🏚️</span>
        <h1 className="text-2xl font-bold">Este emprendimiento ya no está disponible</h1>
        <Link href="/directorio" className="btn-primario">Volver al directorio</Link>
      </div>
    );

  const esDueno = usuario?.id === e.owner_id;

  return (
    <div className="contenedor py-8">
      <Link href="/directorio" className="inline-flex min-h-11 items-center font-semibold text-verde-700 hover:underline">
        ← Volver al directorio
      </Link>
      <article className="mt-4 grid gap-8 md:grid-cols-[1.1fr_1fr]">
        <FotoEmprendimiento e={e} className="aspect-[4/3] w-full rounded-3xl ring-1 ring-verde-100" />
        <div className="flex flex-col gap-5">
          <EtiquetaCategoria c={e.categoria} />
          <h1 className="text-3xl font-extrabold md:text-4xl">{e.nombre}</h1>
          <p className="whitespace-pre-line text-lg text-texto-suave">{e.descripcion}</p>
          <div className="flex items-start gap-3 rounded-2xl bg-verde-50 p-4 ring-1 ring-verde-100">
            <span className="text-2xl" aria-hidden="true">🕒</span>
            <div>
              <p className="font-bold">Horario de atención</p>
              <p className="text-texto-suave">{e.horario}</p>
            </div>
          </div>
          {/* Contacto por WhatsApp (HU06) */}
          <a href={whatsappLink(e.whatsapp, e.nombre)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.3-.8-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.7 1.2 1.6 2 1.1.9 2 1.2 2.3 1.4.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3Z" />
            </svg>
            Contactar por WhatsApp
          </a>
          <p className="text-sm text-texto-suave">Se abrirá WhatsApp con un mensaje listo para enviar.</p>
          {esDueno && (
            <Link href={`/panel/editar/${e.id}`} className="btn-secundario w-fit">✏️ Editar mi emprendimiento</Link>
          )}
        </div>
      </article>
    </div>
  );
}
