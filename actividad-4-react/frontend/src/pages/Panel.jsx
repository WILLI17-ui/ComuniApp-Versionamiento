import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { emprendimientosApi } from '../api/servicios';
import { useAuth } from '../context/AuthContext';
import Cargando, { MensajeError } from '../components/Cargando';

export default function Panel() {
  const { usuario } = useAuth();
  const [lista, setLista] = useState(null);
  const [error, setError] = useState('');

  const cargar = useCallback(() => {
    setError('');
    emprendimientosApi.mios().then(setLista).catch((err) => setError(err.mensaje));
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  async function eliminar(emp) {
    if (!window.confirm(`¿Eliminar "${emp.nombre}"? Esta acción no se puede deshacer.`)) return;
    const anterior = lista;
    setLista((l) => l.filter((e) => e.id !== emp.id)); // actualización optimista
    try {
      await emprendimientosApi.eliminar(emp.id);
    } catch (err) {
      setLista(anterior); // si falla, se restaura la lista
      setError(err.mensaje);
    }
  }

  return (
    <section className="contenedor seccion">
      <div className="seccion__titulo">
        <h1>Hola, {usuario.nombre.split(' ')[0]}</h1>
        <Link to="/panel/nuevo" className="boton">+ Nuevo emprendimiento</Link>
      </div>
      {error && <MensajeError mensaje={error} onReintentar={cargar} />}
      {!lista ? <Cargando /> : lista.length === 0 ? (
        <p className="vacio">Aún no has publicado emprendimientos. Crea el primero para que tus vecinos te encuentren.</p>
      ) : (
        <ul className="lista-panel">
          {lista.map((e) => (
            <li key={e.id}>
              <div>
                <strong>{e.nombre}</strong>
                <span className="etiqueta">{e.categoria}</span>
              </div>
              <div className="lista-panel__acciones">
                <Link to={`/emprendimientos/${e.id}`}>Ver</Link>
                <Link to={`/panel/editar/${e.id}`}>Editar</Link>
                <button className="enlace enlace--peligro" onClick={() => eliminar(e)}>Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
