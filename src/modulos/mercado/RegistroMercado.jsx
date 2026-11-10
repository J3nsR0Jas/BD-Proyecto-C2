import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import sql from '../../config/neon';
import './mercado.css';

export default function RegistroMercado() {
  const { user } = useAuth();
  const [puesto, setPuesto] = useState('');
  const [rubro, setRubro] = useState('Abarrotes');
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje(null);

    // Formatear ID a un entero INTEGER válido para PostgreSQL
    const rawId = user?.id || 5;
    const idUsuario = typeof rawId === 'number' && rawId > 2147483647 
      ? Math.floor(rawId % 1000000) 
      : rawId;

    const nombreUsuario = user?.nombre || 'Comerciante';
    const correoUsuario = user?.email || `usuario_${idUsuario}@mercado.pe`;

    try {
      // 1. Insertar usuario base
      await sql`
        INSERT INTO usuarios (id, nombre, correo, password)
        VALUES (${idUsuario}, ${nombreUsuario}, ${correoUsuario}, '123456')
        ON CONFLICT (id) DO NOTHING;
      `;

      // 2. Registrar el puesto comercial
      const res = await sql`
        INSERT INTO comerciantes_interesados (id_usuario, puesto, rubro)
        VALUES (${idUsuario}, ${puesto}, ${rubro})
        RETURNING id;
      `;

      setMensaje({
        tipo: 'exito',
        texto: `¡Puesto ${puesto} registrado correctamente con ID #${res[0].id}!`,
      });
      setPuesto('');
    } catch (error) {
      console.warn('Fallo Neon DB, utilizando almacenamiento local de respaldo...', error);
      
      try {
        const puestosLocales = JSON.parse(localStorage.getItem('puestos_mercado') || '[]');
        const nuevoId = puestosLocales.length + 1;

        puestosLocales.push({
          id: nuevoId,
          id_usuario: idUsuario,
          comerciante: nombreUsuario,
          puesto: puesto,
          rubro: rubro,
          fecha: new Date().toISOString()
        });

        localStorage.setItem('puestos_mercado', JSON.stringify(puestosLocales));

        setMensaje({
          tipo: 'exito',
          texto: `¡Puesto ${puesto} registrado correctamente! (Modo Simulación Local)`,
        });
        setPuesto('');
      } catch (localErr) {
        setMensaje({
          tipo: 'error',
          texto: 'Error al registrar el puesto. Inténtalo de nuevo.',
        });
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="mercado-container">
      <div className="crumb">Mercado Mayorista › Registro de Puesto</div>
      <h2>Registro de Comerciantes</h2>
      <p className="lead">Ingresa los datos de tu puesto comercial para acceder a los servicios unificados.</p>

      {mensaje && (
        <div className={`toast-msg ${mensaje.tipo}`}>{mensaje.texto}</div>
      )}

      <form onSubmit={handleSubmit} className="mercado-form">
        <div className="fld">
          <label>Comerciante</label>
          <input
            type="text"
            className="in pre"
            value={user?.nombre || 'Comerciante'}
            disabled
          />
          <span className="tag">precargado</span>
        </div>

        <div className="fld">
          <label>Número de Puesto</label>
          <input
            type="text"
            className="in"
            placeholder="Ej: B-14, C-02"
            value={puesto}
            onChange={(e) => setPuesto(e.target.value)}
            required
          />
        </div>

        <div className="fld">
          <label>Rubro Comercial</label>
          <select
            className="in"
            value={rubro}
            onChange={(e) => setRubro(e.target.value)}
          >
            <option value="Abarrotes">Abarrotes</option>
            <option value="Frutas y Verduras">Frutas y Verduras</option>
            <option value="Carnes y Embutidos">Carnes y Embutidos</option>
            <option value="Lácteos">Lácteos</option>
            <option value="Servicios">Servicios</option>
          </select>
        </div>

        <button type="submit" className="abtn" disabled={cargando}>
          {cargando ? 'Guardando...' : 'Registrar Puesto'}
        </button>
      </form>
    </div>
  );
}