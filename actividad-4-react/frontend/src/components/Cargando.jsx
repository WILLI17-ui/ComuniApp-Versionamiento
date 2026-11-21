export default function Cargando({ texto = 'Cargando...' }) {
  return (
    <div className="cargando" role="status">
      <span className="cargando__circulo" aria-hidden="true" />
      {texto}
    </div>
  );
}

export function MensajeError({ mensaje, onReintentar }) {
  return (
    <div className="alerta alerta--error" role="alert">
      <p>{mensaje}</p>
      {onReintentar && <button className="boton boton--borde" onClick={onReintentar}>Reintentar</button>}
    </div>
  );
}
