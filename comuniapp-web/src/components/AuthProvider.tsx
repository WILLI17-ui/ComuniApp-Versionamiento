"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Usuario } from "@/lib/types";

type Ctx = { usuario: Usuario | null; cargando: boolean };
const AuthCtx = createContext<Ctx>({ usuario: null, cargando: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    api.usuarioActual().then((u) => {
      if (activo) {
        setUsuario(u);
        setCargando(false);
      }
    });
    const off = api.alCambiarSesion((u) => {
      setUsuario(u);
      setCargando(false);
    });
    return () => {
      activo = false;
      off();
    };
  }, []);

  return <AuthCtx.Provider value={{ usuario, cargando }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);

/** Redirige al inicio de sesión si no hay sesión (HU09, HU10, HU16). */
export function useRequiereSesion() {
  const { usuario, cargando } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!cargando && !usuario) router.replace("/ingresar");
  }, [cargando, usuario, router]);
  return { usuario, cargando };
}
