import React from 'react';
import { type CreateMealShiftDto } from '../services/mealShiftService';

interface MealShiftFormModalProps {
  show: boolean;
  onClose: () => void;
  formData: CreateMealShiftDto;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  editingId: number | null;
  handleCancelEdit: () => void;
  formError: string | null;
  successMessage: string | null;
  shifts: any[];
  menuItems: any[];
  showEditConfirmModal: boolean;
  executeSubmit: () => Promise<void>;
  setShowEditConfirmModal: (show: boolean) => void;
}

const MealShiftFormModal: React.FC<MealShiftFormModalProps> = ({
  show,
  onClose,
  formData,
  handleInputChange,
  handleSubmit,
  loading,
  editingId,
  handleCancelEdit,
  formError,
  successMessage,
  shifts,
  menuItems,
  showEditConfirmModal,
  executeSubmit,
  setShowEditConfirmModal,
}) => {
  if (!show) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">{editingId ? 'Editar Producción' : 'Nueva Producción'}</h5>
              <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {formError && <div className="alert alert-warning">{formError}</div>}
              {successMessage && <div className="alert alert-success">{successMessage}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="date" className="form-label">Fecha</label>
                  <input
                    type="date"
                    className="form-control"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="shiftId" className="form-label">Turno</label>
                  <select
                    className="form-select"
                    id="shiftId"
                    name="shiftId"
                    value={formData.shiftId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value={0}>Seleccione un turno</option>
                    {shifts.map((shift) => (
                      <option key={shift.id} value={shift.id}>
                        {shift.name} ({shift.startTime?.substring(0, 5)} - {shift.endTime?.substring(0, 5)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="menuItemId" className="form-label">Plato / Ítem</label>
                  <select
                    className="form-select"
                    id="menuItemId"
                    name="menuItemId"
                    value={formData.menuItemId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value={0}>Seleccione un ítem</option>
                    {menuItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="quantityProduced" className="form-label">Cantidad Producida</label>
                  <input
                    type="number"
                    className="form-control"
                    id="quantityProduced"
                    name="quantityProduced"
                    value={formData.quantityProduced || ''}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>

                <div className="d-flex justify-content-end mt-3">
                  {editingId && (
                    <button type="button" className="btn btn-secondary me-2" onClick={handleCancelEdit}>
                      Cancelar Edición
                    </button>
                  )}
                  <button type="submit" className={`btn ${editingId ? 'btn-warning' : 'btn-success'}`} disabled={loading}>
                    {loading ? 'Guardando...' : (editingId ? 'Actualizar Producción' : 'Registrar Producción')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación de Edición (anidado) */}
      {showEditConfirmModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title">Confirmar Edición</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditConfirmModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>¿Está seguro de que desea guardar los cambios en esta producción?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditConfirmModal(false)}>Cancelar</button>
                <button type="button" className="btn btn-primary" onClick={executeSubmit}>Guardar Cambios</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MealShiftFormModal;
