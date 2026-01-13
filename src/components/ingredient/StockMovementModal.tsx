// src/components/ingredient/StockMovementModal.tsx
import React, { useState } from 'react';
import { stockService, type StockMovementDto } from '../../services/stock.service';
import type { Ingredient } from '../../types/ingtredient';
import type { MenuItem } from '../../types/menu';

interface StockMovementModalProps {
  item: Ingredient | MenuItem;
  itemType: 'ingredient' | 'menuItem';
  token: string;
  onClose: () => void;
  onSuccess: () => void;
}

const StockMovementModal: React.FC<StockMovementModalProps> = ({ item, itemType, token, onClose, onSuccess }) => {
  const [movementType, setMovementType] = useState<'in' | 'out'>('in');
  const [quantity, setQuantity] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [unitCost, setUnitCost] = useState('');
  const [reason, setReason] = useState('');
  const [selectedLotId, setSelectedLotId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const movementDto: StockMovementDto = {
      movementType,
      quantity: parseFloat(quantity),
      reason,
    };

    if (itemType === 'ingredient') {
      movementDto.ingredientId = item.id;
    } else {
      movementDto.menuItemId = item.id;
    }

    if (movementType === 'in') {
      movementDto.lotNumber = lotNumber;
      movementDto.expirationDate = expirationDate ? new Date(expirationDate).toISOString() : undefined;
      movementDto.unitCost = parseFloat(unitCost);
    } else { // OUT
      if (!selectedLotId) {
        setError('Debe seleccionar un lote para el movimiento de salida.');
        setIsSubmitting(false);
        return;
      }
      movementDto.ingredientLotId = selectedLotId;
    }

    try {
      await stockService.createMovement(token, movementDto);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error al registrar el movimiento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Gestionar Stock: {item.name}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Lista de Lotes */}
            <div className="mb-4">
              <h6>Lotes Actuales</h6>
              <div className="table-responsive" style={{ maxHeight: '200px' }}>
                <table className="table table-sm table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Lote</th>
                      <th>Cantidad</th>
                      <th>Costo Unitario</th>
                      <th>Vencimiento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.lots && item.lots.length > 0 ? (
                      item.lots.map(lot => (
                        <tr key={lot.id}>
                          <td>{lot.lotNumber}</td>
                          <td>{lot.quantity}</td>
                          <td>{lot.unitCost}</td>
                          <td>{lot.expirationDate ? new Date(lot.expirationDate).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center">No hay lotes para este producto.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <p className="fw-bold mt-2">Stock Total: {item.quantityInStock}</p>
            </div>

            <hr />

            {/* Formulario de Movimiento */}
            <h6>Registrar Movimiento</h6>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Tipo de Movimiento</label>
                <select className="form-select" value={movementType} onChange={e => setMovementType(e.target.value as 'in' | 'out')}>
                  <option value="in">Entrada</option>
                  <option value="out">Salida</option>
                </select>
              </div>

              {movementType === 'in' ? (
                <>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="quantity" className="form-label">Cantidad</label>
                      <input type="number" className="form-control" id="quantity" value={quantity} onChange={e => setQuantity(e.target.value)} required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="unitCost" className="form-label">Costo Unitario</label>
                      <input type="number" className="form-control" id="unitCost" value={unitCost} onChange={e => setUnitCost(e.target.value)} required />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="lotNumber" className="form-label">Número de Lote</label>
                      <input type="text" className="form-control" id="lotNumber" value={lotNumber} onChange={e => setLotNumber(e.target.value)} required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="expirationDate" className="form-label">Fecha de Vencimiento</label>
                      <input type="date" className="form-control" id="expirationDate" value={expirationDate} onChange={e => setExpirationDate(e.target.value)} />
                    </div>
                  </div>
                </>
              ) : ( // OUT
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="lotId" className="form-label">Lote de Salida</label>
                    <select id="lotId" className="form-select" value={selectedLotId ?? ''} onChange={e => setSelectedLotId(Number(e.target.value))} required>
                      <option value="" disabled>Seleccione un lote</option>
                      {item.lots?.map(lot => (
                        <option key={lot.id} value={lot.id}>
                          {lot.lotNumber} (Disponible: {lot.quantity})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="quantity" className="form-label">Cantidad a Retirar</label>
                    <input type="number" className="form-control" id="quantity" value={quantity} onChange={e => setQuantity(e.target.value)} required />
                  </div>
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="reason" className="form-label">Motivo (Opcional)</label>
                <input type="text" className="form-control" id="reason" value={reason} onChange={e => setReason(e.target.value)} />
              </div>

              <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-secondary me-2" onClick={onClose}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Guardando...' : 'Guardar Movimiento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockMovementModal;
