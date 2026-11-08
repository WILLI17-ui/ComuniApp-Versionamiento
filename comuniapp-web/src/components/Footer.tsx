import Link from "next/link";
import { LogoIcono } from "./ui";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-verde-100 bg-verde-50">
      <div className="contenedor flex flex-col gap-6 py-8 md:flex-row md:items-start md:justify-between">
        <div className="flex max-w-sm items-start gap-3">
          <LogoIcono size={36} />
          <p className="text-base text-texto-suave">
            ComuniApp conecta a los residentes de Ciudad La Salle Galet con los emprendimientos de su propia comunidad.
          </p>
        </div>
        <nav aria-label="Enlaces legales" className="flex flex-col gap-2 text-base">
          <Link href="/terminos" className="font-semibold text-verde-800 underline-offset-4 hover:underline">
            Términos y condiciones
          </Link>
          <Link href="/privacidad" className="font-semibold text-verde-800 underline-offset-4 hover:underline">
            Política de privacidad
          </Link>
          <Link href="/registro" className="font-semibold text-verde-800 underline-offset-4 hover:underline">
            Publica tu emprendimiento
          </Link>
        </nav>
      </div>
      <p className="border-t border-verde-100 py-4 text-center text-sm text-texto-suave">
        © 2026 ComuniApp · Proyecto académico · Corporación Universitaria Iberoamericana
      </p>
    </footer>
  );
}
