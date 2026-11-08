"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Aviso } from "@/components/ui";
import { useAuth } from "@/components/AuthProvider";

export default function Ingresar() {
  const router = useRouter();
  const { usuario } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (usuario) router.replace("/panel");
  }, [usuario, router]);

  async function enviar(ev: React.FormEvent) {
    ev.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Escribe tu correo y tu contraseña.");
      return;
    }
    setEnviando(true);
    try {
      await api.ingresar(email.trim(), password);
      router.replace("/panel");
    } catch {
      setError("Correo o contraseña incorrectos.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="contenedor flex justify-center py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-sm ring-1 ring-verde-100 sm:p-8">
        <h1 className="text-3xl font-extrabold">Iniciar sesión</h1>
        <p className="mt-1 text-texto-suave">Entra para administrar tus emprendimientos.</p>
        <form onSubmit={enviar} noValidate className="mt-6 flex flex-col gap-5">
          {error && <Aviso>{error}</Aviso>}
          <div>
            <label htmlFor="email" className="etiqueta">Correo electrónico</label>
            <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="campo" />
          </div>
          <div>
            <label htmlFor="password" className="etiqueta">Contraseña</label>
            <input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="campo" />
          </div>
          <button type="submit" className="btn-primario w-full !text-lg" disabled={enviando}>
            {enviando ? "Entrando..." : "Iniciar sesión"}
          </button>
          <p className="text-center text-base">
            ¿No tienes cuenta?{" "}
            <Link href="/registro" className="font-semibold text-verde-700 underline">Regístrate</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
