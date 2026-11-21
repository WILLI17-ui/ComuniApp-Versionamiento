import { useEffect, useState } from 'react';

// Devuelve el valor solo cuando el usuario deja de escribir por `espera` ms.
// Evita mandar una petición a la API por cada tecla.
export function useDebounce(valor, espera = 400) {
  const [retrasado, setRetrasado] = useState(valor);
  useEffect(() => {
    const t = setTimeout(() => setRetrasado(valor), espera);
    return () => clearTimeout(t);
  }, [valor, espera]);
  return retrasado;
}
