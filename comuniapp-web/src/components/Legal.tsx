import Link from "next/link";

export function PaginaLegal({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="contenedor flex justify-center py-10">
      <article className="w-full max-w-3xl rounded-3xl bg-white p-6 ring-1 ring-verde-100 sm:p-10 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_li]:mt-1.5 [&_p]:mt-3 [&_p]:text-texto-suave [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-texto-suave">
        <h1 className="text-3xl font-extrabold">{titulo}</h1>
        <p className="!mt-2 text-sm">Última actualización: noviembre de 2026</p>
        {children}
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="btn-secundario">Volver al inicio</Link>
          <Link href="/registro" className="btn-primario">Ir al registro</Link>
        </div>
      </article>
    </div>
  );
}

export const RESPONSABLE = "William Fabián Parra";
export const CORREO_CONTACTO = "williparra97@gmail.com";
