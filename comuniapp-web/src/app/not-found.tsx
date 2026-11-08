import Link from "next/link";

export default function NoEncontrado() {
  return (
    <div className="contenedor flex flex-col items-center gap-4 py-20 text-center">
      <span className="text-5xl" aria-hidden="true">🧭</span>
      <h1 className="text-2xl font-bold">No encontramos esta página</h1>
      <Link href="/" className="btn-primario">Volver al inicio</Link>
    </div>
  );
}
