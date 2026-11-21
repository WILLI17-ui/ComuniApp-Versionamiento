import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Una sola página para login y registro: el modo llega por props desde la ruta.
export default function Acceso({ modo }) {
  const esRegistro = modo === 'registro';
  const { iniciarSesion, registrar } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [valores, setValores] = useState({ nombre: '', email: '', password: '', aceptaTerminos: false });
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cambiar = (e) => {
    const { name, value, type, checked } = e.target;
    setValores((v) => ({ ...v, [name]: type === 'checkbox' ? checked : value }));
    setErrores((er) => ({ ...er, [name]: undefined }));
  };

  async function enviar(e) {
    e.preventDefault();
    setEnviando(true);
    setMensaje('');
    try {
      if (esRegistro) await registrar(valores);
      else await iniciarSesion({ email: valores.email, password: valores.password });
      // Después de entrar, vuelve a la página protegida que intentó abrir, o al panel.
      navigate(location.state?.desde ?? '/panel', { replace: true });
    } catch (err) {
      setErrores(err.detalles ?? {});
      setMensaje(err.mensaje);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="contenedor seccion acceso">
      <h1>{esRegistro ? 'Publica tu emprendimiento' : 'Ingresa a tu panel'}</h1>
      <p className="ayuda">
        {esRegistro
          ? 'Solo los emprendedores necesitan cuenta. Para buscar y contactar negocios no hace falta registrarse.'
          : 'Esta sección es para emprendedores que ya tienen cuenta.'}
      </p>
      <form className="formulario" onSubmit={enviar} noValidate>
        {mensaje && <div className="alerta alerta--error" role="alert">{mensaje}</div>}
        {esRegistro && (
          <div className="campo">
            <label htmlFor="nombre">Tu nombre</label>
            <input id="nombre" name="nombre" value={valores.nombre} onChange={cambiar} autoComplete="name" aria-invalid={!!errores.nombre} />
            {errores.nombre && <small className="campo__error">{errores.nombre}</small>}
          </div>
        )}
        <div className="campo">
          <label htmlFor="email">Correo</label>
          <input id="email" name="email" type="email" value={valores.email} onChange={cambiar} autoComplete="email" aria-invalid={!!errores.email} />
          {errores.email && <small className="campo__error">{errores.email}</small>}
        </div>
        <div className="campo">
          <label htmlFor="password">Contraseña</label>
          <input id="password" name="password" type="password" value={valores.password} onChange={cambiar}
            autoComplete={esRegistro ? 'new-password' : 'current-password'} aria-invalid={!!errores.password} />
          {errores.password && <small className="campo__error">{errores.password}</small>}
        </div>
        {esRegistro && (
          <div className="campo campo--check">
            <input id="aceptaTerminos" name="aceptaTerminos" type="checkbox" checked={valores.aceptaTerminos} onChange={cambiar} />
            <label htmlFor="aceptaTerminos">
              Acepto los <Link to="/terminos" target="_blank">términos y condiciones</Link> y la{' '}
              <Link to="/privacidad" target="_blank">política de privacidad</Link>.
            </label>
            {errores.aceptaTerminos && <small className="campo__error">{errores.aceptaTerminos}</small>}
          </div>
        )}
        <button className="boton" disabled={enviando}>{enviando ? 'Enviando...' : esRegistro ? 'Crear cuenta' : 'Ingresar'}</button>
      </form>
      <p className="ayuda">
        {esRegistro ? <>¿Ya tienes cuenta? <Link to="/login">Ingresa</Link></> : <>¿Aún no tienes cuenta? <Link to="/registro">Regístrate</Link></>}
      </p>
    </section>
  );
}
