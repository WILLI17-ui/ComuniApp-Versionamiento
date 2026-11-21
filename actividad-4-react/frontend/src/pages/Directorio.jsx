import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CATEGORIAS, emprendimientosApi } from '../api/servicios';
import { useDebounce } from '../hooks/useDebounce';
import TarjetaEmprendimiento from '../components/TarjetaEmprendimiento';
import Cargando, { MensajeError } from '../components/Cargando';

export default function Directorio() {
  // Los filtros viven en la URL (?q=...&categoria=...&page=...) para poder compartir o recargar la búsqueda.
  const [params, setParams] = useSearchParams();
  const categoria = params.get('categoria') ?? '';
  const page = Number(params.get('page') ?? 1);
  const [texto, setTexto] = useState(params.get('q') ?? '');
  const q = useDebounce(texto, 400);

  const [estado, setEstado] = useState({ cargando: true, error: '', datos: [], paginacion: null });
  const [reintento, setReintento] = useState(0);

  const actualizar = (cambios) => {
    const nuevos = new URLSearchParams(params);
    Object.entries(cambios).forEach(([k, v]) => (v ? nuevos.set(k, v) : nuevos.delete(k)));
    setParams(nuevos, { replace: true });
  };

  // Cuando cambia el texto (ya "debounced"), se vuelve a la página 1.
  useEffect(() => {
    if ((params.get('q') ?? '') !== q) actualizar({ q, page: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  // Cada cambio de filtros dispara una petición; la anterior se cancela para evitar respuestas desordenadas.
  useEffect(() => {
    const control = new AbortController();
    setEstado((s) => ({ ...s, cargando: true, error: '' }));
    emprendimientosApi.listar({ q: params.get('q') || undefined, categoria: categoria || undefined, page, limit: 9 }, control.signal)
      .then((r) => setEstado({ cargando: false, error: '', datos: r.datos, paginacion: r.paginacion }))
      .catch((err) => { if (!control.signal.aborted) setEstado((s) => ({ ...s, cargando: false, error: err.mensaje })); });
    return () => control.abort();
  }, [params, categoria, page, reintento]);

  const { cargando, error, datos, paginacion } = estado;

  return (
    <section className="contenedor seccion">
      <h1>Directorio</h1>
      <div className="filtros">
        <input type="search" placeholder="Buscar: arepas, peluquería, computadores..." value={texto}
          onChange={(e) => setTexto(e.target.value)} aria-label="Buscar emprendimientos" />
        <div className="chips" role="group" aria-label="Filtrar por categoría">
          <button className={`chip ${!categoria ? 'chip--activo' : ''}`} onClick={() => actualizar({ categoria: '', page: '' })}>Todas</button>
          {CATEGORIAS.map((c) => (
            <button key={c.nombre} className={`chip ${categoria === c.nombre ? 'chip--activo' : ''}`}
              aria-pressed={categoria === c.nombre} onClick={() => actualizar({ categoria: c.nombre, page: '' })}>
              {c.icono} {c.nombre}
            </button>
          ))}
        </div>
      </div>

      {error && <MensajeError mensaje={error} onReintentar={() => setReintento((n) => n + 1)} />}
      {cargando ? <Cargando /> : !error && (datos.length
        ? <div className="grilla">{datos.map((e) => <TarjetaEmprendimiento key={e.id} emp={e} />)}</div>
        : <p className="vacio">No encontramos emprendimientos con esos filtros.</p>)}

      {paginacion?.paginas > 1 && (
        <nav className="paginacion" aria-label="Paginación">
          <button className="boton boton--borde" disabled={page <= 1} onClick={() => actualizar({ page: String(page - 1) })}>← Anterior</button>
          <span>Página {page} de {paginacion.paginas}</span>
          <button className="boton boton--borde" disabled={page >= paginacion.paginas} onClick={() => actualizar({ page: String(page + 1) })}>Siguiente →</button>
        </nav>
      )}
    </section>
  );
}
