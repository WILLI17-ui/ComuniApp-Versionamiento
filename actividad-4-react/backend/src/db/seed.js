import bcrypt from 'bcryptjs';
import { pool } from './pool.js';

// Datos de EJEMPLO para probar la interfaz (no son emprendimientos reales del conjunto).
const email = 'demo@comuniapp.co';
const hash = await bcrypt.hash('demo12345', 10);

const { rows } = await pool.query(
  `insert into a4_emprendedores (nombre, email, password_hash, acepta_terminos)
   values ('Cuenta de demostración', $1, $2, true)
   on conflict (email) do update set nombre = excluded.nombre returning id`,
  [email, hash],
);
const id = rows[0].id;
await pool.query('delete from a4_emprendimientos where emprendedor_id = $1', [id]);

const ejemplos = [
  ['Arepas de la casa (ejemplo)', 'Arepas rellenas de queso, pollo o carne. Pedidos con un día de anticipación.', 'Alimentos', 'Lunes a sábado, 7:00 a. m. - 12:00 m.'],
  ['Paseo de perros (ejemplo)', 'Paseos de 45 minutos dentro y alrededor del conjunto. Grupos pequeños.', 'Mascotas', 'Todos los días, 6:00 - 9:00 a. m.'],
  ['Arreglos del hogar (ejemplo)', 'Instalación de cortinas, repisas, lámparas y arreglos de plomería sencillos.', 'Hogar', 'Fines de semana'],
  ['Uñas a domicilio (ejemplo)', 'Manicure y pedicure en tu apartamento. Llevo todos los materiales.', 'Belleza', 'Martes a sábado, con cita'],
  ['Soporte de computadores (ejemplo)', 'Formateo, limpieza y configuración de equipos e impresoras.', 'Tecnología', 'Noches y fines de semana'],
  ['Ropa de bebé usada (ejemplo)', 'Ropa en buen estado de 0 a 24 meses, se puede ver antes de comprar.', 'Segunda mano', null],
];
for (const [nombre, descripcion, categoria, horario] of ejemplos) {
  await pool.query(
    `insert into a4_emprendimientos (emprendedor_id, nombre, descripcion, categoria, horario, whatsapp)
     values ($1,$2,$3,$4,$5,'573000000000')`,
    [id, nombre, descripcion, categoria, horario],
  );
}
console.log(`Datos de ejemplo cargados. Cuenta demo: ${email} / demo12345`);
await pool.end();
