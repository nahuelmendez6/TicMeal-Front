// src/pages/InventoryVariancePage.tsx
import React, { useState } from 'react';
// import Layout from '../components/Layout';
import { useInventoryVarianceReport } from '../hooks/useInventoryVarianceReport';
import DateRangePicker from '../components/DateRangePicker'; // Assuming a generic DateRangePicker component
import type { InventoryVariance } from '../types/inventory';

const InventoryVariancePage: React.FC = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const { reportData, isLoading, error, fetchReport } = useInventoryVarianceReport();

  const handleDateRangeChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      fetchReport(start, end);
    }
  };

  const totalMonetaryVariance = reportData.reduce((sum, item) => sum + item.totalVarianceValue, 0);
  const frequencyOfAdjustments = reportData.length;

  const handleDownloadReport = () => {
    // Simulate report download
    alert('Simulando descarga de reporte...');
    console.log('Report data:', reportData);
  };

  return (
    // <Layout>
      <div className="container-fluid mt-4">
        <div className="card">
          <div className="card-header">
            <h1 className="card-title mb-0">Dashboard de Varianza de Inventario</h1>
          </div>
          <div className="card-body">
            <div className="mb-4">
              <DateRangePicker onDateRangeChange={handleDateRangeChange} />
            </div>

            {isLoading && <div className="d-flex justify-content-center mt-5"><div className="spinner-border" role="status"><span className="visually-hidden">Cargando reporte...</span></div></div>}
            {error && <div className="alert alert-danger mt-3">{error}</div>}

            {!isLoading && !error && (
              <>
                {/* KPIs */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="card text-white bg-info mb-3">
                      <div className="card-body">
                        <h5 className="card-title">Varianza Monetaria Total</h5>
                        <p className="card-text fs-3">${totalMonetaryVariance.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card text-white bg-success mb-3">
                      <div className="card-body">
                        <h5 className="card-title">Frecuencia de Ajustes</h5>
                        <p className="card-text fs-3">{frequencyOfAdjustments}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Listado de Auditorías */}
                <h6>Detalle de Auditorías y Ajustes</h6>
                {reportData.length === 0 ? (
                  <div className="alert alert-info">No hay datos de varianza para el rango de fechas seleccionado.</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Fecha Auditoría</th>
                          <th>Usuario</th>
                          <th>Observaciones</th>
                          <th>Varianza ($)</th>
                          <th>Ajustes de Lote</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.map(audit => (
                          <tr key={audit.auditId}>
                            <td>{new Date(audit.auditDate).toLocaleDateString()}</td>
                            <td>{audit.userName}</td>
                            <td>{audit.observations}</td>
                            <td>${audit.totalVarianceValue.toFixed(2)}</td>
                            <td>
                              <ul className="list-unstyled mb-0">
                                {audit.adjustments.map((adj, index) => (
                                  <li key={index}>
                                    {adj.ingredientName} ({adj.lotNumber}): {adj.quantityAdjusted} unid. (${adj.costImpact.toFixed(2)})
                                  </li>
                                ))}
                              </ul>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="mt-4 text-end">
                  <button className="btn btn-secondary" onClick={handleDownloadReport}>
                    Descargar Reporte (Simulado)
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    // </Layout>
  );
};

export default InventoryVariancePage;
