// src/pages/InventoryAuditPage.tsx
import React, { useState } from 'react';
import { useInventoryAudit } from '../hooks/useInventoryAudit';
import InventoryAuditTable from '../components/inventory/InventoryAuditTable';
// import Layout from '../components/Layout';
import ConfirmationModal from '../components/ConfirmationModal'; // Assuming a generic confirmation modal exists or will be created

const InventoryAuditPage: React.FC = () => {
  const {
    auditIngredients,
    observations,
    setObservations,
    isLoading,
    error,
    isSubmitting,
    handlePhysicalStockChange,
    submitAudit,
  } = useInventoryAudit();

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleConfirmAudit = async () => {
    const success = await submitAudit();
    if (success) {
      setShowConfirmModal(false);
      // Optionally show a success message
    }
  };

  const totalDifference = auditIngredients.reduce((sum, ing) => sum + ing.difference, 0);
  const totalFinancialImpact = auditIngredients.reduce((sum, ing) => sum + ing.financialImpact, 0);

  return (
    // <Layout>
      <div className="container-fluid mt-4">
        <div className="card">
          <div className="card-header">
            <h1 className="card-title mb-0">Auditoría de Inventario Físico</h1>
          </div>
          <div className="card-body">
            {isLoading && <div className="d-flex justify-content-center mt-5"><div className="spinner-border" role="status"><span className="visually-hidden">Cargando...</span></div></div>}
            {error && <div className="alert alert-danger mt-3">{error}</div>}

            {!isLoading && !error && (
              <>
                {/* Filter by category would go here */}
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
                  ingredients={auditIngredients}
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
                    disabled={isSubmitting || auditIngredients.some(ing => ing.physicalStock === '')}
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
          message="Al confirmar, los lotes de inventario se ajustarán automáticamente mediante el método FIFO (Primero en Entrar, Primero en Salir). Esta acción no se puede deshacer."
          onConfirm={handleConfirmAudit}
          onCancel={() => setShowConfirmModal(false)}
          confirmButtonText="Entendido, Confirmar"
          isConfirming={isSubmitting}
        />
      )}
      </div>


    // </Layout>
  );
};

export default InventoryAuditPage;
