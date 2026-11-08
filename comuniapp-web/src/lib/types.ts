export const CATEGORIAS = [
  "Alimentos",
  "Mascotas",
  "Hogar",
  "Belleza",
  "Tecnología",
  "Segunda mano",
  "Otros",
] as const;

export type Categoria = (typeof CATEGORIAS)[number];

export const CATEGORIA_INFO: Record<Categoria, { icono: string; fondo: string; texto: string }> = {
  Alimentos: { icono: "🍲", fondo: "#FFF4E5", texto: "Comidas, postres y mercado" },
  Mascotas: { icono: "🐾", fondo: "#EAF4FF", texto: "Alimento, accesorios y cuidado" },
  Hogar: { icono: "🛠️", fondo: "#F1F5E9", texto: "Arreglos y servicios para la casa" },
  Belleza: { icono: "💅", fondo: "#FCEEF5", texto: "Peluquería, uñas y cuidado" },
  "Tecnología": { icono: "💻", fondo: "#EEF0FF", texto: "Reparación y soporte" },
  "Segunda mano": { icono: "♻️", fondo: "#ECF8F0", texto: "Artículos usados en buen estado" },
  Otros: { icono: "✨", fondo: "#F5F5F4", texto: "Otros productos y servicios" },
};

export type Emprendimiento = {
  id: string;
  owner_id: string;
  nombre: string;
  categoria: Categoria;
  descripcion: string;
  horario: string;
  whatsapp: string;
  foto_url: string | null;
  foto_path: string | null;
  created_at: string;
  updated_at: string;
};

export type EmprendimientoInput = {
  nombre: string;
  categoria: Categoria;
  descripcion: string;
  horario: string;
  whatsapp: string;
};

export type Usuario = {
  id: string;
  email: string;
  nombre: string;
};

export const FOTO_MAX_BYTES = 2 * 1024 * 1024;
export const FOTO_TIPOS = ["image/jpeg", "image/png"];

export function whatsappLink(numero: string, nombre: string) {
  const texto = encodeURIComponent(
    `Hola, vi tu emprendimiento "${nombre}" en ComuniApp y quisiera más información.`
  );
  return `https://wa.me/57${numero}?text=${texto}`;
}
