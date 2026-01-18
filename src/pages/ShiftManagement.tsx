import React, { useState } from 'react';
import ShiftCrud from '../components/ShiftCrud'; // Import the new ShiftCrud component
import ShiftMenuAssignment from '../pages/ShiftMenuAssignment'; // Import ShiftMenuAssignment

const ShiftManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'shiftCrud' | 'shiftMenuAssignment'>('shiftCrud');

  return (
    <div className="container-fluid">
      <h1 className="h3 mb-4 text-gray-800">Gestión de Turnos</h1>

      <ul className="nav nav-underline mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'shiftCrud' ? 'active' : ''}`}
            onClick={() => setActiveTab('shiftCrud')}
          >
            Gestión de Turnos
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'shiftMenuAssignment' ? 'active' : ''}`}
            onClick={() => setActiveTab('shiftMenuAssignment')}
          >
            Asignación de Menú a Turnos
          </button>
        </li>
      </ul>

      <div className="tab-content">
        {activeTab === 'shiftCrud' && (
          <div className="tab-pane fade show active">
            <ShiftCrud />
          </div>
        )}

        {activeTab === 'shiftMenuAssignment' && (
          <div className="tab-pane fade show active">
            <ShiftMenuAssignment />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShiftManagement;
