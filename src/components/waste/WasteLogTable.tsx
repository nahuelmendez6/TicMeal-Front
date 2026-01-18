// src/components/waste/WasteLogTable.tsx
import React from 'react';
import type { WasteLog } from '../../types/waste';
import { wasteReasonLabels } from '../../types/waste';

interface WasteLogTableProps {
  wasteLogs: WasteLog[];
}

const WasteLogTable: React.FC<WasteLogTableProps> = ({ wasteLogs }) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Fecha</th>
            <th>Ingrediente</th>
            <th>Lote</th>
            <th>Cantidad</th>
            <th>Unidad</th>
            <th>Razón</th>
            <th>Registrado por</th>
            <th>Notas</th>
          </tr>
        </thead>
        <tbody>
          {wasteLogs.map(log => (
            <tr key={log.id}>
              <td>{new Date(log.createdAt).toLocaleString()}</td>
              <td>{log.ingredientLot.ingredient?.name ?? 'N/A'}</td>
              <td>{log.ingredientLot.lotNumber}</td>
              <td>{log.quantity}</td>
              <td>{log.ingredientLot.ingredient?.unit ?? 'N/A'}</td>
              <td>{wasteReasonLabels[log.reason] ?? log.reason}</td>
              <td>{log.user?.name ?? 'N/A'}</td>
              <td>{log.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WasteLogTable;
