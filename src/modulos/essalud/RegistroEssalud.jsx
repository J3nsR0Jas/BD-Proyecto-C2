import React, { useState } from 'react';

export default function RegistroEssalud() {
  const [formData, setFormData] = useState({
    dni: '',
    nombres: '',
    apellidos: '',
    especialidad: 'Medicina General',
    origenDenuncia: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Cita registrada exitosamente');
  };

  return (
    <div>
      <h2 className="essalud-title" style={{ fontSize: '20px', marginBottom: '16px' }}>
        Registro de Cita Ambulatoria
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="essalud-form-group">
          <label className="essalud-label">DNI Paciente</label>
          <input
            type="text"
            name="dni"
            maxLength={8}
            value={formData.dni}
            onChange={handleChange}
            className="essalud-input"
            required
          />
        </div>

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
            <select
              name="especialidad"
              value={formData.especialidad}
              onChange={handleChange}
              className="essalud-select"
            >
              <option value="Cirugía de Urgencia">Cirugía de Urgencia</option>
              <option value="Traumatología / Emergencias">Traumatología / Emergencias</option>
              <option value="Psicología de Apoyo">Psicología de Apoyo</option>
              <option value="Medicina General">Medicina General</option>
            </select>
          </div>
          <div className="essalud-form-group">
            <label className="essalud-label">Origen / Denuncia</label>
            <input
              type="text"
              name="origenDenuncia"
              placeholder="Ej. DEN-0003"
              value={formData.origenDenuncia}
              onChange={handleChange}
              className="essalud-input"
            />
          </div>
        </div>

        <button type="submit" className="essalud-btn-primary" style={{ marginTop: '8px' }}>
          Guardar Cita
        </button>
      </form>
    </div>
  );
}