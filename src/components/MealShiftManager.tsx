// src/components/MealShiftManager.tsx

import React, { useState, useEffect } from 'react';
import { useMealShifts } from '../hooks/useMealShifts';
import { type CreateMealShiftDto } from '../services/mealShiftService';
import { fetchShifts } from '../services/shift.services';
import { menuItemsService } from '../services/menu.items.service';
import api from '../services/api';
import { Plus, ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react'; // Import Lucide icons
import MealShiftFormModal from './MealShiftFormModal'; // Import the new modal component
import Card from './common/Card';
import Button from './common/Button';
import Table from './common/Table';

const getLocalDate = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const localDate = new Date(today.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().split('T')[0];
};

const MealShiftManager: React.FC = () => { // No props here
  const { mealShifts, loading, error, addMealShift, refetch } = useMealShifts();
  const [shifts, setShifts] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  
  // Estado inicial del formulario
  const initialState: CreateMealShiftDto = {
    date: getLocalDate(), // Fecha de hoy YYYY-MM-DD
    shiftId: 0,
    menuItemId: 0,
    quantityProduced: 0,
    lotNumber: '', // New field
    unitCost: 0,   // New field
  };

  const [formData, setFormData] = useState<CreateMealShiftDto>(initialState);
  const [filterDate, setFilterDate] = useState<string>(getLocalDate());
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Estados para Modales
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showEditConfirmModal, setShowEditConfirmModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false); // New state for form modal

  // Cargar datos para los selectores
  useEffect(() => {
    const loadData = async () => {
      try {
        const [shiftsData, itemsData] = await Promise.all([
          fetchShifts(),
          menuItemsService.getAll()
        ]);
        setShifts(shiftsData);
        setMenuItems(itemsData.filter((item: any) => item.isActive));
      } catch (err) {
        console.error('Error cargando datos para el formulario:', err);
      }
    };
    loadData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: (name === 'date' || name === 'lotNumber') ? value : Number(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (formData.shiftId <= 0 || formData.menuItemId <= 0 || formData.quantityProduced <= 0) {
      setFormError('Por favor complete todos los campos correctamente.');
      return;
    }

    if (editingId) {
      setShowEditConfirmModal(true);
    } else {
      executeSubmit();
    }
  };

  const executeSubmit = async () => {
    try {
      // Find the selected menu item to determine its type
      const selectedMenuItem = menuItems.find(item => item.id === formData.menuItemId);

      let payload: CreateMealShiftDto = {
        date: formData.date,
        shiftId: formData.shiftId,
        menuItemId: formData.menuItemId,
        quantityProduced: formData.quantityProduced,
      };

      if (selectedMenuItem?.type === 'SIMPLE') {
        payload = {
          ...payload,
          lotNumber: formData.lotNumber,
          unitCost: formData.unitCost,
        };
      }
      // If COMPUESTO, lotNumber and unitCost are not included in the payload
      // Client-side validation should ensure they are present for SIMPLE items.


      if (editingId) {
        await api.patch(`/meal-shifts/${editingId}`, payload); // Use payload here
        setSuccessMessage('Producción actualizada con éxito');
        setEditingId(null);
        refetch();
      } else {
        await addMealShift(payload); // Use payload here
        setSuccessMessage('Producción registrada con éxito');
      }
      setFormData(initialState);
      setShowEditConfirmModal(false);
      setShowFormModal(false); // Close form modal on success
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Error al procesar la solicitud.');
      setShowEditConfirmModal(false);
    }
  };

  const handleEdit = (mealShift: any) => {
    setEditingId(mealShift.id);
    setFormData({
      date: mealShift.date,
      shiftId: mealShift.shiftId,
      menuItemId: mealShift.menuItemId,
      quantityProduced: mealShift.quantityProduced,
      lotNumber: mealShift.lotNumber || '', // Add lotNumber, default to empty string
      unitCost: mealShift.unitCost || 0,   // Add unitCost, default to 0
    });
    setShowFormModal(true); // Open form modal for editing
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await api.patch(`/meal-shifts/${deleteId}`, { isActive: false });
      refetch();
      setSuccessMessage('Registro eliminado correctamente');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Error al eliminar el registro.');
    }
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialState);
    setShowFormModal(false); // Close form modal on cancel
  };

  const changeDate = (days: number) => {
    const date = new Date(filterDate);
    date.setUTCDate(date.getUTCDate() + days);
    setFilterDate(date.toISOString().split('T')[0]);
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(initialState);
    setFormError(null);
    setSuccessMessage(null);
    setShowFormModal(true);
  };

  const columns = [
    { header: 'Fecha', accessor: 'date' },
    { header: 'Turno', accessor: 'shiftName' },
    { header: 'Plato', accessor: 'menuItemName' },
    { header: 'Producido', accessor: 'quantityProduced' },
    { header: 'Disponible', accessor: 'quantityAvailable' },
  ];

  const renderRowActions = (ms: any) => (
    <>
      <Button variant="primary" size="sm" onClick={() => handleEdit(ms)} title="Editar" className="me-2">
        <Pencil size={16} />
      </Button>
      <Button variant="danger" size="sm" onClick={() => handleDeleteClick(ms.id)} title="Eliminar">
        <Trash2 size={16} />
      </Button>
    </>
  );

  const filteredMealShifts = mealShifts.filter((ms: any) => ms.isActive !== false && ms.date === filterDate).map((ms: any) => {
    const shiftName = ms.shift?.name || shifts.find(s => s.id === ms.shiftId)?.name || `ID: ${ms.shiftId}`;
    const menuItem = ms.menuItem || menuItems.find(i => i.id === ms.menuItemId);
    const menuItemName = menuItem?.name || `ID: ${ms.menuItemId}`;
    const iconName = menuItem?.iconName || 'circle';

    return {
      ...ms,
      shiftName: (
        <span className="badge bg-info text-dark bg-opacity-10 border border-info border-opacity-25">
          {shiftName}
        </span>
      ),
      menuItemName: (
        <div className="d-flex align-items-center">
          {/* <i className={`bi bi-${iconName.toLowerCase()} me-2 text-secondary`}></i> */}
          {menuItemName}
        </div>
      ),
      quantityAvailable: (
        <span className={`badge ${ms.quantityAvailable > 0 ? 'bg-success' : 'bg-danger'}`}>
          {ms.quantityAvailable}
        </span>
      ),
    };
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Gestión de Producción Diaria</h2>
        <Button onClick={openCreateModal}>
          <Plus size={20} className="me-2" />
          Nueva Producción
        </Button>
      </div>

      {/* Mensajes de Error Globales */}
      {error && <div className="alert alert-danger">{error}</div>}
      {/* formError y successMessage ahora se manejan dentro del modal */}

      <div className="row">
        {/* Tabla de Listado */}
        <div className="col-12"> {/* Changed to col-12 to take full width */}
          <Card>
            <div className="card-header d-flex justify-content-between align-items-center bg-white p-3">
              <h5 className="mb-0 h6">Historial de Producción</h5>
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
              {loading && filteredMealShifts.length === 0 ? (
                <div className="text-center p-4">Cargando datos...</div>
              ) : filteredMealShifts.length === 0 ? (
                <div className="text-center p-4 text-muted">No hay producciones registradas para esta fecha.</div>
              ) : (
                <Table
                  columns={columns}
                  data={filteredMealShifts}
                  renderRowActions={renderRowActions}
                />
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Confirmar Eliminación</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>¿Está seguro de que desea eliminar este registro de producción? Esta acción descontará el stock disponible.</p>
              </div>
              <div className="modal-footer">
                <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
                <Button variant="danger" onClick={confirmDelete}>Eliminar</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      <MealShiftFormModal
        show={showFormModal}
        onClose={() => setShowFormModal(false)}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        loading={loading}
        editingId={editingId}
        handleCancelEdit={handleCancelEdit}
        formError={formError}
        successMessage={successMessage}
        shifts={shifts}
        menuItems={menuItems}
        showEditConfirmModal={showEditConfirmModal}
        executeSubmit={executeSubmit}
        setShowEditConfirmModal={setShowEditConfirmModal}
      />
    </div>
  );
};

export default MealShiftManager;
