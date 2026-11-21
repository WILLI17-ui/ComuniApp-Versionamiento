import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { autenticado, usuario, cerrarSesion } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { pathname } = useLocation();

  // Cerrar el menú móvil al cambiar de página: se guarda la ruta en que se abrió.
  const [rutaMenu, setRutaMenu] = useState(pathname);
  if (rutaMenu !== pathname) {
    setRutaMenu(pathname);
    setMenuAbierto(false);
  }

  return (
    <>
      <a href="#contenido" className="saltar">Saltar al contenido</a>
      <header className="cabecera">
        <div className="contenedor cabecera__fila">
          <Link to="/" className="logo">Comuni<span>App</span></Link>
          <button className="menu-boton" aria-expanded={menuAbierto} aria-controls="menu"
            onClick={() => setMenuAbierto((v) => !v)} aria-label="Abrir menú">☰</button>
          <nav id="menu" className={`menu ${menuAbierto ? 'menu--abierto' : ''}`}>
            <NavLink to="/" end>Inicio</NavLink>
            <NavLink to="/directorio">Directorio</NavLink>
            {autenticado ? (
              <>
                <NavLink to="/panel">Mi panel</NavLink>
                <button className="enlace" onClick={cerrarSesion}>Cerrar sesión ({usuario.nombre.split(' ')[0]})</button>
              </>
            ) : (
              <>
                <NavLink to="/login">Ingresar</NavLink>
                <Link to="/registro" className="boton boton--claro">Publicar mi emprendimiento</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main id="contenido">
        <Outlet />
      </main>
      <footer className="pie">
        <div className="contenedor">
          <p>ComuniApp · Emprendimientos de Ciudad La Salle Galet</p>
          <p><Link to="/terminos">Términos y condiciones</Link> · <Link to="/privacidad">Política de privacidad</Link></p>
          <p className="pie__nota">Proyecto académico · Corporación Universitaria Iberoamericana</p>
        </div>
      </footer>
    </>
  );
}
