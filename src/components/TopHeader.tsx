import React from 'react';
import {
  Bell,
  UserCircle,
  LogOut,
  Menu as MenuIcon
} from 'lucide-react';
import Button from './common/Button';

interface TopHeaderProps {
  userProfile: any;
  onLogout: () => void;
  notifications: any[];
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  onClearNotifications: () => void;
  onToggleSidebar: () => void;
}

const TopHeader: React.FC<TopHeaderProps> = ({
  userProfile,
  onLogout,
  notifications,
  showNotifications,
  setShowNotifications,
  onClearNotifications,
  onToggleSidebar
}) => {
  return (
    <header className="top-header">
      <div className="d-flex align-items-center w-100">
        <button 
          className="btn btn-link p-0 me-3 d-lg-none text-dark" 
          onClick={onToggleSidebar}
        >
          <MenuIcon size={24} />
        </button>

        <div className="ms-auto d-flex align-items-center gap-3">
          {/* Notifications */}
          <div className="dropdown position-relative">
            <button 
              className="btn btn-light position-relative rounded-circle p-2" 
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                  {notifications.length}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="dropdown-menu dropdown-menu-end show p-0 shadow-lg border-0 mt-2" style={{ width: '300px', zIndex: 1050 }}>
                <div className="card border-0">
                  <div className="card-header bg-light d-flex justify-content-between align-items-center py-2">
                    <h6 className="mb-0 small fw-bold">Notificaciones</h6>
                    {notifications.length > 0 && (
                      <button className="btn btn-link btn-sm p-0 text-decoration-none" onClick={onClearNotifications}>
                        Limpiar
                      </button>
                    )}
                  </div>
                  <div className="list-group list-group-flush" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <div className="p-3 text-center text-muted small">No hay notificaciones</div>
                    ) : (
                      notifications.map((notif, idx) => (
                        <div key={idx} className="list-group-item p-2">
                          <strong className="text-danger small">Stock Bajo</strong>
                          <p className="mb-1 small">{notif.name}: {notif.currentStock} {notif.unit}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="vr mx-2 text-gray-300" style={{ height: '24px' }}></div>

          {/* User Info */}
          <div className="d-flex align-items-center">
            <div className="text-end me-2 d-none d-sm-block">
              <div className="fw-bold small">{userProfile?.username || 'Usuario'}</div>
              {userProfile?.role && (
                <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>
                  {userProfile.role.replace('_', ' ')}
                </small>
              )}
            </div>
            <UserCircle size={32} className="text-gray-600" />
          </div>

          {/* Logout Button */}
          <Button
            variant="outline-danger"
            size="sm"
            onClick={onLogout}
            className="ms-2 p-2 rounded-circle"
          >
            <LogOut size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
