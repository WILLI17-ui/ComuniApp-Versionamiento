import type { Metadata } from "next";
import { CORREO_CONTACTO, PaginaLegal, RESPONSABLE } from "@/components/Legal";

export const metadata: Metadata = { title: "Términos y condiciones" };

export default function Terminos() {
  return (
    <PaginaLegal titulo="Términos y condiciones">
      <p>
        Al crear una cuenta en ComuniApp aceptas estas condiciones. Son pocas y están escritas en lenguaje sencillo.
      </p>
      <h2>1. ¿Qué es ComuniApp?</h2>
      <p>
        Es un directorio web, creado como proyecto académico, donde los emprendedores del conjunto Ciudad La Salle Galet
        publican sus productos y servicios para que los residentes los encuentren y los contacten por WhatsApp.
      </p>
      <h2>2. ComuniApp solo publica la información</h2>
      <p>
        ComuniApp no vende, no cobra y no participa en las ventas ni en los pagos entre vecinos. Los acuerdos de precio,
        entrega y calidad son responsabilidad del emprendedor y del residente que lo contacta.
      </p>
      <h2>3. Compromisos del emprendedor</h2>
      <ul>
        <li>Publicar información verdadera sobre su emprendimiento, su horario y su número de WhatsApp.</li>
        <li>Subir solo fotos propias o que tenga permiso de usar.</li>
        <li>No publicar productos ilegales, contenido ofensivo ni información de otras personas.</li>
        <li>Mantener su información actualizada o eliminar el emprendimiento cuando ya no lo ofrezca.</li>
      </ul>
      <h2>4. Datos públicos</h2>
      <p>
        El nombre, la categoría, la descripción, el horario, la foto y el número de WhatsApp de cada emprendimiento serán
        visibles para cualquier persona que visite ComuniApp. El correo y la contraseña nunca se muestran.
      </p>
      <h2>5. Retiro de publicaciones</h2>
      <p>
        Se podrá retirar cualquier publicación que incumpla estas condiciones. Para reportar un problema escribe a{" "}
        <a href={`mailto:${CORREO_CONTACTO}`} className="font-semibold text-verde-800 underline">{CORREO_CONTACTO}</a>.
      </p>
      <h2>6. Responsable</h2>
      <p>
        Responsable del sitio: {RESPONSABLE}. El tratamiento de los datos personales se explica en la Política de
        privacidad.
      </p>
    </PaginaLegal>
  );
}
