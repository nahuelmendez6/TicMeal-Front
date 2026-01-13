import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Supplier, CreateSupplierDto, UpdateSupplierDto } from '../types/supplier';
import { useSuppliers } from '../hooks/useSuppliers';

// Esquema de validación con Zod
const supplierSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  contactName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Debe ser un email válido').optional().or(z.literal('')),
  address: z.string().optional(),
});

interface SupplierFormProps {
  supplier: Supplier | null;
  onClose: () => void;
}

const SupplierForm: React.FC<SupplierFormProps> = ({ supplier, onClose }) => {
  const { createSupplier, updateSupplier, isCreating, isUpdating } = useSuppliers();
  const isEditMode = !!supplier;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateSupplierDto>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: '',
      contactName: '',
      phone: '',
      email: '',
      address: '',
    }
  });

  useEffect(() => {
    if (isEditMode) {
      reset(supplier);
    } else {
      reset({
        name: '',
        contactName: '',
        phone: '',
        email: '',
        address: '',
      });
    }
  }, [supplier, isEditMode, reset]);

  const onSubmit = async (data: CreateSupplierDto | UpdateSupplierDto) => {
    try {
      if (isEditMode) {
        await updateSupplier({ id: supplier.id, data });
      } else {
        await createSupplier(data as CreateSupplierDto);
      }
      onClose();
    } catch (error) {
      console.error('Error al guardar el proveedor:', error);
      // Aquí se podría mostrar una notificación de error al usuario
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{isEditMode ? 'Editar Proveedor' : 'Crear Proveedor'}</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Nombre</label>
                <input {...register('name')} id="name" className={`form-control ${errors.name ? 'is-invalid' : ''}`} />
                {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="contactName" className="form-label">Nombre de Contacto</label>
                <input {...register('contactName')} id="contactName" className="form-control" />
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">Teléfono</label>
                <input {...register('phone')} id="phone" className="form-control" />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input {...register('email')} id="email" type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} />
                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="address" className="form-label">Dirección</label>
                <textarea {...register('address')} id="address" className="form-control" rows={3}></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupplierForm;