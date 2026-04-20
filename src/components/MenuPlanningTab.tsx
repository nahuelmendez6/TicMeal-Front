import React, { useEffect, useState } from 'react';
import { useMenuPlanning } from '../hooks/useMenuPlanning';
import type { Menu } from '../types/menu-planning';
import Button from './common/Button';
import Card from './common/Card';
import { Plus, Eye, CheckCircle, XCircle } from 'lucide-react';
import MenuPlanFormModal from './MenuPlanFormModal';
import MenuGridPicker from './MenuGridPicker';

const MenuPlanningTab: React.FC = () => {
  const { menus, loading, error, fetchMenus, createMenu, updateMenu, addMenuOption } = useMenuPlanning();
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  const handleTogglePublish = async (menu: Menu) => {
    try {
      await updateMenu(menu.id, { isPublished: !menu.isPublished });
      if (selectedMenu?.id === menu.id) {
        setSelectedMenu({ ...menu, isPublished: !menu.isPublished });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getPeriodicityLabel = (periodicity: string) => {
    switch (periodicity) {
      case 'DAILY': return 'Diario';
      case 'WEEKLY': return 'Semanal';
      case 'BIWEEKLY': return 'Quincenal';
      case 'MONTHLY': return 'Mensual';
      default: return periodicity;
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Planificación de Menús</h2>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus size={20} className="me-2" />
          Nueva Planificación
        </Button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        <div className="col-md-4">
          <Card title="Ciclos de Menú">
            {loading && menus.length === 0 ? (
              <p className="text-center p-3">Cargando...</p>
            ) : menus.length === 0 ? (
              <p className="text-center p-3 text-muted">No hay menús planificados.</p>
            ) : (
              <div className="list-group list-group-flush">
                {menus.map(menu => (
                  <div 
                    key={menu.id} 
                    className={`list-group-item list-group-item-action ${selectedMenu?.id === menu.id ? 'active' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedMenu(menu)}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold">{getPeriodicityLabel(menu.periodicity)}</div>
                        <small>{menu.startDate} - {menu.endDate}</small>
                      </div>
                      <div className="d-flex gap-2">
                        <button 
                          className={`btn btn-sm ${menu.isPublished ? 'btn-success' : 'btn-outline-secondary'}`}
                          onClick={(e) => { e.stopPropagation(); handleTogglePublish(menu); }}
                          title={menu.isPublished ? "Despublicar" : "Publicar"}
                        >
                          {menu.isPublished ? <CheckCircle size={16} /> : <XCircle size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="col-md-8">
          {selectedMenu ? (
            <Card title={`Detalle: ${selectedMenu.startDate} al ${selectedMenu.endDate}`}>
              <MenuGridPicker 
                menu={selectedMenu} 
                onAddOption={addMenuOption} 
                onRefresh={fetchMenus}
              />
            </Card>
          ) : (
            <div className="h-100 d-flex align-items-center justify-content-center border rounded bg-light p-5">
              <div className="text-center text-muted">
                <Eye size={48} className="mb-3 opacity-25" />
                <p>Seleccione un ciclo de menú para ver la planificación.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <MenuPlanFormModal 
        show={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
        onSubmit={createMenu} 
        loading={loading}
      />
    </div>
  );
};

export default MenuPlanningTab;
