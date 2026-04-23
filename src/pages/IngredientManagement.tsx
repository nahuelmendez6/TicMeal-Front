// src/pages/IngredientManagement.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { ingredientsService, type IngredientSaveDto } from '../services/ingredient.service';
import IngredientTable from '../components/ingredient/IngredientTable';
import IngredientForm from '../components/ingredient/IngredientForm';
import StockMovementModal from '../components/ingredient/StockMovementModal';
import DeleteModal from '../components/menu/DeleteModal';
import type { Ingredient } from '../types/ingtredient';
import { useAuth } from '../contexts/AuthContext';
import PageLayout from '../components/common/PageLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const IngredientManagement: React.FC = () => {
  const { token } = useAuth();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Data for Modals
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [selectedIngredientForStock, setSelectedIngredientForStock] = useState<Ingredient | null>(null);
  const [ingredientToDelete, setIngredientToDelete] = useState<number | null>(null);

  const fetchIngredients = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await ingredientsService.getAll(token);
      setIngredients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ingredients');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  // Handlers for Create/Edit Modal
  const handleOpenFormModal = (ingredient: Ingredient | null = null) => {
    setEditingIngredient(ingredient);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setEditingIngredient(null);
    setIsFormModalOpen(false);
  };

  const handleSaveIngredient = async (ingredientData: IngredientSaveDto) => {
    if (!token) return;
    try {
      if (editingIngredient) {
        await ingredientsService.update(token, editingIngredient.id, ingredientData as Partial<IngredientSaveDto>);
      } else {
        await ingredientsService.create(token, ingredientData);
      }
      fetchIngredients();
      handleCloseFormModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save ingredient');
    }
  };

  // Handlers for Stock Management Modal
  const handleOpenStockModal = (ingredient: Ingredient) => {
    setSelectedIngredientForStock(ingredient);
    setIsStockModalOpen(true);
  };

  const handleCloseStockModal = () => {
    setSelectedIngredientForStock(null);
    setIsStockModalOpen(false);
  };

  const handleStockMovementSuccess = () => {
    fetchIngredients();
  };

  // Handlers for Delete Modal
  const handleOpenDeleteModal = (id: number) => {
    setIngredientToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIngredientToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!token || !ingredientToDelete) return;
    try {
      await ingredientsService.remove(token, ingredientToDelete);
      fetchIngredients();
      handleCloseDeleteModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete ingredient');
    }
  };

  return (
    <PageLayout title="Gestión de Insumos">
      <div className="d-flex justify-content-end mb-3">
        <Button onClick={() => handleOpenFormModal()}>
          <Plus size={18} className="me-2" /> Nuevo Insumo
        </Button>
      </div>
      <Card>
        {error && <div className="alert alert-danger">{error}</div>}
        {loading ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : (
          <IngredientTable
            ingredients={ingredients}
            onEdit={handleOpenFormModal}
            onDelete={handleOpenDeleteModal}
            onManageStock={handleOpenStockModal}
          />
        )}
      </Card>

      {isFormModalOpen && (
        <IngredientForm
          editingIngredient={editingIngredient}
          onSave={handleSaveIngredient}
          onCancel={handleCloseFormModal}
        />
      )}

      {isStockModalOpen && selectedIngredientForStock && (
        <StockMovementModal
          item={selectedIngredientForStock}
          itemType="ingredient"
          token={token!}
          onClose={handleCloseStockModal}
          onSuccess={() => {
            handleCloseStockModal();
            handleStockMovementSuccess();
          }}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          open={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={confirmDelete}
          loading={false} // You can add loading state for delete if needed
        />
      )}
    </PageLayout>
  );
};

export default IngredientManagement;
