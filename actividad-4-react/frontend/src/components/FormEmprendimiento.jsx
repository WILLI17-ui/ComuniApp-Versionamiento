import { useReducer } from 'react';
import { CATEGORIAS } from '../api/servicios';

const VACIO = { nombre: '', descripcion: '', categoria: '', horario: '', whatsapp: '', imagenUrl: '' };

// useReducer maneja el formulario: valores, errores por campo y estado de envío en un solo lugar.
function formReducer(estado, accion) {
  switch (accion.type) {
    case 'CAMBIAR':
      return { ...estado, valores: { ...estado.valores, [accion.campo]: accion.valor },
        errores: { ...estado.errores, [accion.campo]: undefined } };
    case 'ENVIANDO':
      return { ...estado, enviando: true, errorGeneral: '' };
    case 'ERROR':
      return { ...estado, enviando: false, errores: accion.detalles ?? {}, errorGeneral: accion.mensaje };
    default:
      return estado;
  }
}

// Validación en el navegador (la API vuelve a validar; nunca se confía solo en el cliente).
export function validar(v) {
  const e = {};
  if (v.nombre.trim().length < 2) e.nombre = 'Escribe el nombre del emprendimiento.';
  if (v.descripcion.trim().length < 10) e.descripcion = 'Cuéntale a tus vecinos qué ofreces (mínimo 10 caracteres).';
  if (!v.categoria) e.categoria = 'Elige una categoría.';
  if (!/^[0-9]{10,15}$/.test(v.whatsapp.replace(/[\s()+-]/g, ''))) e.whatsapp = 'Escribe el número con indicativo, por ejemplo 573001234567.';
  if (v.imagenUrl && !/^https:\/\//i.test(v.imagenUrl)) e.imagenUrl = 'El enlace debe empezar por https://';
  return e;
}

export default function FormEmprendimiento({ inicial, textoBoton, onGuardar }) {
  const [estado, dispatch] = useReducer(formReducer, {
    valores: { ...VACIO, ...inicial }, errores: {}, enviando: false, errorGeneral: '',
  });
  const { valores, errores, enviando, errorGeneral } = estado;

  const cambiar = (e) => dispatch({ type: 'CAMBIAR', campo: e.target.name, valor: e.target.value });

  async function enviar(e) {
    e.preventDefault();
    const locales = validar(valores);
    if (Object.keys(locales).length) return dispatch({ type: 'ERROR', detalles: locales, mensaje: 'Revisa los campos marcados.' });
    dispatch({ type: 'ENVIANDO' });
    try {
      await onGuardar(valores);
    } catch (err) {
      dispatch({ type: 'ERROR', detalles: err.detalles, mensaje: err.mensaje });
    }
  }

  const campo = (name, label, props = {}) => (
    <div className="campo">
      <label htmlFor={name}>{label}</label>
      {props.as === 'textarea'
        ? <textarea id={name} name={name} value={valores[name]} onChange={cambiar} rows={4} aria-invalid={!!errores[name]} />
        : <input id={name} name={name} value={valores[name]} onChange={cambiar} aria-invalid={!!errores[name]} {...props} />}
      {errores[name] && <small className="campo__error">{errores[name]}</small>}
    </div>
  );

  return (
    <form className="formulario" onSubmit={enviar} noValidate>
      {errorGeneral && <div className="alerta alerta--error" role="alert">{errorGeneral}</div>}
      {campo('nombre', 'Nombre del emprendimiento', { maxLength: 80 })}
      {campo('descripcion', 'Descripción', { as: 'textarea' })}
      <div className="campo">
        <label htmlFor="categoria">Categoría</label>
        <select id="categoria" name="categoria" value={valores.categoria} onChange={cambiar} aria-invalid={!!errores.categoria}>
          <option value="">Selecciona...</option>
          {CATEGORIAS.map((c) => <option key={c.nombre} value={c.nombre}>{c.icono} {c.nombre}</option>)}
        </select>
        {errores.categoria && <small className="campo__error">{errores.categoria}</small>}
      </div>
      {campo('horario', 'Horario (opcional)', { placeholder: 'Ej. Lunes a sábado, 8 a. m. - 6 p. m.', maxLength: 80 })}
      {campo('whatsapp', 'WhatsApp', { inputMode: 'tel', placeholder: '573001234567' })}
      {campo('imagenUrl', 'Enlace de una foto (opcional)', { type: 'url', placeholder: 'https://...' })}
      <button className="boton" disabled={enviando}>{enviando ? 'Guardando...' : textoBoton}</button>
    </form>
  );
}
