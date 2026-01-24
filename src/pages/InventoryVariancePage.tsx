// src/pages/InventoryVariancePage.tsx
import React, { useState } from 'react';
import { useInventoryVarianceReport } from '../hooks/useInventoryVarianceReport';
import DateRangePicker from '../components/DateRangePicker';
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

  const totalMonetaryVariance = reportData?.summary?.totalVariance ?? 0;
  const frequencyOfAdjustments = reportData?.summary?.totalAudits ?? 0;

  const handleDownloadReport = () => {
    alert('Simulando descarga de reporte...');
    console.log('Report data:', reportData);
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
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

          {!isLoading && !error && reportData && (
            <>
              {/* KPIs */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="card text-white bg-info mb-3">
                    <div className="card-body">
                      <h5 className="card-title">Varianza Monetaria Total</h5>
                      <p className={`card-text fs-3 ${totalMonetaryVariance > 0 ? 'text-danger' : (totalMonetaryVariance < 0 ? 'text-success' : '')}`}>
                        ${totalMonetaryVariance.toFixed(2)}
                      </p>
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
              {reportData.details.length === 0 ? (
                <div className="alert alert-info">No hay datos de varianza para el rango de fechas seleccionado.</div>
              ) : (
                <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}> {/* Internal scroll */}
                  <table className="table table-hover align-middle">
                    <thead className="table-light" style={{ position: 'sticky', top: 0, zIndex: 1 }}> {/* Sticky header */}
                      <tr>
                        <th>Fecha Auditoría</th>
                        <th>Tipo</th>
                        <th>Ítem</th>
                        <th>Stock Teórico</th>
                        <th>Stock Físico</th>
                        <th>Diferencia (Cant.)</th>
                        <th>Costo Unitario</th>
                        <th>Diferencia Monetaria</th>
                        <th>Observaciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.details.map(detail => (
                        <tr key={detail.id}>
                          <td>{formatDate(detail.auditDate)}</td> {/* Formatted date */}
                          <td>{detail.auditType === 'ingredient' ? 'Ingrediente' : 'Ítem de Menú'}</td>
                          <td>{detail.itemName}</td>
                          <td>{detail.theoreticalStock.toFixed(2)}</td>
                          <td>{detail.physicalStock.toFixed(2)}</td>
                          <td className={detail.differenceQuantity > 0 ? 'text-danger' : (detail.differenceQuantity < 0 ? 'text-success' : '')}>
                            {detail.differenceQuantity.toFixed(2)}
                          </td>
                          <td>${(parseFloat(detail.unitCostAtAudit as any) ?? 0).toFixed(2)}</td>
                          <td className={(parseFloat(detail.monetaryDifference as any) ?? 0) > 0 ? 'text-danger' : ((parseFloat(detail.monetaryDifference as any) ?? 0) < 0 ? 'text-success' : '')}>
                            ${(parseFloat(detail.monetaryDifference as any) ?? 0).toFixed(2)}
                          </td>
                          <td>{detail.observations}</td>
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
          {!isLoading && !error && !reportData && (
            <div className="alert alert-info">Seleccione un rango de fechas para ver la varianza de inventario.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryVariancePage;