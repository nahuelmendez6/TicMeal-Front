// src/pages/ProductionPlanPage.tsx
import React, { useState, useEffect } from 'react';
import PageLayout from '../components/common/PageLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'; // Play icon for trigger
import { useProduction } from '../hooks/useProduction';
import Table from '../components/common/Table'; // Assuming this will be used for picking list
import { type PickingList } from '../services/production.service'; // Import PickingList type

const getLocalDate = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const localDate = new Date(today.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().split('T')[0];
};

const ProductionPlanPage: React.FC = () => {
  const [filterDate, setFilterDate] = useState<string>(getLocalDate());
  const { pickingList, isLoading, error, fetchPickingList, triggerManualPlan } = useProduction();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchPickingList(filterDate);
  }, [filterDate, fetchPickingList]);

  const changeDate = (days: number) => {
    const date = new Date(filterDate);
    date.setUTCDate(date.getUTCDate() + days);
    setFilterDate(date.toISOString().split('T')[0]);
  };

  const handleTriggerManualPlan = async () => {
    if (window.confirm(`¿Está seguro de que desea generar el plan de producción para el día ${filterDate}?`)) {
      setSuccessMessage(null);
      const result = await triggerManualPlan(filterDate);
      if (result) {
        setSuccessMessage(`Plan de producción generado con éxito para el ${filterDate}.`);
        fetchPickingList(filterDate); // Refresh the picking list
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    }
  };

  const pickingListColumns = [
    { header: 'Ingrediente', accessor: 'ingredientName' },
    { header: 'Cantidad Requerida', accessor: 'requiredQuantity' },
    { header: 'Cantidad Recogida', accessor: 'pickedQuantity' },
    // Add more columns as needed, e.g., 'unit' for ingredient
  ];

  const pickingListData = pickingList?.pickingListItems.map(item => ({
    ...item,
    ingredientName: item.ingredient?.name || 'N/A',
  })) || [];


  return (
    <PageLayout title="Gestión de Planificación de Producción">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Planificación de Producción Diaria</h2>
        <Button onClick={handleTriggerManualPlan} disabled={isLoading}>
          <Play size={20} className="me-2" />
          {isLoading ? 'Generando...' : 'Generar Plan Manual'}
        </Button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <div className="row">
        <div className="col-12">
          <Card>
            <div className="card-header d-flex justify-content-between align-items-center bg-white p-3">
              <h5 className="mb-0 h6">Lista de Recogida para:</h5>
              <div className="d-flex align-items-center">
                <Button variant="outline-secondary" size="sm" onClick={() => changeDate(-1)} title="Día anterior" className="me-2">
                  <ChevronLeft size={16} />
                </Button>
                <input
                  type="date"
                  className="form-control form-control-sm mx-2"
                  style={{ width: 'auto' }}
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
                <Button variant="outline-secondary" size="sm" onClick={() => changeDate(1)} title="Día siguiente">
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
            <div className="card-body p-0">
              {isLoading && !pickingList ? (
                <div className="text-center p-4">Cargando lista de recogida...</div>
              ) : pickingListData.length === 0 ? (
                <div className="text-center p-4 text-muted">No hay lista de recogida para esta fecha.</div>
              ) : (
                <Table
                  columns={pickingListColumns}
                  data={pickingListData}
                />
              )}
            </div>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProductionPlanPage;
