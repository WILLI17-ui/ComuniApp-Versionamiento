import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import RutaPrivada from './components/RutaPrivada';
import Cargando from './components/Cargando';
import Inicio from './pages/Inicio';

// Carga diferida (code splitting): cada página se descarga solo cuando el usuario la visita.
const Directorio = lazy(() => import('./pages/Directorio'));
const Detalle = lazy(() => import('./pages/Detalle'));
const Acceso = lazy(() => import('./pages/Acceso'));
const Panel = lazy(() => import('./pages/Panel'));
const EditorEmprendimiento = lazy(() => import('./pages/EditorEmprendimiento'));
const Terminos = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Terminos })));
const Privacidad = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Privacidad })));
const NoEncontrado = lazy(() => import('./pages/Legal').then((m) => ({ default: m.NoEncontrado })));

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<Cargando />}>
          <Routes>
            <Route element={<Layout />}>
              {/* Rutas públicas: el residente navega sin iniciar sesión */}
              <Route index element={<Inicio />} />
              <Route path="directorio" element={<Directorio />} />
              <Route path="emprendimientos/:id" element={<Detalle />} />
              <Route path="registro" element={<Acceso modo="registro" />} />
              <Route path="login" element={<Acceso modo="login" />} />
              <Route path="terminos" element={<Terminos />} />
              <Route path="privacidad" element={<Privacidad />} />

              {/* Rutas privadas: solo el emprendedor con sesión */}
              <Route path="panel" element={<RutaPrivada />}>
                <Route index element={<Panel />} />
                <Route path="nuevo" element={<EditorEmprendimiento />} />
                <Route path="editar/:id" element={<EditorEmprendimiento />} />
              </Route>

              <Route path="*" element={<NoEncontrado />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
