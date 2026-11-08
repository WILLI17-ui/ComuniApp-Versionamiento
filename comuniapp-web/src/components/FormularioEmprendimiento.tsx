"use client";

import { useEffect, useMemo, useState } from "react";
import { CATEGORIAS, FOTO_MAX_BYTES, FOTO_TIPOS, type Categoria, type Emprendimiento, type EmprendimientoInput } from "@/lib/types";
import { Aviso } from "./ui";

/** Deja solo dígitos; si pegan el número con +57 lo quita. Máximo 10 dígitos. */
function soloCelular(v: string) {
  let d = v.replace(/\D/g, "");
  if (d.length > 10 && d.startsWith("57")) d = d.slice(2);
  return d.slice(0, 10);
}

type Props = {
  inicial?: Emprendimiento;
  textoBoton: string;
  onGuardar: (datos: EmprendimientoInput, foto: File | null, quitarFoto: boolean) => Promise<void>;
};

export function FormularioEmprendimiento({ inicial, textoBoton, onGuardar }: Props) {
  const [nombre, setNombre] = useState(inicial?.nombre ?? "");
  const [categoria, setCategoria] = useState<Categoria | "">(inicial?.categoria ?? "");
  const [descripcion, setDescripcion] = useState(inicial?.descripcion ?? "");
  const [horario, setHorario] = useState(inicial?.horario ?? "");
  const [whatsapp, setWhatsapp] = useState(inicial?.whatsapp ?? "");
  const [foto, setFoto] = useState<File | null>(null);
  const [quitarFoto, setQuitarFoto] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [enviando, setEnviando] = useState(false);

  const vistaNueva = useMemo(() => (foto ? URL.createObjectURL(foto) : null), [foto]);
  useEffect(() => () => { if (vistaNueva) URL.revokeObjectURL(vistaNueva); }, [vistaNueva]);
  const vista = vistaNueva ?? (quitarFoto ? null : inicial?.foto_url ?? null);

  function elegirFoto(ev: React.ChangeEvent<HTMLInputElement>) {
    const f = ev.target.files?.[0];
    ev.target.value = "";
    if (!f) return;
    if (!FOTO_TIPOS.includes(f.type)) {
      setErrores((e) => ({ ...e, foto: "La foto debe ser una imagen JPG o PNG." }));
      return;
    }
    if (f.size > FOTO_MAX_BYTES) {
      setErrores((e) => ({ ...e, foto: "La foto pesa más de 2 MB. Elige una más liviana." }));
      return;
    }
    setErrores((e) => {
      const resto = { ...e };
      delete resto.foto;
      return resto;
    });
    setFoto(f);
    setQuitarFoto(false);
  }

  function quitar() {
    setFoto(null);
    setQuitarFoto(!!inicial?.foto_url);
  }

  async function enviar(ev: React.FormEvent) {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (nombre.trim().length < 2) e.nombre = "Escribe el nombre del emprendimiento.";
    if (!categoria) e.categoria = "Elige una categoría.";
    if (descripcion.trim().length < 10) e.descripcion = "Describe lo que ofreces (mínimo 10 caracteres).";
    if (horario.trim().length < 3) e.horario = "Escribe tu horario de atención.";
    if (!/^\d{10}$/.test(whatsapp)) e.whatsapp = "Escribe un número de celular de 10 dígitos, sin espacios.";
    setErrores(e);
    setErrorGeneral("");
    if (Object.keys(e).length) return;
    setEnviando(true);
    try {
      await onGuardar(
        { nombre: nombre.trim(), categoria: categoria as Categoria, descripcion: descripcion.trim(), horario: horario.trim(), whatsapp },
        foto,
        quitarFoto
      );
    } catch (err) {
      setErrorGeneral((err as Error).message);
      setEnviando(false);
    }
  }

  const err = (k: string) => (errores[k] ? <p id={`err-${k}`} className="msg-error">{errores[k]}</p> : null);

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-5">
      {errorGeneral && <Aviso>{errorGeneral}</Aviso>}
      {Object.keys(errores).length > 0 && <Aviso>Revisa los campos marcados en rojo.</Aviso>}

      <div>
        <label htmlFor="nombre" className="etiqueta">Nombre del emprendimiento *</label>
        <input id="nombre" maxLength={60} value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Tamales Doña Marta"
          className={`campo ${errores.nombre ? "campo-error" : ""}`} aria-invalid={!!errores.nombre} aria-describedby="err-nombre" />
        {err("nombre")}
      </div>

      <div>
        <label htmlFor="categoria" className="etiqueta">Categoría *</label>
        <select id="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value as Categoria)}
          className={`campo ${errores.categoria ? "campo-error" : ""}`} aria-invalid={!!errores.categoria} aria-describedby="err-categoria">
          <option value="">Selecciona una categoría</option>
          {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {err("categoria")}
      </div>

      <div>
        <label htmlFor="descripcion" className="etiqueta">Descripción *</label>
        <textarea id="descripcion" rows={4} maxLength={400} value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Cuéntale a tus vecinos qué ofreces, precios o cómo hacer pedidos."
          className={`campo ${errores.descripcion ? "campo-error" : ""}`} aria-invalid={!!errores.descripcion} aria-describedby="err-descripcion" />
        <p className="mt-1 text-right text-sm text-texto-suave">{descripcion.length}/400</p>
        {err("descripcion")}
      </div>

      <div>
        <label htmlFor="horario" className="etiqueta">Horario de atención *</label>
        <input id="horario" maxLength={100} value={horario} onChange={(e) => setHorario(e.target.value)} placeholder="Ej: Lunes a sábado, 8:00 a. m. – 6:00 p. m."
          className={`campo ${errores.horario ? "campo-error" : ""}`} aria-invalid={!!errores.horario} aria-describedby="err-horario" />
        {err("horario")}
      </div>

      <div>
        <label htmlFor="whatsapp" className="etiqueta">Número de WhatsApp *</label>
        <div className="flex">
          <span className="flex items-center rounded-l-xl border-2 border-r-0 border-verde-200 bg-verde-50 px-3 font-semibold text-texto-suave">+57</span>
          <input id="whatsapp" inputMode="numeric" autoComplete="tel-national" value={whatsapp}
            onChange={(e) => setWhatsapp(soloCelular(e.target.value))} placeholder="3001234567"
            className={`campo !rounded-l-none ${errores.whatsapp ? "campo-error" : ""}`} aria-invalid={!!errores.whatsapp} aria-describedby="err-whatsapp" />
        </div>
        {err("whatsapp")}
      </div>

      {/* Foto opcional (HU11) */}
      <div>
        <span className="etiqueta">Foto de tus productos o servicios <span className="font-normal text-texto-suave">(opcional)</span></span>
        <div className="flex flex-col gap-3 rounded-2xl border-2 border-dashed border-verde-200 bg-verde-50/50 p-4 sm:flex-row sm:items-center">
          {vista ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={vista} alt="Vista previa de la foto" className="h-32 w-full rounded-xl object-cover sm:w-44" />
          ) : (
            <div className="flex h-32 w-full items-center justify-center rounded-xl bg-white text-4xl ring-1 ring-verde-100 sm:w-44" aria-hidden="true">📷</div>
          )}
          <div className="flex flex-col gap-2">
            <label className="btn-secundario cursor-pointer">
              {vista ? "Cambiar foto" : "Elegir foto"}
              <input type="file" accept="image/jpeg,image/png" onChange={elegirFoto} className="sr-only" aria-describedby="ayuda-foto err-foto" />
            </label>
            {vista && <button type="button" onClick={quitar} className="text-left font-semibold text-red-700 underline">Quitar foto</button>}
            <p id="ayuda-foto" className="text-sm text-texto-suave">JPG o PNG, máximo 2 MB. Si no subes foto, se mostrará una imagen por defecto.</p>
          </div>
        </div>
        {err("foto")}
      </div>

      <button type="submit" className="btn-primario !text-lg" disabled={enviando}>
        {enviando ? "Guardando..." : textoBoton}
      </button>
    </form>
  );
}
