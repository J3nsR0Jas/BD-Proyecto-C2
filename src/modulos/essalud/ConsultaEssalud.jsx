import React, { useState } from 'react';

export default function ConsultaEssalud() {
  const [dniBusqueda, setDniBusqueda] = useState('');
  const [resultado, setResultado] = useState(null);

  const handleBuscar = (e) => {
    e.preventDefault();
    setResultado({
      codigoCita: 'CES-030',
      paciente: 'Paciente Lesionado PNP',
      especialidad: 'Cirugía de Urgencia',
      origen: 'DEN-0003 (Hubo peleas entre comerciantes...)',
      estado: 'ATENDIDA',
      centroMedico: 'Hospital Edgardo Rebagliati Martins'
    });
  };

  return (
    <div>
      <h2 className="essalud-title" style={{ fontSize: '20px' }}>
        Consultar Acreditación / Citas EsSalud
      </h2>

      <form onSubmit={handleBuscar} style={{ marginTop: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="Ingrese número de DNI"
            value={dniBusqueda}
            onChange={(e) => setDniBusqueda(e.target.value)}
            maxLength={8}
            className="essalud-input"
            required
          />
          <button type="submit" className="essalud-btn-primary">
            Buscar
          </button>
        </div>
      </form>

      {resultado && (
        <div className="essalud-result-box">
          <p><strong>Código Cita:</strong> {resultado.codigoCita}</p>
          <p><strong>Paciente:</strong> {resultado.paciente}</p>
          <p><strong>Especialidad:</strong> {resultado.especialidad}</p>
          <p><strong>Origen / Denuncia:</strong> {resultado.origen}</p>
          <p><strong>Estado:</strong> <strong>{resultado.estado}</strong></p>
          <p><strong>Centro Médico:</strong> {resultado.centroMedico}</p>
        </div>
      )}
    </div>
  );
}