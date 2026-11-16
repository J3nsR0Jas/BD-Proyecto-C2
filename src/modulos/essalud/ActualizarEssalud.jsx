import React, { useState } from 'react';

export default function ActualizarEssalud() {
  const [dni, setDni] = useState('');
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    especialidad: '',
    estadoCita: 'PROGRAMADA'
  });

  const handleBuscar = (e) => {
    e.preventDefault();
    if (dni.length === 8) {
      setFormData({
        nombres: 'Paciente Lesionado',
        apellidos: 'PNP',
        especialidad: 'Cirugía de Urgencia',
        estadoCita: 'PROGRAMADA'
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGuardar = (e) => {
    e.preventDefault();
    alert('¡Registro actualizado con éxito!');
  };

  return (
    <div>
      <h2 className="essalud-title" style={{ fontSize: '20px', marginBottom: '16px' }}>
        Actualizar Datos de EsSalud
      </h2>

      <form onSubmit={handleBuscar} className="essalud-form-group">
        <label className="essalud-label">Buscar Asegurado por DNI</label>
        <div style={{ display: 'flex', gap: '8px', maxWidth: '400px' }}>
          <input
            type="text"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            maxLength={8}
            placeholder="Ingrese DNI"
            className="essalud-input"
          />
          <button type="submit" className="essalud-btn-primary">
            Buscar
          </button>
        </div>
      </form>

      <form onSubmit={handleGuardar}>
        <div className="essalud-grid">
          <div className="essalud-form-group">
            <label className="essalud-label">Nombres</label>
            <input
              type="text"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              className="essalud-input"
              required
            />
          </div>
          <div className="essalud-form-group">
            <label className="essalud-label">Apellidos</label>
            <input
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              className="essalud-input"
              required
            />
          </div>
        </div>

        <div className="essalud-grid">
          <div className="essalud-form-group">
            <label className="essalud-label">Especialidad</label>
            <input
              type="text"
              name="especialidad"
              value={formData.especialidad}
              onChange={handleChange}
              className="essalud-input"
            />
          </div>
          <div className="essalud-form-group">
            <label className="essalud-label">Estado Cita</label>
            <select
              name="estadoCita"
              value={formData.estadoCita}
              onChange={handleChange}
              className="essalud-select"
            >
              <option value="PROGRAMADA">PROGRAMADA</option>
              <option value="ATENDIDA">ATENDIDA</option>
              <option value="CANCELADA">CANCELADA</option>
            </select>
          </div>
        </div>

        <button type="submit" className="essalud-btn-primary" style={{ marginTop: '8px' }}>
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}