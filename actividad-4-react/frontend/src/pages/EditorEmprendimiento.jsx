import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { emprendimientosApi } from '../api/servicios';
import FormEmprendimiento from '../components/FormEmprendimiento';
import Cargando, { MensajeError } from '../components/Cargando';

// Sirve para crear (/panel/nuevo) y para editar (/panel/editar/:id).
export default function EditorEmprendimiento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inicial, setInicial] = useState(id ? null : {});
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    emprendimientosApi.detalle(id)
      .then((e) => setInicial({ ...e, horario: e.horario ?? '', imagenUrl: e.imagenUrl ?? '' }))
      .catch((err) => setError(err.mensaje));
  }, [id]);

  async function guardar(valores) {
    if (id) await emprendimientosApi.actualizar(id, valores);
    else await emprendimientosApi.crear(valores);
    navigate('/panel');
  }

  return (
    <section className="contenedor seccion acceso">
      <Link to="/panel" className="volver">← Volver al panel</Link>
      <h1>{id ? 'Editar emprendimiento' : 'Nuevo emprendimiento'}</h1>
      {error ? <MensajeError mensaje={error} /> : !inicial ? <Cargando /> : (
        <FormEmprendimiento inicial={inicial} textoBoton={id ? 'Guardar cambios' : 'Publicar'} onGuardar={guardar} />
      )}
    </section>
  );
}
