import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MenuRoles from './components/MenuRoles';
import RutaProtegida from './components/RutaProtegida';
import Footer from './components/Footer';

// Módulo Mercado
import RegistroMercado from './modulos/mercado/RegistroMercado';
import PanelMercado from './modulos/mercado/PanelMercado';

// Módulo PNP
import PanelPNP from './modulos/pnp/PanelPNP';

// Módulo EsSalud
import PanelEssalud from './modulos/essalud/PanelEssalud';

// Integraciones
import DenunciaPuesto from './integraciones/DenunciaPuesto';
import DerivarEssalud from './integraciones/DerivarEssalud';
import ReporteSeguridad from './integraciones/ReporteSeguridad';

// Configuración de los 4 módulos
const MODULOS_CONFIG = {
  cliente: {
    titulo: 'Comerciante',
    icono: '🛒',
    colorHex: '#10b981',
    btnGrad: 'linear-gradient(135deg, #10b981, #059669)',
    ruta: '/mercado/registro',
    moduloAuth: 'mercado',
    rolAuth: 'cliente'
  },
  admin_mercado: {
    titulo: 'Administrador Mercado',
    icono: '📊',
    colorHex: '#d97706',
    btnGrad: 'linear-gradient(135deg, #f59e0b, #d97706)',
    ruta: '/integracion/seguridad',
    moduloAuth: 'mercado',
    rolAuth: 'administrador'
  },
  pnp: {
    titulo: 'Oficial PNP',
    icono: '👮',
    colorHex: '#1d4ed8',
    btnGrad: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    ruta: '/pnp/panel',
    moduloAuth: 'pnp',
    rolAuth: 'policia'
  },
  essalud: {
    titulo: 'Médico EsSalud',
    icono: '🏥',
    colorHex: '#0369a1',
    btnGrad: 'linear-gradient(135deg, #0284c7, #0369a1)',
    ruta: '/essalud/panel',
    moduloAuth: 'essalud',
    rolAuth: 'medico'
  }
};

