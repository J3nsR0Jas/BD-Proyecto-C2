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

// 🔐 LISTA DE USUARIOS AUTORIZADOS (Máximo 2 por rol institucional)
const USUARIOS_AUTORIZADOS = {
  admin_mercado: [
    { email: 'admin1@mercado.pe', password: '123', nombre: 'Admin Principal Mercado' },
    { email: 'admin2@mercado.pe', password: '123', nombre: 'Sub-Administrador Mercado' }
  ],
  pnp: [
    { email: 'oficial1@pnp.gob.pe', password: '123', nombre: 'Cmdte. Carlos Mendoza (PNP)' },
    { email: 'oficial2@pnp.gob.pe', password: '123', nombre: 'Suboficial Ana Torres (PNP)' }
  ],
  essalud: [
    { email: 'medico1@essalud.gob.pe', password: '123', nombre: 'Dr. Roberto Silva (EsSalud)' },
    { email: 'medico2@essalud.gob.pe', password: '123', nombre: 'Dra. Elena Gómez (EsSalud)' }
  ]
};

// Configuración de los 4 módulos
const MODULOS_CONFIG = {
  cliente: {
    titulo: 'Comerciante',
    icono: '🛒',
    colorHex: '#10b981',
    btnGrad: 'linear-gradient(135deg, #10b981, #059669)',
    ruta: '/mercado/registro',
    moduloAuth: 'mercado',
    rolAuth: 'cliente',
    esRestringido: false // Acceso libre
  },
  admin_mercado: {
    titulo: 'Administrador Mercado',
    icono: '📊',
    colorHex: '#d97706',
    btnGrad: 'linear-gradient(135deg, #f59e0b, #d97706)',
    ruta: '/integracion/seguridad',
    moduloAuth: 'mercado',
    rolAuth: 'administrador',
    esRestringido: true // Solo 2 autorizados
  },
  pnp: {
    titulo: 'Oficial PNP',
    icono: '👮',
    colorHex: '#1d4ed8',
    btnGrad: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    ruta: '/pnp/panel',
    moduloAuth: 'pnp',
    rolAuth: 'policia',
    esRestringido: true // Solo 2 autorizados
  },
  essalud: {
    titulo: 'Médico EsSalud',
    icono: '🏥',
    colorHex: '#0369a1',
    btnGrad: 'linear-gradient(135deg, #0284c7, #0369a1)',
    ruta: '/essalud/panel',
    moduloAuth: 'essalud',
    rolAuth: 'medico',
    esRestringido: true // Solo 2 autorizados
  }
};

function LoginSimulado() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const [rolActivoModal, setRolActivoModal] = useState(null);
  const [tabActual, setTabActual] = useState('login');

  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorAuth, setErrorAuth] = useState(null);

  const abrirModalParaRol = (tipoRol) => {
    setRolActivoModal(tipoRol);
    setTabActual('login');
    setNombre('');
    setEmail('');
    setPassword('');
    setErrorAuth(null);
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setErrorAuth(null);

    const config = MODULOS_CONFIG[rolActivoModal];

    // 🔒 VALIDACIÓN PARA ROLES RESTRINGIDOS (Admin, PNP, EsSalud)
    if (config.esRestringido) {
      const listaPermitida = USUARIOS_AUTORIZADOS[rolActivoModal] || [];
      const usuarioValido = listaPermitida.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
      );

      if (!usuarioValido) {
        setErrorAuth('⛔ Acceso denegado: Credenciales no autorizadas para este módulo institucional.');
        return;
      }

      logout();
      const idUnicoValido = Math.floor((Date.now() % 1000000) + Math.random() * 1000);

      login({
        id: idUnicoValido,
        nombre: usuarioValido.nombre,
        email: usuarioValido.email,
        roles: [{ modulo: config.moduloAuth, rol: config.rolAuth }],
      });

      setRolActivoModal(null);
      navigate(config.ruta);
      return;
    }

    // 🛒 ACCESO LIBRE PARA COMERCIANTES (Login o Registro)
    logout();
    const idUnicoValido = Math.floor((Date.now() % 1000000) + Math.random() * 1000);
    const nombreFinal = nombre.trim() !== '' ? nombre : email.split('@')[0];

    login({
      id: idUnicoValido,
      nombre: nombreFinal,
      email: email,
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

      {/* Modal interactivo de Login / Registro */}
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

            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
              <span style={{ fontSize: '2.2rem' }}>{currentConfig.icono}</span>
              <h3 style={{ margin: '5px 0 0 0', color: currentConfig.colorHex }}>{currentConfig.titulo}</h3>
              {currentConfig.esRestringido && (
                <span style={{
                  display: 'inline-block',
                  marginTop: '6px',
                  fontSize: '0.75rem',
                  background: '#fef2f2',
                  color: '#dc2626',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontWeight: '700',
                  border: '1px solid #fecaca'
                }}>
                  🔒 Acceso Restringido (Solo Personal Autorizado)
                </span>
              )}
            </div>

            {/* Pestañas: Solo Comerciante tiene Registro libre */}
            {!currentConfig.esRestringido ? (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
                <button
                  type="button"
                  onClick={() => { setTabActual('login'); setErrorAuth(null); }}
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
                  onClick={() => { setTabActual('registro'); setErrorAuth(null); }}
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
            ) : null}

            {/* Mensaje de Error de Autorización */}
            {errorAuth && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #f87171',
                color: '#b91c1c',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: '600',
                marginBottom: '15px',
                textAlign: 'left'
              }}>
                {errorAuth}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="mercado-form">
              <div className="crumb" style={{ color: currentConfig.colorHex }}>
                {tabActual === 'login' ? `Acceso ${currentConfig.titulo}` : `Nuevo Registro ${currentConfig.titulo}`}
              </div>

              {tabActual === 'registro' && !currentConfig.esRestringido && (
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
                  placeholder={currentConfig.esRestringido ? 'correo.autorizado@institucion.pe' : 'comerciante@ejemplo.com'}
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

              {/* Ayuda visual con las cuentas autorizadas para tus pruebas / exposición */}
              {currentConfig.esRestringido && (
                <div style={{
                  background: '#f8fafc',
                  border: '1px dashed #cbd5e1',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  color: '#475569',
                  textAlign: 'left'
                }}>
                  <strong>Cuentas autorizadas (2 máx):</strong><br/>
                  • <code>{USUARIOS_AUTORIZADOS[rolActivoModal][0].email}</code> (clave: <code>123</code>)<br/>
                  • <code>{USUARIOS_AUTORIZADOS[rolActivoModal][1].email}</code> (clave: <code>123</code>)
                </div>
              )}

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