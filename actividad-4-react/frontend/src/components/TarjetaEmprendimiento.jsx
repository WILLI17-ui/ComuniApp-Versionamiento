import { memo } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIAS } from '../api/servicios';
import { enlaceWhatsApp, iniciales } from '../utils/formato';

// memo evita volver a dibujar la tarjeta si sus datos no cambiaron (por ejemplo, al escribir en el buscador).
function TarjetaEmprendimiento({ emp }) {
  const icono = CATEGORIAS.find((c) => c.nombre === emp.categoria)?.icono ?? '✨';
  return (
    <article className="tarjeta">
      <Link to={`/emprendimientos/${emp.id}`} className="tarjeta__imagen" aria-label={`Ver ${emp.nombre}`}>
        {emp.imagenUrl
          ? <img src={emp.imagenUrl} alt="" loading="lazy" />
          : <span className="tarjeta__iniciales">{iniciales(emp.nombre)}</span>}
      </Link>
      <div className="tarjeta__cuerpo">
        <span className="etiqueta">{icono} {emp.categoria}</span>
        <h3><Link to={`/emprendimientos/${emp.id}`}>{emp.nombre}</Link></h3>
        <p className="tarjeta__descripcion">{emp.descripcion}</p>
        <a className="boton boton--whatsapp" href={enlaceWhatsApp(emp.whatsapp, emp.nombre)} target="_blank" rel="noreferrer">
          Escribir por WhatsApp
        </a>
      </div>
    </article>
  );
}

export default memo(TarjetaEmprendimiento);
