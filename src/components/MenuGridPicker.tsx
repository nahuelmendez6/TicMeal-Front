import React, { useState, useEffect, useCallback } from 'react';
import type { Menu, MenuDay, MenuOption, AddMenuOptionDto } from '../types/menu-planning';
import type { MenuItem } from '../types/menu';
import { fetchShifts } from '../services/shift.services';
import { menuItemsService } from '../services/menu.items.service';
import { menuPlanningService } from '../services/menu.planning.service';
import Button from './common/Button';
import ConfirmationModal from './ConfirmationModal';
import { Plus, Trash2, Loader2 } from 'lucide-react';

interface MenuGridPickerProps {
  menu: Menu;
  onAddOption: (data: AddMenuOptionDto) => Promise<void>;
  onRemoveOption: (optionId: string) => Promise<void>;
  onRefresh: () => void;
}

const MenuGridPicker: React.FC<MenuGridPickerProps> = ({ menu, onAddOption, onRemoveOption, onRefresh }) => {
  const [shifts, setShifts] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<MenuItem[]>([]);
  const [menuDays, setMenuDays] = useState<MenuDay[]>([]);
  const [selectedCell, setSelectedCell] = useState<{ date: string, shiftId: number } | null>(null);
  const [selectedMenuItemId, setSelectedMenuItemId] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [optionToDelete, setOptionToDelete] = useState<{ id: string, name: string } | null>(null);

  const loadMenuOptions = useCallback(async () => {
    if (!menu.id) return;
    setDataLoading(true);
    try {
      const options = await menuPlanningService.getOptions(menu.id);
      setMenuDays(options);
    } catch (err) {
      console.error('Error loading menu options:', err);
    } finally {
      setDataLoading(false);
    }
  }, [menu.id]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [shiftsData, itemsData] = await Promise.all([
          fetchShifts(),
          menuItemsService.getAll()
        ]);
        setShifts(shiftsData);
        setAllProducts(itemsData.filter((item: any) => item.isActive));
      } catch (err) {
        console.error('Error loading shifts/products:', err);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    loadMenuOptions();
  }, [loadMenuOptions]);

  const datesInRange: string[] = [];
  const start = new Date(menu.startDate);
  const end = new Date(menu.endDate);
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    datesInRange.push(new Date(d).toISOString().split('T')[0]);
  }

  const handleCellClick = (date: string, shiftId: number) => {
    setSelectedCell({ date, shiftId });
    setSelectedMenuItemId(0);
  };

  const handleAddOptionSubmit = async () => {
    if (!selectedCell || selectedMenuItemId === 0) return;
    setLoading(true);
    try {
      await onAddOption({
        menuId: menu.id,
        date: selectedCell.date,
        menuItemId: selectedMenuItemId,
        shiftIds: [selectedCell.shiftId]
      });
      setSelectedCell(null);
      await loadMenuOptions();
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveOption = (e: React.MouseEvent, opt: any) => {
    e.stopPropagation();
    setOptionToDelete({
      id: opt.id,
      name: opt.menuItem?.name || `Plato #${opt.menuItemId}`
    });
  };

  const confirmRemoveOption = async () => {
    if (!optionToDelete) return;
    
    setLoading(true);
    try {
      await onRemoveOption(optionToDelete.id);
      await loadMenuOptions();
      onRefresh();
      setOptionToDelete(null);
    } catch (err) {
      console.error('Error removing option:', err);
    } finally {
      setLoading(false);
    }
  };

  const getOptionsForCell = (date: string, shiftId: number) => {
    const day = menuDays.find(d => {
      const dDate = d.date.includes('T') ? d.date.split('T')[0] : d.date;
      return dDate === date;
    });
    if (!day) return [];
    return day.menuOptions?.filter((opt: any) => 
      opt.shifts?.some((s: any) => s.id === shiftId)
    ) || [];
  };

  return (
    <div className="table-responsive mt-4 position-relative">
      {dataLoading && (
        <div className="position-absolute top-50 start-50 translate-middle" style={{ zIndex: 10 }}>
          <div className="bg-white p-3 rounded shadow-sm d-flex align-items-center gap-2 border">
            <Loader2 className="animate-spin text-primary" size={24} />
            <span>Cargando opciones...</span>
          </div>
        </div>
      )}
      <table className={`table table-bordered align-middle ${dataLoading ? 'opacity-50' : ''}`}>
        <thead className="table-light">
          <tr>
            <th style={{ minWidth: '150px' }}>Turno / Fecha</th>
            {datesInRange.map(date => (
              <th key={date} className="text-center">
                {new Date(date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {shifts.map(shift => (
            <tr key={shift.id}>
              <td className="fw-bold">{shift.name}</td>
              {datesInRange.map(date => {
                const options = getOptionsForCell(date, shift.id);
                return (
                  <td key={`${date}-${shift.id}`} 
                      className="text-center p-2" 
                      style={{ cursor: 'pointer', minHeight: '80px', minWidth: '150px' }}
                      onClick={() => handleCellClick(date, shift.id)}>
                    <div className="d-flex flex-column gap-2 align-items-center">
                      {options.length > 0 ? (
                        options.map((opt: any) => (
                          <div key={opt.id} className="badge bg-primary text-wrap p-2 w-100 d-flex justify-content-between align-items-center">
                            <span style={{ fontSize: '0.75rem' }}>{opt.menuItem?.name || `ID #${opt.menuItemId}`}</span>
                            <button 
                              className="btn btn-sm text-white p-0 ms-1" 
                              style={{ opacity: 0.8 }}
                              onClick={(e) => handleRemoveOption(e, opt)}
                              title="Eliminar"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))
                      ) : null}
                      <Button variant="outline-primary" size="sm" className="w-100 py-0">
                        <Plus size={14} />
                      </Button>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {selectedCell && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Asignar Plato a {selectedCell.date} - {shifts.find(s => s.id === selectedCell.shiftId)?.name || `Turno #${selectedCell.shiftId}`}
                </h5>
                <button type="button" className="btn-close" onClick={() => setSelectedCell(null)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Seleccionar Plato</label>
                  <select 
                    className="form-select" 
                    value={selectedMenuItemId} 
                    onChange={(e) => setSelectedMenuItemId(Number(e.target.value))}
                  >
                    <option value="0">Seleccione un producto...</option>
                    {allProducts.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <Button variant="secondary" onClick={() => setSelectedCell(null)}>Cancelar</Button>
                <Button variant="primary" loading={loading} onClick={handleAddOptionSubmit} disabled={selectedMenuItemId === 0}>
                  Asignar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {optionToDelete && (
        <ConfirmationModal
          title="Eliminar Plato"
          message={`¿Está seguro de que desea eliminar "${optionToDelete.name}" de este turno?`}
          onConfirm={confirmRemoveOption}
          onCancel={() => setOptionToDelete(null)}
          isConfirming={loading}
          confirmButtonText="Eliminar"
        />
      )}
    </div>
  );
};

export default MenuGridPicker;
