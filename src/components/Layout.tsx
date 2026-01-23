import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { io } from 'socket.io-client';
import {
  Bell,
  Users,
  Clock,
  BookText,
  QrCode,
  ClipboardCheck,
  BarChart2,
  Trash2,
  AreaChart,
  ShoppingCart,
  ClipboardList,
  PlusSquare,
  CookingPot,
  Monitor,
  ScanLine,
  CalendarCheck,
  LogOut,
  UserCircle,
  Menu as MenuIcon
} from 'lucide-react';

import logonavbar from '../assets/sidebar-logo.png';

interface LayoutProps {
  children: React.ReactNode;
}

interface Ticket {
  id: number;
  status: string;
  date: string;
  time: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
  };
  shift: {
    id: number;
    name: string;
  };
  menuItems: { id: number; name: string; iconName: string }[];
  observations: { id: number; name: string; iconName: string }[];
  createdAt: string;
}

interface LowStockNotification {
    name: string;
    currentStock: number;
    unit: string;
    minStock: number;
}

const NavLink: React.FC<{ to: string; title: string; children: React.ReactNode }> = ({ to, title, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} title={title} className={`nav-link ${isActive ? 'active' : ''} d-flex align-items-center p-2`}>
      {children}
    </Link>
  );
};


const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<LowStockNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);


  useEffect(() => {
    let companyId = (userProfile as { companyId?: number; company?: { id?: number } })?.companyId || (userProfile as { companyId?: number; company?: { id?: number } })?.company?.id;
    
    if (!companyId) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const payload = JSON.parse(jsonPayload) as { companyId?: number };
          companyId = payload.companyId;
        } catch (e) {
          console.error('[Layout] Error decoding token:', e);
        }
      }
    }

    if (!companyId) return;

    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const cleanUrl = socketUrl.replace(/\/$/, '');
    
    const socket = io(`${cleanUrl}/tickets`, {
      query: { companyId },
      transports: ['websocket']
    });

    socket.on('connect', () => console.log('[Layout] Socket connected. ID:', socket.id));
    socket.on('connect_error', (err) => console.error('[Layout] Socket connection error:', err));
    socket.on('lowStockAlert', (payload: LowStockNotification) => setNotifications((prev) => [payload, ...prev]));
    socket.on('newTicket', (ticket: Ticket) => window.dispatchEvent(new CustomEvent('newTicket', { detail: ticket })));
    socket.on('ticketUpdated', (updatedTicket: Ticket) => window.dispatchEvent(new CustomEvent('ticketUpdated', { detail: updatedTicket })));

    return () => {
      socket.disconnect();
    };
  }, [userProfile]);

  const isAdmin = userProfile?.role === 'company_admin';
  const isKitchen = userProfile?.role === 'kitchen_admin';
  const isEmployee = !!userProfile?.role;

  const renderMenuItems = () => {
    const menuItems: React.ReactNode[] = [];

    if (isAdmin) {
      menuItems.push(
        <NavLink key="users" to="/users" title="Usuarios"><Users size={20} /></NavLink>,
        <NavLink key="shifts" to="/shifts" title="Turnos"><Clock size={20} /></NavLink>,
        <NavLink key="menu" to="/menu-management" title="Menú"><BookText size={20} /></NavLink>,
        <NavLink key="qr-generator" to="/qr-generator" title="Generador QR"><QrCode size={20} /></NavLink>,
        <NavLink key="inventory-audit" to="/inventory/audit" title="Auditoría de Inventario"><ClipboardCheck size={20} /></NavLink>,
        <NavLink key="reports" to="/reports" title="Reportes"><BarChart2 size={20} /></NavLink>,
        <NavLink key="waste-logs" to="/waste-logs" title="Historial de Mermas"><Trash2 size={20} /></NavLink>,
        <NavLink key="inventory-variance-report" to="/reports/inventory-variance" title="Varianza de Inventario"><AreaChart size={20} /></NavLink>,
        <NavLink key="compras" to="/purchases-and-suppliers" title="Compras"><ShoppingCart size={20} /></NavLink>
      );
    }

    if (isKitchen) {
      menuItems.push(
        <NavLink key="ticket-list" to="/ticket-list" title="Lista de Tickets"><ClipboardList size={20} /></NavLink>,
        <NavLink key="shifts" to="/shifts" title="Turnos"><Clock size={20} /></NavLink>,
        <NavLink key="menu" to="/menu-management" title="Menú"><BookText size={20} /></NavLink>,
        <NavLink key="inventory-audit" to="/inventory/audit" title="Auditoría de Inventario"><ClipboardCheck size={20} /></NavLink>,
        <NavLink key="kitchen-ticket-create" to="/kitchen-ticket-create" title="Crear Ticket Manual"><PlusSquare size={20} /></NavLink>,
        <NavLink key="meal-shifts" to="/meal-shifts" title="Producción Diaria"><CookingPot size={20} /></NavLink>,
        <NavLink key="ticket-monitor" to="/ticket-monitor" title="Monitor de Cocina"><Monitor size={20} /></NavLink>
      );
    }

    if (isEmployee) {
        menuItems.push(
          <NavLink key="ticket-validation" to="/ticket-validation" title="Validar Ticket"><ScanLine size={20} /></NavLink>,
          <NavLink key="active-shift-form" to="/active-shift" title="Pedido de Turno"><CalendarCheck size={20} /></NavLink>
        );
    }
    
    // Remove duplicates for users with multiple roles (e.g. admin + kitchen)
    const uniqueKeys = new Set<string>();
    return menuItems.filter(item => {
        if (React.isValidElement(item) && item.key) {
            const key = String(item.key);
            if (!uniqueKeys.has(key)) {
                uniqueKeys.add(key);
                return true;
            }
        }
        return false;
    });
  };

  return (
    <div className="d-flex flex-column vh-100">
      <header className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img src={logonavbar} alt="Logo" style={{ height: '40px' }} />
          </Link>

          <button 
            className="navbar-toggler" 
            type="button" 
            onClick={() => setIsNavCollapsed(!isNavCollapsed)}
            aria-controls="navbarNav" 
            aria-expanded={!isNavCollapsed} 
            aria-label="Toggle navigation"
          >
            <MenuIcon />
          </button>

          <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarNav">
            <nav className="navbar-nav d-flex flex-row flex-wrap gap-2 mx-auto">
              {renderMenuItems()}
            </nav>

            <div className="navbar-nav ms-lg-auto d-flex flex-row align-items-center gap-3">
              {/* Notifications */}
              <div className="dropdown position-relative">
                <button 
                  className="btn btn-dark position-relative" 
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
                  <div className="dropdown-menu dropdown-menu-end show p-0 shadow border-0 mt-2" style={{ width: '300px', zIndex: 1050 }}>
                    <div className="card border-0">
                      <div className="card-header bg-light d-flex justify-content-between align-items-center py-2">
                        <h6 className="mb-0 small fw-bold">Notificaciones</h6>
                        {notifications.length > 0 && (
                          <button className="btn btn-link btn-sm p-0 text-decoration-none" onClick={() => setNotifications([])}>
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

              {/* User Info */}
              <div className="d-flex align-items-center text-white">
                <UserCircle size={24} className="me-2" />
                <div>
                  <div className="fw-bold">{userProfile?.username || 'Usuario'}</div>
                  {userProfile?.role && <small className="text-muted">{userProfile.role.replace('_', ' ')}</small>}
                </div>
              </div>

              {/* Logout Button */}
              <button
                className="btn btn-outline-danger d-flex align-items-center"
                title="Salir"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow-1" style={{ overflowY: 'auto' }}>
        <div className="container-fluid p-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
