import React, { useState } from 'react';
import Button from './common/Button';
import type { CreateMenuDto } from '../types/menu-planning';

interface MenuPlanFormModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMenuDto) => Promise<void>;
  loading: boolean;
}

const MenuPlanFormModal: React.FC<MenuPlanFormModalProps> = ({ show, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState<CreateMenuDto>({
    startDate: '',
    endDate: '',
    periodicity: 'WEEKLY',
  });
  const [error, setError] = useState<string | null>(null);

  if (!show) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.startDate || !formData.endDate) {
      setError('Por favor complete las fechas.');
      return;
    }
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear el menú');
    }
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Nueva Planificación de Menú</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="mb-3">
                <label className="form-label">Fecha de Inicio</label>
                <input
                  type="date"
                  name="startDate"
                  className="form-control"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Fecha de Fin</label>
                <input
                  type="date"
                  name="endDate"
                  className="form-control"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Periodicidad</label>
                <select
                  name="periodicity"
                  className="form-select"
                  value={formData.periodicity}
                  onChange={handleInputChange}
                >
                  <option value="DAILY">Diario</option>
                  <option value="WEEKLY">Semanal</option>
                  <option value="BIWEEKLY">Quincenal</option>
                  <option value="MONTHLY">Mensual</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" onClick={onClose}>Cancelar</Button>
              <Button type="submit" variant="primary" loading={loading}>Crear Menú</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MenuPlanFormModal;