function LoginSimulado() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  // Control del modal de autenticación interactivo
  const [rolActivoModal, setRolActivoModal] = useState(null); // 'cliente', 'admin_mercado', 'pnp', 'essalud'
  const [tabActual, setTabActual] = useState('login'); // 'login' o 'registro'

  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const abrirModalParaRol = (tipoRol) => {
    setRolActivoModal(tipoRol);
    setTabActual('login');
    setNombre('');
    setEmail('');
    setPassword('');
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    logout();

    const config = MODULOS_CONFIG[rolActivoModal];
    const idUnicoValido = Math.floor((Date.now() % 1000000) + Math.random() * 1000);
    const nombreFinal = nombre.trim() !== '' ? nombre : config.titulo;

    login({
      id: idUnicoValido,
      nombre: nombreFinal,
      email: email || `${rolActivoModal}@mercado.pe`,
      roles: [{ modulo: config.moduloAuth, rol: config.rolAuth }],
    });

    setRolActivoModal(null);
    navigate(config.ruta);
  };

  const handleReset = () => {
    logout();
    localStorage.clear();
    window.location.reload();
  };

  const currentConfig = rolActivoModal ? MODULOS_CONFIG[rolActivoModal] : null;

  return (
    <div className="landing-wrapper">
      <div className="landing-header">
        <div className="shield-icon">🛡️</div>
        <h1>Mercado Seguro · Grupo 4</h1>
        <p>Plataforma Unificada Multi-Módulo (Mercado Mayorista · PNP Central · EsSalud)</p>
      </div>

      {/* Rejilla de 4 Módulos Separados */}
      <div className="modules-grid">
        <button 
          type="button" 
          className="module-card comerciante" 
          onClick={() => abrirModalParaRol('cliente')}
        >
          <span className="icon">🛒</span>
          <h3>Comerciante</h3>
        </button>

        <button 
          type="button" 
          className="module-card admin" 
          onClick={() => abrirModalParaRol('admin_mercado')}
        >
          <span className="icon">📊</span>
          <h3>Administrador Mercado</h3>
        </button>

        <button 
          type="button" 
          className="module-card pnp" 
          onClick={() => abrirModalParaRol('pnp')}
        >
          <span className="icon">👮</span>
          <h3>Oficial PNP</h3>
        </button>

        <button 
          type="button" 
          className="module-card essalud" 
          onClick={() => abrirModalParaRol('essalud')}
        >
          <span className="icon">🏥</span>
          <h3>Médico EsSalud</h3>
        </button>
      </div>

      <div className="reset-container">
        <button type="button" className="btn-reset" onClick={handleReset}>
          🔄 Reiniciar Estado / Cerrar Sesiones Atascadas
        </button>
      </div>

      {/* Modal interactivo de Login / Registro para CADA módulo */}
      {rolActivoModal && currentConfig && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="mercado-container" style={{ maxWidth: '450px', width: '90%', margin: 0, position: 'relative' }}>
            
            <button 
              onClick={() => setRolActivoModal(null)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                fontSize: '1.4rem',
                cursor: 'pointer',
                color: '#64748b'
              }}
            >
              ✕
            </button>

            <div style={{ textAlignment: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '2rem' }}>{currentConfig.icono}</span>
              <h3 style={{ margin: '5px 0 0 0', color: currentConfig.colorHex }}>{currentConfig.titulo}</h3>
            </div>

            {/* Carrusel / Pestañas */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
              <button
                type="button"
                onClick={() => setTabActual('login')}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '700',
                  cursor: 'pointer',
                  background: tabActual === 'login' ? '#ffffff' : 'transparent',
                  color: tabActual === 'login' ? currentConfig.colorHex : '#64748b',
                  boxShadow: tabActual === 'login' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                🔑 Iniciar Sesión
              </button>

              <button
                type="button"
                onClick={() => setTabActual('registro')}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '700',
                  cursor: 'pointer',
                  background: tabActual === 'registro' ? '#ffffff' : 'transparent',
                  color: tabActual === 'registro' ? currentConfig.colorHex : '#64748b',
                  boxShadow: tabActual === 'registro' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                📝 Registrarse
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="mercado-form">
              <div className="crumb" style={{ color: currentConfig.colorHex }}>
                {tabActual === 'login' ? `Acceso ${currentConfig.titulo}` : `Registro ${currentConfig.titulo}`}
              </div>

              {tabActual === 'registro' && (
                <div className="fld">
                  <label>Nombre Completo:</label>
                  <input
                    type="text"
                    className="in"
                    placeholder="Ej. Juan Pérez"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="fld">
                <label>Correo Electrónico:</label>
                <input
                  type="email"
                  className="in"
                  placeholder="usuario@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="fld">
                <label>Contraseña:</label>
                <input
                  type="password"
                  className="in"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="abtn" 
                style={{ 
                  marginTop: '10px', 
                  width: '100%',
                  background: currentConfig.btnGrad
                }}
              >
                {tabActual === 'login' ? `Ingresar como ${currentConfig.titulo}` : `Crear Cuenta e Ingresar`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <MenuRoles />
          
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/login" element={<LoginSimulado />} />

              {/* Módulo Mercado */}
              <Route element={<RutaProtegida modulo="mercado" />}>
                <Route path="/mercado/registro" element={<RegistroMercado />} />
                <Route path="/mercado/panel" element={<PanelMercado />} />
              </Route>

              {/* Módulo PNP */}
              <Route element={<RutaProtegida modulo="pnp" />}>
                <Route path="/pnp/panel" element={<PanelPNP />} />
              </Route>

              {/* Módulo EsSalud */}
              <Route element={<RutaProtegida modulo="essalud" />}>
                <Route path="/essalud/panel" element={<PanelEssalud />} />
              </Route>

              {/* Integraciones */}
              <Route element={<RutaProtegida modulo="mercado" rol="cliente" />}>
                <Route path="/integracion/denuncia" element={<DenunciaPuesto />} />
              </Route>
              <Route element={<RutaProtegida modulo="pnp" rol="policia" />}>
                <Route path="/integracion/derivar" element={<DerivarEssalud />} />
              </Route>
              <Route element={<RutaProtegida modulo="mercado" rol="administrador" />}>
                <Route path="/integracion/seguridad" element={<ReporteSeguridad />} />
              </Route>

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}