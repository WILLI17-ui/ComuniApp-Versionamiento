import type { Metadata } from "next";
import { CORREO_CONTACTO, PaginaLegal, RESPONSABLE } from "@/components/Legal";

export const metadata: Metadata = { title: "Política de privacidad" };

export default function Privacidad() {
  return (
    <PaginaLegal titulo="Política de privacidad">
      <p>
        Esta política explica qué datos personales recoge ComuniApp, para qué los usa y cómo puedes pedir que se
        actualicen o eliminen, de acuerdo con la Ley 1581 de 2012 de protección de datos personales en Colombia.
      </p>
      <h2>1. Responsable del tratamiento</h2>
      <p>
        {RESPONSABLE} · Correo de contacto:{" "}
        <a href={`mailto:${CORREO_CONTACTO}`} className="font-semibold text-verde-800 underline">{CORREO_CONTACTO}</a>
      </p>
      <h2>2. Datos que se recogen</h2>
      <ul>
        <li><strong>Al registrarte:</strong> nombre completo, correo electrónico y contraseña (guardada cifrada).</li>
        <li><strong>Al publicar un emprendimiento:</strong> nombre, categoría, descripción, horario, número de WhatsApp y una foto opcional.</li>
        <li>La fecha y hora en que aceptaste estos términos y esta política, como prueba de tu autorización.</li>
      </ul>
      <p>Los residentes que solo consultan el directorio no necesitan cuenta y no entregan datos.</p>
      <h2>3. ¿Para qué se usan?</h2>
      <ul>
        <li>Permitirte iniciar sesión y administrar tus emprendimientos.</li>
        <li>Mostrar tu emprendimiento en el directorio para que los residentes te contacten.</li>
      </ul>
      <p>Tus datos no se venden ni se comparten con terceros para publicidad.</p>
      <h2>4. Información que será pública</h2>
      <p>
        El nombre, la categoría, la descripción, el horario, la foto y el número de WhatsApp de tu emprendimiento serán
        visibles para cualquier visitante. Tu correo y tu contraseña no se publican.
      </p>
      <h2>5. Tus derechos</h2>
      <ul>
        <li>Conocer, actualizar y corregir tus datos (puedes editar tu emprendimiento en cualquier momento).</li>
        <li>Pedir prueba de la autorización que diste.</li>
        <li>Pedir que se eliminen tus datos o tu cuenta.</li>
        <li>Presentar quejas ante la Superintendencia de Industria y Comercio.</li>
      </ul>
      <h2>6. ¿Cómo ejercerlos?</h2>
      <p>
        Escribe a{" "}
        <a href={`mailto:${CORREO_CONTACTO}`} className="font-semibold text-verde-800 underline">{CORREO_CONTACTO}</a>{" "}
        indicando tu nombre, el correo de tu cuenta y lo que necesitas. También puedes eliminar tus emprendimientos
        directamente desde “Mis emprendimientos”.
      </p>
    </PaginaLegal>
  );
}
