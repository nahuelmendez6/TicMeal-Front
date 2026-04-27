import React, { useState } from 'react';
import { CalendarClock, ClipboardList, Settings2 } from 'lucide-react';
import DailyProductionLog from './DailyProductionLog';
import MenuPlanningTab from './MenuPlanningTab';
import TimeslotManager from './TimeslotManager';

const MealShiftManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('daily');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'daily':
        return <DailyProductionLog />;
      case 'planning':
        return <MenuPlanningTab />;
      case 'slots':
        return <TimeslotManager />;
      default:
        return <DailyProductionLog />;
    }
  };

  return (
    <div>
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link d-flex align-items-center ${activeTab === 'daily' ? 'active' : ''}`}
            onClick={() => setActiveTab('daily')}
          >
            <ClipboardList size={18} className="me-2" />
            Producción Diaria
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link d-flex align-items-center ${activeTab === 'planning' ? 'active' : ''}`}
            onClick={() => setActiveTab('planning')}
          >
            <CalendarClock size={18} className="me-2" />
            Planificación (Menús)
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link d-flex align-items-center ${activeTab === 'slots' ? 'active' : ''}`}
            onClick={() => setActiveTab('slots')}
          >
            <Settings2 size={18} className="me-2" />
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
