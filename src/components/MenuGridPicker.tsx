import React, { useState, useEffect } from 'react';
import type { Menu, MenuDay, MenuOption, AddMenuOptionDto } from '../types/menu-planning';
import type { MenuItem } from '../types/menu';
import { fetchShifts } from '../services/shift.services';
import { menuItemsService } from '../services/menu.items.service';
import Button from './common/Button';
import { Plus, Trash2 } from 'lucide-react';

interface MenuGridPickerProps {
  menu: Menu;
  onAddOption: (data: AddMenuOptionDto) => Promise<void>;
  onRefresh: () => void;
}

const MenuGridPicker: React.FC<MenuGridPickerProps> = ({ menu, onAddOption, onRefresh }) => {
  const [shifts, setShifts] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<MenuItem[]>([]);
  const [selectedCell, setSelectedCell] = useState<{ date: string, shiftId: number } | null>(null);
  const [selectedMenuItemId, setSelectedMenuItemId] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
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
    loadData();
  }, []);

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
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getOptionsForCell = (date: string, shiftId: number) => {
    const day = menu.days?.find(d => d.date === date);
    if (!day) return [];
    return day.options?.filter(opt => opt.shifts?.some(s => s.id === shiftId)) || [];
  };

  return (
    <div className="table-responsive mt-4">
      <table className="table table-bordered align-middle">
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
                      {options.map(opt => (
                        <div key={opt.id} className="badge bg-primary text-wrap p-2 w-100 d-flex justify-content-between align-items-center">
                          <span style={{ fontSize: '0.75rem' }}>{opt.menuItem?.name || `Producto #${opt.menuItemId}`}</span>
                          {/* <Trash2 size={12} className="ms-1" style={{ cursor: 'pointer' }} /> */}
                        </div>
                      ))}
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
                <h5 className="modal-title">Asignar Plato a {selectedCell.date} - Turno #{selectedCell.shiftId}</h5>
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
    </div>
  );
};

export default MenuGridPicker;
