import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { io } from 'socket.io-client';
import {
  Bell,
  Users,
  LogOut,
  UserCircle,
  Menu as MenuIcon,
  ChevronDown,
  Utensils,
  Archive,
  FileText,
  Settings,
  Ticket,
  CookingPot,
  ShoppingCart
} from 'lucide-react';
import Button from './common/Button';
import IconComponent from '../utilities/icons.utility';

import logonavbar from '../assets/sidebar-logo.png';

interface LayoutProps {
  children: React.ReactNode;
}

interface TicketData {
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

const NavLink: React.FC<{ to: string; title: string; children: React.ReactNode, className?: string }> = ({ to, title, children, className }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
  
    return (
      <Link to={to} title={title} className={`dropdown-item ${isActive ? 'active' : ''} ${className}`}>
        {children}
      </Link>
    );
  };
  
  const NavDropdown: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => {
    return (
      <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          {icon}
          <span className="ms-2">{title}</span>
        </a>
        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
          {children}
        </ul>
      </li>
    );
  };


const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<LowStockNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);


  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js').then((bootstrap) => {
        const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
        dropdownElementList.map(function (dropdownToggleEl) {
          return new bootstrap.Dropdown(dropdownToggleEl);
        });
    })
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
    socket.on('newTicket', (ticket: TicketData) => window.dispatchEvent(new CustomEvent('newTicket', { detail: ticket })));
    socket.on('ticketUpdated', (updatedTicket: TicketData) => window.dispatchEvent(new CustomEvent('ticketUpdated', { detail: updatedTicket })));

    return () => {
      socket.disconnect();
    };
  }, [userProfile]);

  const isAdmin = userProfile?.role === 'company_admin';
  const isKitchen = userProfile?.role === 'kitchen_admin';
  const isEmployee = !!userProfile?.role;

  const renderMenuItems = () => {
    if (isAdmin) {
        return (
            <>
              <NavDropdown title="Cocina" icon={<Utensils size={20} />}>
                <NavLink to="/menu-management" title="Menu Management">Gestión de Menú</NavLink>
                <NavLink to="/shifts" title="Shifts">Turnos</NavLink>
              </NavDropdown>
              <NavDropdown title="Inventory" icon={<Archive size={20} />}>
                <NavLink to="/inventory/audit" title="Audits">Audits</NavLink>
                <NavLink to="/reports/inventory-variance" title="Variance Reports">Variance Reports</NavLink>
                <NavLink to="/waste-logs" title="Waste Logs">Waste Logs</NavLink>
              </NavDropdown>
              <NavDropdown title="Purchasing" icon={<ShoppingCart size={20} />}>
                <NavLink to="/purchases-and-suppliers" title="Suppliers & POs">Suppliers & POs</NavLink>
                <NavLink to="/purchases/new" title="Create Purchase Order">New Purchase Order</NavLink>
              </NavDropdown>
              <li className='nav-item'>
                <Link to="/reports" className='nav-link d-flex align-items-center'>
                    <FileText size={20} /> <span className='ms-2'>Reports</span>
                </Link>
              </li>
              <li className='nav-item'>
                <Link to="/users" className='nav-link d-flex align-items-center'>
                    <Users size={20} /> <span className='ms-2'>Users</span>
                </Link>
              </li>
              <NavDropdown title="Settings" icon={<Settings size={20} />}>
                <NavLink to="/qr-generator" title="QR Generator">QR Generator</NavLink>
              </NavDropdown>
            </>
          );
    }

    if (isKitchen) {
        return (
            <>
                        <NavDropdown title="Tickets" icon={<Ticket size={20} />}>
                          <NavLink to="/ticket-monitor" title="Ticket Monitor">Monitor de Tickets</NavLink>
                          <NavLink to="/kitchen-ticket-create" title="Create Ticket">Crear Ticket</NavLink>
                        </NavDropdown>              <NavDropdown title="Inventory" icon={<Archive size={20} />}>
                <NavLink to="/inventory/audit" title="Audits">Audits</NavLink>
              </NavDropdown>
                        <NavDropdown title="Gestión de Menú" icon={<IconComponent iconName="BookText" size={20} />}>
                          <NavLink to="/menu-management" title="Menu Management">Gestión de Menú</NavLink>
                          <NavLink to="/meal-shifts" title="Daily Production">Producción Diaria</NavLink>
                        </NavDropdown>            </>
          );
    }

    if (isEmployee) {
        return (
            <NavDropdown title="Tickets" icon={<Ticket size={20} />}>
                <NavLink to="/ticket-validation" title="Validate Ticket">Validate Ticket</NavLink>
                <NavLink to="/active-shift" title="Request Shift">Request Shift</NavLink>
            </NavDropdown>
        )
    }

    return null
  };

  return (
    <div className="d-flex flex-column vh-100">
      <header className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top" style={{ backgroundColor: 'var(--color-dark)' }}>
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
            <ul className="navbar-nav mx-auto">
              {renderMenuItems()}
            </ul>

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
                  <div className="dropdown-menu dropdown-menu-end show p-0 shadow-lg border-0 mt-2" style={{ width: '300px', zIndex: 1050, boxShadow: 'var(--shadow-lg)' }}>
                    <div className="card border-0">
                      <div className="card-header bg-light d-flex justify-content-between align-items-center py-2" style={{ backgroundColor: 'var(--color-gray-100)'}}>
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
                              <strong className="text-danger small" style={{ color: 'var(--color-danger)'}}>Stock Bajo</strong>
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
                  {userProfile?.role && <small className="text-muted" style={{ color: 'var(--color-gray-400)'}}>{userProfile.role.replace('_', ' ')}</small>}
                </div>
              </div>

              {/* Logout Button */}
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="d-flex align-items-center"
              >
                <LogOut size={18} />
              </Button>
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
