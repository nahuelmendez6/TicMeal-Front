import Button from '../components/common/Button';
import PageLayout from '../components/common/PageLayout';
import Card from '../components/common/Card';
import React, { useState } from 'react';
import SuppliersTable from '../components/SuppliersTable';
import SupplierForm from '../components/SupplierForm';
import DeleteSupplierDialog from '../components/DeleteSupplierDialog';
import PurchasesTable from '../components/PurchasesTable'; // Import PurchasesTable
import ReceiveOrderDialog from '../components/ReceiveOrderDialog'; // Import ReceiveOrderDialog
import type { Supplier } from '../types/supplier';
import type { PurchaseOrder } from '../types/purchaseOrder'; // Import PurchaseOrder type
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const PurchasesAndSuppliersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'suppliers' | 'purchaseOrders'>('suppliers');
  const [isSupplierFormOpen, setIsSupplierFormOpen] = useState(false);
  const [isSupplierDeleteOpen, setIsSupplierDeleteOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const [isReceiveOrderOpen, setIsReceiveOrderOpen] = useState(false);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState<PurchaseOrder | null>(null);

  const navigate = useNavigate(); // Initialize useNavigate

  const handleCreateSupplier = () => {
    setSelectedSupplier(null);
    setIsSupplierFormOpen(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsSupplierFormOpen(true);
  };

  const handleDeleteSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsSupplierDeleteOpen(true);
  };

  const handleCloseSupplierModals = () => {
    setIsSupplierFormOpen(false);
    setIsSupplierDeleteOpen(false);
    setSelectedSupplier(null);
  };

  const handleReceivePurchaseOrder = (order: PurchaseOrder) => {
    setSelectedPurchaseOrder(order);
    setIsReceiveOrderOpen(true);
  };

  const handleCloseReceiveOrderDialog = () => {
    setIsReceiveOrderOpen(false);
    setSelectedPurchaseOrder(null);
  };

  return (
    <PageLayout title="Gestión de Compras">
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'suppliers' ? 'active' : ''}`}
            onClick={() => setActiveTab('suppliers')}
          >
            Proveedores
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'purchaseOrders' ? 'active' : ''}`}
            onClick={() => setActiveTab('purchaseOrders')}
          >
            Órdenes de Compra
          </button>
        </li>
      </ul>

      <div className="tab-content">
        {activeTab === 'suppliers' && (
          <div className="tab-pane fade show active">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h4 mb-0 text-gray-800">Listado de Proveedores</h2>
              <Button onClick={handleCreateSupplier} className="d-flex align-items-center">
                <Plus size={20} className="me-2" />
                Crear Proveedor
              </Button>
            </div>
            <Card>
              <SuppliersTable onEdit={handleEditSupplier} onDelete={handleDeleteSupplier} />
            </Card>
          </div>
        )}

        {activeTab === 'purchaseOrders' && (
          <div className="tab-pane fade show active">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h4 mb-0 text-gray-800">Listado de Órdenes de Compra</h2>
              <Button
                onClick={() => navigate('/purchases/new')}
                className="d-flex align-items-center"
              >
                <Plus size={20} className="me-2" />
                Crear Orden de Compra
              </Button>
            </div>
            <Card>
              <PurchasesTable onReceive={handleReceivePurchaseOrder} />
            </Card>
          </div>
        )}
      </div>

      {isSupplierFormOpen && (
        <SupplierForm
          supplier={selectedSupplier}
          onClose={handleCloseSupplierModals}
        />
      )}

      {isSupplierDeleteOpen && selectedSupplier && (
        <DeleteSupplierDialog
          supplier={selectedSupplier}
          onClose={handleCloseSupplierModals}
        />
      )}

      {isReceiveOrderOpen && selectedPurchaseOrder && (
        <ReceiveOrderDialog
          order={selectedPurchaseOrder}
          onClose={handleCloseReceiveOrderDialog}
        />
      )}
    </PageLayout>
  );
};

export default PurchasesAndSuppliersPage;