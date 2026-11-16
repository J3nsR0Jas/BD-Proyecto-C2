import React, { useState } from 'react';
import RegistroEssalud from './RegistroEssalud';
import ConsultaEssalud from './ConsultaEssalud';
import ActualizarEssalud from './ActualizarEssalud';
import './essalud.css';

export default function PanelEssalud() {
  const [vista, setVista] = useState('consulta');

  return (
    <div className="essalud-container">
      {/* Tarjeta de cabecera */}
      <div className="essalud-card">
        <div className="essalud-tag">MÓDULO ESSALUD › GESTIÓN DE CITAS</div>
        <h1 className="essalud-title">Panel Ambulatorio EsSalud</h1>
        <p className="essalud-subtitle">
          Control de citas programadas y derivadas por incidentes del Mercado Mayorista.
        </p>
      </div>

      {/* Botones de navegación */}
      <div className="essalud-tabs">
        <button
          type="button"
          onClick={() => setVista('consulta')}
          className={`essalud-tab-btn ${vista === 'consulta' ? 'active' : ''}`}
        >
          Consultar Acreditación
        </button>
        <button
          type="button"
          onClick={() => setVista('registro')}
          className={`essalud-tab-btn ${vista === 'registro' ? 'active' : ''}`}
        >
          Nuevo Registro / Cita
        </button>
        <button
          type="button"
          onClick={() => setVista('actualizar')}
          className={`essalud-tab-btn ${vista === 'actualizar' ? 'active' : ''}`}
        >
          Actualizar Datos
        </button>
      </div>

      {/* Renderizado condicional */}
      <div className="essalud-card">
        {vista === 'consulta' && <ConsultaEssalud />}
        {vista === 'registro' && <RegistroEssalud />}
        {vista === 'actualizar' && <ActualizarEssalud />}
      </div>
    </div>
  );
}