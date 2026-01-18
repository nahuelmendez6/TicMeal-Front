// src/components/ingredient/StockMovementModal.tsx
import React, { useState } from 'react';
import { stockService, type StockMovementDto } from '../../services/stock.service';
import { useWaste } from '../../hooks/useWaste';
import type { Ingredient } from '../../types/ingtredient';
import type { MenuItem } from '../../types/menu';
import { WasteReason, wasteReasonLabels, type CreateWasteLogDto } from '../../types/waste';

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
  
  // Waste state
  const [isWaste, setIsWaste] = useState(false);
  const [wasteReason, setWasteReason] = useState<WasteReason>(WasteReason.SOBRANTE_LINEA);
  const [wasteNotes, setWasteNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { createWasteLog } = useWaste();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (movementType === 'out' && !selectedLotId) {
      setError('Debe seleccionar un lote para el movimiento de salida.');
      setIsSubmitting(false);
      return;
    }

    // --- VALIDACIÓN DE CANTIDAD ---
    const selectedLot = item.lots?.find(lot => lot.id === selectedLotId);
    const outQuantity = parseFloat(quantity);

    if (movementType === 'out' && selectedLot && outQuantity > selectedLot.quantity) {
      setError(`La cantidad a retirar (${outQuantity}) no puede ser mayor al stock disponible en el lote (${selectedLot.quantity}).`);
      setIsSubmitting(false);
      return;
    }
    // --- FIN VALIDACIÓN ---

    try {
      // If it's a waste movement, call the waste service
      if (movementType === 'out' && isWaste) {
        if (itemType !== 'ingredient') {
          throw new Error("La merma solo está implementada para ingredientes por ahora.");
        }
        const wasteDto: CreateWasteLogDto = {
          ingredientLotId: selectedLotId!,
          quantity: outQuantity,
          reason: wasteReason,
          notes: wasteNotes,
          logDate: new Date().toISOString(), // <-- FIX: Add current date
        };
        
        console.log('Enviando datos de merma:', wasteDto); // <-- DEBUG
        await createWasteLog(wasteDto);

      } else {
        // Otherwise, perform a regular stock movement
        const movementDto: StockMovementDto = {
          movementType,
          quantity: outQuantity,
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
          movementDto.ingredientLotId = selectedLotId!;
        }

        console.log('Enviando movimiento de stock:', movementDto); // <-- DEBUG
        await stockService.createMovement(token, movementDto);
      }
      
      onSuccess();
      onClose();
    } catch (err: any) {
      // Log the full error response from the server for detailed diagnostics
      if (err.response) {
        console.error('Server Error Response:', err.response.data);
      } else {
        console.error('Error:', err.message);
      }

      const apiError = err.response?.data?.message || 'Ocurrió un error al registrar el movimiento.';
      // If the message is an array (from class-validator), join it.
      const detailedMessage = Array.isArray(apiError) ? apiError.join(', ') : apiError;
      
      setError(detailedMessage);
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
                <>
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
                  <div className="form-check mb-3">
                    <input className="form-check-input" type="checkbox" checked={isWaste} onChange={e => setIsWaste(e.target.checked)} id="isWasteCheck" />
                    <label className="form-check-label" htmlFor="isWasteCheck">
                      ¿Es una merma?
                    </label>
                  </div>

                  {isWaste && (
                    <div className="card bg-light p-3 mb-3">
                       <div className="mb-3">
                          <label htmlFor="wasteReason" className="form-label">Razón de la Merma</label>
                          <select id="wasteReason" className="form-select" value={wasteReason} onChange={e => setWasteReason(e.target.value as WasteReason)} required>
                            {Object.entries(wasteReasonLabels).map(([key, label]) => (
                              <option key={key} value={key}>{label}</option>
                            ))}
                          </select>
                       </div>
                       <div className="mb-3">
                          <label htmlFor="wasteNotes" className="form-label">Notas de Merma (Opcional)</label>
                          <textarea className="form-control" id="wasteNotes" value={wasteNotes} onChange={e => setWasteNotes(e.target.value)} />
                       </div>
                    </div>
                  )}
                </>
              )}

              {!isWaste && (
                <div className="mb-3">
                  <label htmlFor="reason" className="form-label">Motivo del Movimiento (Opcional)</label>
                  <input type="text" className="form-control" id="reason" value={reason} onChange={e => setReason(e.target.value)} />
                </div>
              )}

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
