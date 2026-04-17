import React, { useState } from 'react';
import DailyProductionLog from './DailyProductionLog';

const MealShiftManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('daily');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'daily':
        return <DailyProductionLog />;
      case 'planning':
        return (
          <div className="text-center p-5">
            <h3>Planificación de Menús</h3>
            <p className="text-muted">Módulo de planificación en desarrollo.</p>
          </div>
        );
      case 'slots':
        return (
          <div className="text-center p-5">
            <h3>Configuración de Slots</h3>
            <p className="text-muted">Módulo de slots de entrega en desarrollo.</p>
          </div>
        );
      default:
        return <DailyProductionLog />;
    }
  };

  return (
    <div>
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'daily' ? 'active' : ''}`}
            onClick={() => setActiveTab('daily')}
          >
            Producción Diaria
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'planning' ? 'active' : ''}`}
            onClick={() => setActiveTab('planning')}
          >
            Planificación (Menús)
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'slots' ? 'active' : ''}`}
            onClick={() => setActiveTab('slots')}
          >
            Configuración de Slots
          </button>
        </li>
      </ul>

      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default MealShiftManager;
