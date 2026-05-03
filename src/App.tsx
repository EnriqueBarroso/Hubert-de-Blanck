import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import Home from './pages/Home';
import Obras from './pages/Obras';
import ObraDetalle from './pages/ObraDetalle';
import Equipo from './pages/Equipo';
import MiembroDetalle from './pages/MiembroDetalle';
import SobreLaCompania from './pages/SobreLaCompania';
import Login from './pages/Login';
import MiPerfil from './pages/MiPerfil';
import Admin from './pages/Admin';
import NoEncontrado from './pages/NoEncontrado';

export default function App() {
  return (
    <>
    <PWAInstallPrompt />
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/obras" element={<Obras />} />
        <Route path="/obras/:slug" element={<ObraDetalle />} />
        <Route path="/equipo" element={<Equipo />} />
        <Route path="/equipo/:slug" element={<MiembroDetalle />} />
        <Route path="/sobre-la-compania" element={<SobreLaCompania />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mi-perfil" element={<MiPerfil />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NoEncontrado />} />
      </Route>
    </Routes>
    </>
  );
}
