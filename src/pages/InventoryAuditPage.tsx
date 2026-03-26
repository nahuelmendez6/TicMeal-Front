// src/pages/InventoryAuditPage.tsx
import React, { useState } from 'react';
import { useInventoryAudit } from '../hooks/useInventoryAudit';
import InventoryAuditTable from '../components/inventory/InventoryAuditTable';
import ConfirmationModal from '../components/ConfirmationModal';
import type { AuditType } from '../types/inventory';

const InventoryAuditPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AuditType>('ingredient');
  const {
    auditableItems,
    observations,
    setObservations,
    isLoading,
    error,
    isSubmitting,
    handlePhysicalStockChange,
    submitAudit,
  } = useInventoryAudit(activeTab);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleConfirmAudit = async () => {
    const success = await submitAudit();
    if (success) {
      setShowConfirmModal(false);
    }
  };

  const totalDifference = auditableItems.reduce((sum, item) => sum + item.difference, 0);
  const totalFinancialImpact = auditableItems.reduce((sum, item) => sum + item.financialImpact, 0);

  return (
    <div className="container-fluid mt-4">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title mb-0">Auditoría de Inventario Físico</h1>
          <ul className="nav nav-tabs card-header-tabs mt-2">
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === 'ingredient' ? 'active' : ''}`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('ingredient');
                }}
              >
                Insumos
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === 'menu_item' ? 'active' : ''}`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('menu_item');
                }}
              >
                Items de Menú
              </a>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {isLoading && <div className="d-flex justify-content-center mt-5"><div className="spinner-border" role="status"><span className="visually-hidden">Cargando...</span></div></div>}
          {error && <div className="alert alert-danger mt-3">{error}</div>}

          {!isLoading && !error && (
            <>
              <div className="mb-3">
                <label htmlFor="observations" className="form-label">Observaciones Generales</label>
                <textarea
                  className="form-control"
                  id="observations"
                  rows={3}
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                ></textarea>
              </div>

              <InventoryAuditTable
                items={auditableItems}
                auditType={activeTab}
                onPhysicalStockChange={handlePhysicalStockChange}
              />

              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  <h5 className="mb-0">Diferencia Total: <span className={totalDifference < 0 ? 'text-danger' : (totalDifference > 0 ? 'text-success' : '')}>{totalDifference.toFixed(2)}</span></h5>
                  <h5 className="mb-0">Impacto Económico Total: <span className={totalFinancialImpact < 0 ? 'text-danger' : (totalFinancialImpact > 0 ? 'text-success' : '')}>${totalFinancialImpact.toFixed(2)}</span></h5>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowConfirmModal(true)}
                  disabled={isSubmitting || auditableItems.some(item => item.physicalStock === '')}
                >
                  {isSubmitting ? 'Confirmando...' : 'Confirmar Auditoría'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {showConfirmModal && (
        <ConfirmationModal
          title="Confirmar Auditoría de Inventario"
          message="Al confirmar, los lotes de inventario se ajustarán automáticamente. Esta acción no se puede deshacer."
          onConfirm={handleConfirmAudit}
          onCancel={() => setShowConfirmModal(false)}
          confirmButtonText="Entendido, Confirmar"
          isConfirming={isSubmitting}
        />
      )}
    </div>
  );
};

export default InventoryAuditPage;