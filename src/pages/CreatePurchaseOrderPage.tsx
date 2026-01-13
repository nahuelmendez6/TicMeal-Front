import React from 'react';
import { useForm, useFieldArray, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { usePurchaseOrders } from '../hooks/usePurchaseOrders';
import { useSuppliers } from '../hooks/useSuppliers';
import { Plus, Trash2 } from 'lucide-react';
import type { CreatePurchaseOrderDto } from '../types/purchaseOrder';

// Zod schema for a single purchase order item (FORM STATE)
const purchaseOrderItemSchema = z.object({
  productId: z.number().min(1, 'Producto requerido'),
  productType: z.enum(['INGREDIENT', 'MENU_ITEM']),
  name: z.string().min(1, 'Nombre de producto requerido'), // This will be set by autocomplete
  quantity: z.number().min(1, 'Cantidad debe ser al menos 1'),
  unitCost: z.number().min(0.01, 'Costo unitario debe ser mayor que 0'),
  lot: z.string().optional(),
  expirationDate: z.string().optional(),
});

// Zod schema for the entire purchase order form (FORM STATE)
const createPurchaseOrderFormSchema = z.object({
  supplierId: z.number().min(1, 'Proveedor es requerido'),
  orderDate: z.string().min(1, 'Fecha de orden es requerida'),
  notes: z.string().optional(),
  items: z.array(purchaseOrderItemSchema).min(1, 'Debe haber al menos un item en la orden'),
});

// Type for our form values, inferred from the Zod schema
type PurchaseOrderFormValues = z.infer<typeof createPurchaseOrderFormSchema>;

const CreatePurchaseOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const { createPurchaseOrder, isCreating } = usePurchaseOrders();
  const { suppliers } = useSuppliers();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PurchaseOrderFormValues>({
    resolver: zodResolver(createPurchaseOrderFormSchema),
    defaultValues: {
      orderDate: new Date().toISOString().split('T')[0],
      items: [{ productId: 0, productType: 'INGREDIENT', name: '', quantity: 1, unitCost: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const onSubmit: SubmitHandler<PurchaseOrderFormValues> = async (data) => {
    try {
      // Transform form data to match CreatePurchaseOrderDto
      const purchaseOrderDto: CreatePurchaseOrderDto = {
        ...data,
        items: data.items.map(({ name, ...item }) => ({ // remove 'name' from each item
          ...item,
          expirationDate: item.expirationDate ? new Date(item.expirationDate).toISOString() : undefined,
        })),
      };

      const newOrder = await createPurchaseOrder(purchaseOrderDto);
      if (newOrder) {
        navigate(`/purchases/${newOrder.id}`);
      } else {
        // Handle case where order creation fails but doesn't throw
        console.error('La creación de la orden no devolvió una orden.');
      }
    } catch (error) {
      console.error('Error al crear la orden de compra:', error);
    }
  };

  return (
    <div className="container-fluid">
      <h1 className="h3 mb-4 text-gray-800">Crear Orden de Compra</h1>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="h5 mb-3 text-gray-700">Datos Generales</h2>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="supplierId" className="form-label">Proveedor</label>
                <select
                  {...register('supplierId', { valueAsNumber: true })}
                  id="supplierId"
                  className={`form-select ${errors.supplierId ? 'is-invalid' : ''}`}
                >
                  <option value="">Seleccione un proveedor</option>
                  {suppliers?.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
                {errors.supplierId && <div className="invalid-feedback">{errors.supplierId.message}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="orderDate" className="form-label">Fecha de Orden</label>
                <input
                  {...register('orderDate')}
                  id="orderDate"
                  type="date"
                  className={`form-control ${errors.orderDate ? 'is-invalid' : ''}`}
                />
                {errors.orderDate && <div className="invalid-feedback">{errors.orderDate.message}</div>}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="notes" className="form-label">Notas</label>
              <textarea
                {...register('notes')}
                id="notes"
                className="form-control"
                rows={3}
              ></textarea>
            </div>

            <h2 className="h5 mb-3 text-gray-700">Items de la Orden</h2>
            {fields.map((field, index) => (
              <div key={field.id} className="row mb-3 align-items-end border-bottom pb-3">
                <div className="col-md-4">
                  <label htmlFor={`items.${index}.name`} className="form-label">Producto</label>
                  <input
                    {...register(`items.${index}.name`)}
                    id={`items.${index}.name`}
                    className={`form-control ${errors.items?.[index]?.name ? 'is-invalid' : ''}`}
                    placeholder="Buscar producto..."
                  />
                  {errors.items?.[index]?.name && <div className="invalid-feedback">{errors.items?.[index]?.name?.message}</div>}
                </div>
                <div className="col-md-2">
                  <label htmlFor={`items.${index}.quantity`} className="form-label">Cantidad</label>
                  <input
                    {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                    id={`items.${index}.quantity`}
                    type="number"
                    className={`form-control ${errors.items?.[index]?.quantity ? 'is-invalid' : ''}`}
                  />
                  {errors.items?.[index]?.quantity && <div className="invalid-feedback">{errors.items?.[index]?.quantity?.message}</div>}
                </div>
                <div className="col-md-2">
                  <label htmlFor={`items.${index}.unitCost`} className="form-label">Costo Unitario</label>
                  <input
                    {...register(`items.${index}.unitCost`, { valueAsNumber: true })}
                    id={`items.${index}.unitCost`}
                    type="number"
                    step="0.01"
                    className={`form-control ${errors.items?.[index]?.unitCost ? 'is-invalid' : ''}`}
                  />
                  {errors.items?.[index]?.unitCost && <div className="invalid-feedback">{errors.items?.[index]?.unitCost?.message}</div>}
                </div>
                <div className="col-md-2">
                  <label htmlFor={`items.${index}.lot`} className="form-label">Lote</label>
                  <input
                    {...register(`items.${index}.lot`)}
                    id={`items.${index}.lot`}
                    className="form-control"
                  />
                </div>
                <div className="col-md-1">
                  <label htmlFor={`items.${index}.expirationDate`} className="form-label">Venc.</label>
                  <input
                    {...register(`items.${index}.expirationDate`)}
                    id={`items.${index}.expirationDate`}
                    type="date"
                    className="form-control"
                  />
                </div>
                <div className="col-md-1 d-flex align-items-end">
                  <button
                    type="button"
                    className="btn btn-outline-danger w-100"
                    onClick={() => remove(index)}
                    title="Eliminar Item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {errors.items && typeof errors.items.message === 'string' && <div className="text-danger mb-3">{errors.items.message}</div>}

            <button
              type="button"
              className="btn btn-outline-secondary d-flex align-items-center mb-4"
              onClick={() => append({ productId: 0, productType: 'INGREDIENT', name: '', quantity: 1, unitCost: 0 })}
            >
              <Plus size={20} className="me-2" />
              Añadir Item
            </button>

            <div className="d-flex justify-content-end">
              <button type="button" className="btn btn-secondary me-2" onClick={() => navigate(-1)} disabled={isCreating}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={isCreating}>
                {isCreating ? 'Creando...' : 'Crear Orden de Compra'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePurchaseOrderPage;
