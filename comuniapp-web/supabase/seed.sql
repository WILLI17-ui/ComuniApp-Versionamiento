-- =====================================================================
-- ComuniApp - Datos de ejemplo (opcional)
-- 1. Primero crea en la app una cuenta de prueba, por ejemplo: demo@comuniapp.com
-- 2. Cambia el correo de la línea "where email = ..." si usaste otro
-- 3. Ejecuta este archivo en Supabase > SQL Editor
-- =====================================================================
insert into public.emprendimientos (owner_id, nombre, categoria, descripcion, horario, whatsapp)
select u.id, d.nombre, d.categoria, d.descripcion, d.horario, d.whatsapp
from auth.users u
cross join (values
  ('Tamales Doña Marta', 'Alimentos', 'Tamales tolimenses y lechona para fines de semana y festivos. Pedidos con un día de anticipación.', 'Sábados y domingos, 8:00 a. m. – 5:00 p. m.', '3001234567'),
  ('Mascotas Galet', 'Mascotas', 'Alimento, arena, juguetes y accesorios para perros y gatos. Entrega en tu torre sin costo.', 'Lunes a sábado, 9:00 a. m. – 7:00 p. m.', '3109876543'),
  ('Postres Caseros', 'Alimentos', 'Tortas, brownies y postres de tres leches hechos en casa. Se reciben encargos para cumpleaños.', 'Martes a domingo, 10:00 a. m. – 6:00 p. m.', '3157654321'),
  ('TechFix', 'Tecnología', 'Reparación de computadores y celulares, formateo e instalación de programas a domicilio.', 'Lunes a viernes, 6:00 p. m. – 9:00 p. m.', '3201112233'),
  ('Uñas by Caro', 'Belleza', 'Manicure, pedicure y uñas en gel. Atención con cita previa en el apartamento.', 'Miércoles a sábado, 2:00 p. m. – 8:00 p. m.', '3014445566'),
  ('Arreglos Don Jorge', 'Hogar', 'Plomería, electricidad básica, instalación de repisas y pequeños arreglos en el apartamento.', 'Todos los días, 7:00 a. m. – 5:00 p. m.', '3187778899')
) as d(nombre, categoria, descripcion, horario, whatsapp)
where u.email = 'demo@comuniapp.com';
