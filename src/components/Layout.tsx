import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { io } from 'socket.io-client';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';

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

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<LowStockNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Only import bootstrap if needed for dropdowns or tooltips outside our components
    import('bootstrap/dist/js/bootstrap.bundle.min.js');

    let companyId = (userProfile as any)?.companyId || (userProfile as any)?.company?.id;
    
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <Sidebar 
        userProfile={userProfile} 
        isOpen={isSidebarOpen} 
      />
      
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="modal-backdrop fade show d-lg-none" 
          style={{ zIndex: 1035 }}
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div className="main-content">
        <TopHeader 
          userProfile={userProfile}
          onLogout={handleLogout}
          notifications={notifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          onClearNotifications={() => setNotifications([])}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
