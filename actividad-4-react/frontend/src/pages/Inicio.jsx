import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIAS, emprendimientosApi } from '../api/servicios';
import TarjetaEmprendimiento from '../components/TarjetaEmprendimiento';
import Cargando from '../components/Cargando';

export default function Inicio() {
  const [destacados, setDestacados] = useState([]);
  const [cargando, setCargando] = useState(true);

  // useEffect: trae los últimos emprendimientos al montar la página.
  // AbortController cancela la petición si el usuario sale antes de que responda.
  useEffect(() => {
    const control = new AbortController();
    emprendimientosApi.listar({ limit: 3 }, control.signal)
      .then((r) => setDestacados(r.datos))
      .catch(() => {})
      .finally(() => { if (!control.signal.aborted) setCargando(false); });
    return () => control.abort();
  }, []);

  return (
    <>
      <section className="hero">
        <div className="contenedor">
          <span className="etiqueta etiqueta--clara">📍 Ciudad La Salle Galet</span>
          <h1>Encuentra lo que necesitas aquí en tu conjunto</h1>
          <p>Comida, mascotas, arreglos del hogar y más, ofrecidos por tus propios vecinos. Sin perder mensajes en los grupos.</p>
          <div className="hero__acciones">
            <Link to="/directorio" className="boton boton--claro">Explorar servicios</Link>
            <Link to="/registro" className="boton boton--borde-claro">Publicar mi emprendimiento</Link>
          </div>
        </div>
      </section>

      <section className="contenedor seccion">
        <h2>¿Qué estás buscando?</h2>
        <div className="categorias">
          {CATEGORIAS.map((c) => (
            <Link key={c.nombre} to={`/directorio?categoria=${encodeURIComponent(c.nombre)}`} className="categoria">
              <span aria-hidden="true">{c.icono}</span>{c.nombre}
            </Link>
          ))}
        </div>
      </section>

      <section className="contenedor seccion">
        <div className="seccion__titulo">
          <h2>Emprendimientos recientes</h2>
          <Link to="/directorio">Ver todos →</Link>
        </div>
        {cargando ? <Cargando /> : destacados.length
          ? <div className="grilla">{destacados.map((e) => <TarjetaEmprendimiento key={e.id} emp={e} />)}</div>
          : <p className="vacio">Todavía no hay emprendimientos publicados. ¡Sé el primero!</p>}
      </section>

      <section className="contenedor seccion pasos">
        <h2>Cómo funciona</h2>
        <ol>
          <li><strong>Busca</strong> por nombre o categoría.</li>
          <li><strong>Mira el perfil</strong> con la descripción, el horario y la foto.</li>
          <li><strong>Escribe por WhatsApp</strong> directamente al vecino.</li>
        </ol>
      </section>
    </>
  );
}
