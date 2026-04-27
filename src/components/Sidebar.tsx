import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Users,
  Utensils,
  Archive,
  FileText,
  Settings,
  Ticket,
  ShoppingCart,
  LayoutDashboard
} from 'lucide-react';
import logonavbar from '../assets/sidebar-logo.png';

interface SidebarProps {
  userProfile: any;
  isOpen: boolean;
}

const SidebarLink: React.FC<{ to: string; title: string; icon: React.ReactNode }> = ({ to, title, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className={`sidebar-link ${isActive ? 'active' : ''}`}>
      {icon}
      <span className="ms-3">{title}</span>
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ userProfile, isOpen }) => {
  const isAdmin = userProfile?.role === 'company_admin';
  const isKitchen = userProfile?.role === 'kitchen_admin';
  const isEmployee = !!userProfile?.role;

  const renderMenuItems = () => {
    if (isAdmin) {
      return (
        <>
          <SidebarLink to="/menu-management" title="Gestión de Menú" icon={<Utensils size={20} />} />
          <SidebarLink to="/shifts" title="Turnos" icon={<Utensils size={20} />} />
          <SidebarLink to="/production-plan" title="Plan de Producción" icon={<Utensils size={20} />} />
          
          <div className="sidebar-group-label px-4 py-2 small text-uppercase text-muted">Inventario</div>
          <SidebarLink to="/inventory/audit" title="Audits" icon={<Archive size={20} />} />
          <SidebarLink to="/reports/inventory-variance" title="Variance Reports" icon={<Archive size={20} />} />
          <SidebarLink to="/waste-logs" title="Waste Logs" icon={<Archive size={20} />} />
          
          <div className="sidebar-group-label px-4 py-2 small text-uppercase text-muted">Compras</div>
          <SidebarLink to="/purchases-and-suppliers" title="Proveedores y OC" icon={<ShoppingCart size={20} />} />
          <SidebarLink to="/purchases/new" title="Nueva OC" icon={<ShoppingCart size={20} />} />
          
          <div className="sidebar-group-label px-4 py-2 small text-uppercase text-muted">Sistema</div>
          <SidebarLink to="/reports" title="Reportes" icon={<FileText size={20} />} />
          <SidebarLink to="/users" title="Usuarios" icon={<Users size={20} />} />
          <SidebarLink to="/qr-generator" title="Generador QR" icon={<Settings size={20} />} />
        </>
      );
    }

    if (isKitchen) {
      return (
        <>
          <SidebarLink to="/ticket-monitor" title="Monitor de Tickets" icon={<Ticket size={20} />} />
          <SidebarLink to="/kitchen-ticket-create" title="Crear Ticket" icon={<Ticket size={20} />} />
          <SidebarLink to="/inventory/audit" title="Audits" icon={<Archive size={20} />} />
          <SidebarLink to="/menu-management" title="Gestión de Menú" icon={<Utensils size={20} />} />
          <SidebarLink to="/meal-shifts" title="Gestión de Producción" icon={<Utensils size={20} />} />
          <SidebarLink to="/production-plan" title="Plan de Producción" icon={<Utensils size={20} />} />
        </>
      );
    }

    if (isEmployee) {
      return (
        <>
          <SidebarLink to="/ticket-validation" title="Validar Ticket" icon={<Ticket size={20} />} />
          <SidebarLink to="/active-shift" title="Solicitar Turno" icon={<Utensils size={20} />} />
        </>
      );
    }

    return null;
  };

  return (
    <aside className={`sidebar ${isOpen ? 'show' : ''}`}>
      <div className="sidebar-header d-flex align-items-center">
        <Link to="/" className="d-flex align-items-center text-decoration-none">
          <img src={logonavbar} alt="Logo" style={{ height: '35px' }} />
        </Link>
      </div>
      <nav className="sidebar-nav">
        <SidebarLink to="/" title="Dashboard" icon={<LayoutDashboard size={20} />} />
        {renderMenuItems()}
      </nav>
    </aside>
  );
};

export default Sidebar;
