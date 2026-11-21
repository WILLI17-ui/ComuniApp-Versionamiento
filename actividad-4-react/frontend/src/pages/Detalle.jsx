import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CATEGORIAS, emprendimientosApi } from '../api/servicios';
import { enlaceWhatsApp, iniciales } from '../utils/formato';
import Cargando, { MensajeError } from '../components/Cargando';

export default function Detalle() {
  const { id } = useParams(); // parámetro dinámico de la ruta /emprendimientos/:id
  const [emp, setEmp] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const control = new AbortController();
    emprendimientosApi.detalle(id, control.signal)
      .then(setEmp)
      .catch((err) => { if (!control.signal.aborted) setError(err.mensaje); });
    return () => control.abort();
  }, [id]);

  if (error) return <section className="contenedor seccion"><MensajeError mensaje={error} /><Link to="/directorio">← Volver al directorio</Link></section>;
  if (!emp) return <Cargando />;

  const icono = CATEGORIAS.find((c) => c.nombre === emp.categoria)?.icono ?? '✨';
  return (
    <section className="contenedor seccion detalle">
      <Link to="/directorio" className="volver">← Volver al directorio</Link>
      <div className="detalle__grid">
        <div className="detalle__imagen">
          {emp.imagenUrl ? <img src={emp.imagenUrl} alt={`Foto de ${emp.nombre}`} /> : <span className="tarjeta__iniciales">{iniciales(emp.nombre)}</span>}
        </div>
        <div>
          <span className="etiqueta">{icono} {emp.categoria}</span>
          <h1>{emp.nombre}</h1>
          <p className="detalle__descripcion">{emp.descripcion}</p>
          <dl className="detalle__datos">
            {emp.horario && (<><dt>Horario</dt><dd>{emp.horario}</dd></>)}
            <dt>Emprendedor</dt><dd>{emp.emprendedor}</dd>
          </dl>
          <a className="boton boton--whatsapp boton--grande" href={enlaceWhatsApp(emp.whatsapp, emp.nombre)} target="_blank" rel="noreferrer">
            Escribir por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
