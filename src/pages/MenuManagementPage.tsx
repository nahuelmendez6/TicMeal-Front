import React, { useState } from 'react';
import ItemManagement from './ItemManagement';
import ItemIngredientManager from './ItemIngredientManager';
import MealShiftManager from '../components/MealShiftManager';
import ItemForm from '../components/menu/ItemForm'; // Import ItemForm
import { Plus } from 'lucide-react'; // Import Plus icon

const MenuManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('simple');
  const [showCompositeItemFormModal, setShowCompositeItemFormModal] = useState(false);
  const [selectedCompositeItem, setSelectedCompositeItem] = useState<any | null>(null); // To handle editing

  const handleOpenCompositeItemForm = () => {
    setSelectedCompositeItem(null); // For creation
    setShowCompositeItemFormModal(true);
  };

  const handleCloseCompositeItemForm = () => {
    setShowCompositeItemFormModal(false);
    setSelectedCompositeItem(null);
  };

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
    <div>
      <h1 className="mb-4">Gestión de Menú</h1>

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
            Ingredientes
          </button>
        </li>
      </ul>

      <div className="tab-content">
        {renderTabContent()}
      </div>

      {showCompositeItemFormModal && (
        <ItemForm
          item={selectedCompositeItem}
          onClose={handleCloseCompositeItemForm}
          itemType="COMPUESTO" // Ensure the form knows it's for composite items
        />
      )}
    </div>
  );
};

export default MenuManagementPage;