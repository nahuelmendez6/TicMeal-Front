import React, { useState, useMemo, useEffect } from 'react';
import CategoryTabs from '../components/menu/CategoryTabs';
import ItemForm from '../components/menu/ItemForm';
import RecipeEditor from '../components/menu/RecipeEditor';
import DeleteModal from '../components/menu/DeleteModal';
import StockMovementModal from '../components/ingredient/StockMovementModal';
import { useMenuItems } from '../hooks/useMenu';
import { useRecipes } from '../hooks/useRecipes';
import { categoriesService } from '../services/categories.service';
import { ingredientsService } from '../services/ingredient.service';
import type { Category } from '../types/menu';
import type { Ingredient } from '../types/ingtredient';
import type { RecipeInput, RecipeIngredient } from '../types/recipe';
import type { NutritionalInfo } from '../types/nutritionalInfo';
import { Plus } from 'lucide-react';
import type { MenuItem } from '../types/menu';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ItemList from '../components/menu/ItemList';

interface ItemManagementProps {
  itemType?: 'SIMPLE' | 'COMPUESTO';
}

const initialNutritionalState: NutritionalInfo = {
  calories: null,
  protein: null,
  carbohydrates: null,
  fat: null,
  sugar: null,
  sodium: null,
};

// --- Main Component ---
const ItemManagement: React.FC<ItemManagementProps> = ({ itemType }) => {
  const { items, fetchItems, createItem, updateItem, deleteItem } = useMenuItems();
  const token = localStorage.getItem('token') || '';
  const { syncRecipe } = useRecipes(token);

  const [categories, setCategories] = useState<Category[]>([]);
  const [systemIngredients, setSystemIngredients] = useState<Ingredient[]>([]);
  const [recipeInputs, setRecipeInputs] = useState<RecipeInput[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for Stock Movement Modal
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedItemForStock, setSelectedItemForStock] = useState<MenuItem | null>(null);


  const [newItem, setNewItem] = useState({
    name: '',
    minStock: 0,
    categoryId: '',
    maxOrder: 0,
    iconName: 'Coffee',
    type: itemType || 'SIMPLE',
    nutritionalInfo: itemType === 'SIMPLE' ? { ...initialNutritionalState } : undefined,
  });

  const setNutritionalInfo = (newNutritionalInfo: NutritionalInfo | ((prev: NutritionalInfo) => NutritionalInfo)) => {
    setNewItem(prev => {
      const updatedInfo = typeof newNutritionalInfo === 'function'
        ? newNutritionalInfo(prev.nutritionalInfo as NutritionalInfo)
        : newNutritionalInfo;
      return { ...prev, nutritionalInfo: updatedInfo };
    });
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!token) throw new Error('No autenticado');

        const categoriesData = await categoriesService.getAll(token);
        setCategories(categoriesData);

        if (categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0].name);
          setNewItem(prev => ({ ...prev, categoryId: categoriesData[0].id.toString() }));
        }

        await fetchItems();

        const ingredientsData = await ingredientsService.getAll(token);
        setSystemIngredients(ingredientsData);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [fetchItems, token]);

  // Filter items based on the prop itemType
  const visibleItems = useMemo(() => {
    if (!itemType) return items;
    return items.filter((item: any) => item.type === itemType);
  }, [items, itemType]);

  useEffect(() => {
    if (loading || !selectedCategory) return;
    const categoryHasItems = visibleItems.some(item => item.category?.name === selectedCategory);
    if (!categoryHasItems) {
      const nextCategoryWithItems = categories.find(cat => visibleItems.some(item => item.category?.id === cat.id));
      setSelectedCategory(nextCategoryWithItems ? nextCategoryWithItems.name : null);
    }
  }, [visibleItems, categories, selectedCategory, loading]);

  const handleSubmit = async (formData: typeof newItem, recipeData: RecipeInput[], nutritionalData: NutritionalInfo, observationIds: number[]) => {
    setIsSubmitting(true);
    setError(null);

    // Clean nutritional info to ensure all values are numbers or null, not empty strings
    const cleanedNutritionalInfo = Object.entries(nutritionalData || {}).reduce((acc, [key, value]) => {
      acc[key as keyof NutritionalInfo] = (value === '' || value === null || value === undefined) ? null : Number(value);
      return acc;
    }, {} as NutritionalInfo);

    const itemPayload = {
      ...formData,
      categoryId: formData.categoryId ? parseInt(formData.categoryId, 10) : undefined,
      nutritionalInfo: formData.type === 'SIMPLE' ? cleanedNutritionalInfo : undefined,
      observationIds,
    };

    try {
      if (editingItem) {
        await updateItem(editingItem.id, itemPayload);
        await syncRecipe(editingItem, recipeData);
      } else {
        const savedItem = await createItem(itemPayload);
        if (savedItem && savedItem.id && recipeData.length > 0) {
          const itemForRecipeSync = { id: savedItem.id, recipeIngredients: [] };
          await syncRecipe(itemForRecipeSync, recipeData);
        }
      }

      handleCancelEdit();
      await fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Ocurrió un error al ${editingItem ? 'actualizar' : 'crear'} el ítem`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateClick = () => {
    setEditingItem(null);
    setNewItem({
      name: '',
      minStock: 0,
      maxOrder: 0,
      categoryId: categories.length > 0 ? String(categories[0].id) : '',
      iconName: 'Coffee',
      type: itemType || 'SIMPLE',
      nutritionalInfo: itemType === 'SIMPLE' ? { ...initialNutritionalState } : undefined,
    });
    setRecipeInputs([]);
    setIsModalOpen(true);
  };

  const handleEditClick = (item: MenuItem) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      minStock: item.minStock ?? 0,
      maxOrder: item.maxOrder ?? 0,
      categoryId: String(item.category?.id ?? ''),
      iconName: item.iconName ?? 'Coffee',
      type: item.type || itemType || 'SIMPLE',
      nutritionalInfo: item.nutritionalInfo ?? { ...initialNutritionalState },
    });

    const existingRecipeInputs: RecipeInput[] = item.recipeIngredients.map((ri: RecipeIngredient) => ({
      ingredientId: ri.ingredient.id,
      quantity: ri.quantity,
    }));

    setRecipeInputs(existingRecipeInputs);
    setIsModalOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setNewItem({
      name: '',
      minStock: 0,
      maxOrder: 0,
      categoryId: categories.length > 0 ? String(categories[0].id) : '',
      iconName: 'Coffee',
      type: itemType || 'SIMPLE',
      nutritionalInfo: itemType === 'SIMPLE' ? { ...initialNutritionalState } : undefined,
    });
    setRecipeInputs([]);
    setIsModalOpen(false);
  };

  const handleDeleteClick = (itemId: number) => {
    setItemToDelete(itemId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await deleteItem(itemToDelete);
      await fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error al eliminar el ítem');
    } finally {
      setIsSubmitting(false);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleManageStockClick = (item: MenuItem) => {
    setSelectedItemForStock(item);
    setIsStockModalOpen(true);
  };

  const handleCloseStockModal = () => {
    setIsStockModalOpen(false);
    setSelectedItemForStock(null);
  };

  const handleStockMovementSuccess = () => {
    fetchItems();
  };

  const filteredItems = useMemo(() => {
    if (!selectedCategory) return [];
    return visibleItems.filter(item => item.category?.name === selectedCategory);
  }, [visibleItems, selectedCategory]);


  return (
    <Card>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <div className="d-flex justify-content-end mb-3">
        <Button onClick={handleCreateClick}>
          <Plus size={18} className="me-2" /> {itemType === 'COMPUESTO' ? 'Nuevo P. Compuesto' : 'Nuevo P. Simple'}
        </Button>
      </div>

      <div>
        {loading ? (
          <div className="text-center"><div className="spinner-border spinner-border-sm" role="status"><span className="visually-hidden">Cargando...</span></div></div>
        ) : (
          <CategoryTabs
            categories={categories}
            items={visibleItems as any}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        )}

        <ItemList
          items={filteredItems as any}
          selectedCategory={selectedCategory}
          onEdit={handleEditClick as any}
          onDelete={handleDeleteClick}
          onManageStock={handleManageStockClick}
          itemType={itemType}
        />
      </div>

      {isModalOpen && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingItem ? 'Editar Item' : 'Crear Item'}</h5>
                <button type="button" className="btn-close" onClick={handleCancelEdit}></button>
              </div>
              <div className="modal-body">
                <ItemForm
                  editingItem={editingItem}
                  categories={categories}
                  onSubmit={handleSubmit}
                  newItemState={newItem}
                  setNewItemState={setNewItem}
                  recipeIngredients={recipeInputs}
                  nutritionalInfoState={[newItem.nutritionalInfo as NutritionalInfo, setNutritionalInfo]}
                  onCancel={handleCancelEdit}
                  renderRecipeEditor={() => (
                    <RecipeEditor
                      editingItem={editingItem as any}
                      ingredients={systemIngredients}
                      recipeState={[recipeInputs, setRecipeInputs]}
                    />
                  )}
                />
              </div>
              <div className="modal-footer">
                <Button variant="secondary" onClick={handleCancelEdit}>Cancelar</Button>
                <Button type="submit" form="item-form" disabled={isSubmitting}>
                  {isSubmitting ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isStockModalOpen && selectedItemForStock && (
        <StockMovementModal
          item={selectedItemForStock}
          itemType="menuItem"
          token={token}
          onClose={handleCloseStockModal}
          onSuccess={() => {
            handleCloseStockModal();
            handleStockMovementSuccess();
          }}
        />
      )}

      <DeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        loading={isSubmitting}
      />
    </Card>
  );
};

export default ItemManagement;
