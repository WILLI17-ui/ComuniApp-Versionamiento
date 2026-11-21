// Enlace de WhatsApp con un mensaje inicial ya escrito.
export function enlaceWhatsApp(numero, nombreNegocio) {
  const limpio = String(numero).replace(/\D/g, '');
  const texto = encodeURIComponent(`Hola, vi "${nombreNegocio}" en ComuniApp y quiero más información.`);
  return `https://wa.me/${limpio}?text=${texto}`;
}

export const iniciales = (nombre = '') =>
  nombre.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('');
