import { Link } from 'react-router-dom';

export function Terminos() {
  return (
    <section className="contenedor seccion texto">
      <h1>Términos y condiciones</h1>
      <p>ComuniApp es un directorio comunitario para dar a conocer los emprendimientos de los residentes de Ciudad La Salle Galet. La plataforma no vende productos ni interviene en los acuerdos entre vecinos: el contacto y la compra se hacen directamente con cada emprendedor.</p>
      <p>Cada emprendedor es responsable de que la información que publica sea veraz y de mantenerla actualizada. No se permite publicar contenido ofensivo, engañoso o ajeno a la oferta de productos y servicios.</p>
    </section>
  );
}

export function Privacidad() {
  return (
    <section className="contenedor seccion texto">
      <h1>Política de privacidad</h1>
      <p>Solo se piden los datos necesarios para publicar un emprendimiento: nombre, correo, contraseña (guardada cifrada) y el número de WhatsApp que el emprendedor decide mostrar.</p>
      <p>Los residentes que consultan el directorio no necesitan registrarse, por lo que no se recogen sus datos. Cada emprendedor puede editar o eliminar sus publicaciones desde su panel en cualquier momento.</p>
    </section>
  );
}

export function NoEncontrado() {
  return (
    <section className="contenedor seccion texto">
      <h1>Página no encontrada</h1>
      <p>La dirección no existe o fue cambiada.</p>
      <Link to="/" className="boton">Ir al inicio</Link>
    </section>
  );
}
