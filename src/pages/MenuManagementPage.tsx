import React, { useState } from 'react';
import ItemManagement from './ItemManagement';
import ItemIngredientManager from './ItemIngredientManager';
import MealShiftManager from '../components/MealShiftManager';
import PageLayout from '../components/common/PageLayout';

const MenuManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('simple');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'simple':
        return <ItemManagement itemType="SIMPLE" />;
      case 'production':
        return (
          <div className="d-flex flex-column gap-4">
            <MealShiftManager />
            <hr />
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="mb-0">Gestión de Productos Compuestos</h3>
              {/* <button className="btn btn-primary d-flex align-items-center" onClick={handleOpenCompositeItemForm}>
                <Plus size={20} className="me-2" />
                Nuevo Producto Compuesto
              </button> */}
            </div>
            <ItemManagement itemType="COMPUESTO" />
          </div>
        );
      case 'ingredients':
        return <ItemIngredientManager />;
      default:
        return <ItemManagement itemType="SIMPLE" />;
    }
  };

  return (
    <PageLayout title="Gestión de Menú">
      <ul className="nav nav-underline mb-3">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'simple' ? 'active' : ''}`} onClick={() => setActiveTab('simple')}>
            Productos Simples
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'production' ? 'active' : ''}`} onClick={() => setActiveTab('production')}>
            Producción
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'ingredients' ? 'active' : ''}`} onClick={() => setActiveTab('ingredients')}>
            Insumos
          </button>
        </li>
      </ul>

      <div className="tab-content">
        {renderTabContent()}
      </div>
    </PageLayout>
  );
};

export default MenuManagementPage;