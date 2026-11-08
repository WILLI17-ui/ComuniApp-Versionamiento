"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Aviso } from "@/components/ui";
import { useAuth } from "@/components/AuthProvider";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Registro() {
  const router = useRouter();
  const { usuario } = useAuth();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acepta, setAcepta] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [aviso, setAviso] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (usuario) router.replace("/panel");
  }, [usuario, router]);

  async function enviar(ev: React.FormEvent) {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (nombre.trim().length < 3) e.nombre = "Escribe tu nombre completo.";
    if (!email.trim()) e.email = "Escribe tu correo electrónico.";
    else if (!EMAIL_RE.test(email.trim())) e.email = "El correo no tiene un formato válido.";
    if (password.length < 6) e.password = "La contraseña debe tener al menos 6 caracteres.";
    if (!acepta) e.acepta = "Debes aceptar los términos y condiciones y la política de privacidad para crear tu cuenta.";
    setErrores(e);
    setErrorGeneral("");
    if (Object.keys(e).length) return;
    setEnviando(true);
    try {
      const r = await api.registrar(nombre.trim(), email.trim(), password);
      if (r.necesitaConfirmar) setAviso("Te enviamos un correo para confirmar tu cuenta. Después podrás iniciar sesión.");
      else router.replace("/panel");
    } catch (err) {
      setErrorGeneral((err as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="contenedor flex justify-center py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-sm ring-1 ring-verde-100 sm:p-8">
        <h1 className="text-3xl font-extrabold">Crear cuenta</h1>
        <p className="mt-1 text-texto-suave">Regístrate para publicar tu emprendimiento. Es gratis.</p>
        <form onSubmit={enviar} noValidate className="mt-6 flex flex-col gap-5">
          {errorGeneral && <Aviso>{errorGeneral}</Aviso>}
          {aviso && <Aviso tipo="ok">{aviso}</Aviso>}
          <div>
            <label htmlFor="nombre" className="etiqueta">Nombre completo</label>
            <input id="nombre" autoComplete="name" value={nombre} onChange={(e) => setNombre(e.target.value)}
              className={`campo ${errores.nombre ? "campo-error" : ""}`} aria-invalid={!!errores.nombre} aria-describedby="err-nombre" />
            {errores.nombre && <p id="err-nombre" className="msg-error">{errores.nombre}</p>}
          </div>
          <div>
            <label htmlFor="email" className="etiqueta">Correo electrónico</label>
            <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className={`campo ${errores.email ? "campo-error" : ""}`} aria-invalid={!!errores.email} aria-describedby="err-email" />
            {errores.email && <p id="err-email" className="msg-error">{errores.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="etiqueta">Contraseña</label>
            <input id="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)}
              className={`campo ${errores.password ? "campo-error" : ""}`} aria-invalid={!!errores.password} aria-describedby="ayuda-pass" />
            <p id="ayuda-pass" className={errores.password ? "msg-error" : "mt-1.5 text-sm text-texto-suave"}>
              {errores.password || "Mínimo 6 caracteres."}
            </p>
          </div>
          {/* Aceptación de términos y política (HU07, HU12) */}
          <div>
            <label className={`flex cursor-pointer items-start gap-3 rounded-xl p-3 ring-1 ${errores.acepta ? "bg-red-50 ring-red-300" : "bg-verde-50 ring-verde-100"}`}>
              <input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)}
                className="mt-0.5 h-6 w-6 shrink-0 accent-verde-700" aria-describedby="err-acepta" />
              <span className="text-base">
                He leído y acepto los{" "}
                <a href="/terminos" target="_blank" rel="noopener" className="font-semibold text-verde-800 underline">términos y condiciones</a>{" "}
                y la{" "}
                <a href="/privacidad" target="_blank" rel="noopener" className="font-semibold text-verde-800 underline">política de privacidad</a>.
              </span>
            </label>
            {errores.acepta && <p id="err-acepta" className="msg-error">{errores.acepta}</p>}
          </div>
          <button type="submit" className="btn-primario w-full !text-lg" disabled={enviando}>
            {enviando ? "Creando cuenta..." : "Registrarse"}
          </button>
          <p className="text-center text-base">
            ¿Ya tienes cuenta?{" "}
            <Link href="/ingresar" className="font-semibold text-verde-700 underline">Inicia sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
