// Reducer de la sesión: todas las transiciones de estado de autenticación pasan por aquí.
export const estadoInicial = { usuario: null, token: null, verificando: true };

export function authReducer(estado, accion) {
  switch (accion.type) {
    case 'SESION_INICIADA':
      return { usuario: accion.usuario, token: accion.token, verificando: false };
    case 'SESION_CERRADA':
      return { usuario: null, token: null, verificando: false };
    case 'VERIFICACION_TERMINADA':
      return { ...estado, verificando: false };
    default:
      throw new Error(`Acción desconocida: ${accion.type}`);
  }
}
