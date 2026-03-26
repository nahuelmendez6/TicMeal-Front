import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Supplier, CreateSupplierDto, UpdateSupplierDto } from '../types/supplier';
import { useSuppliers } from '../hooks/useSuppliers';
import Input from './common/Input';
import Button from './common/Button';

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
    control,
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
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input 
                    {...field} 
                    label="Nombre" 
                    id="name" 
                    className={errors.name ? 'is-invalid' : ''}
                  />
                )}
              />
              {errors.name && <div className="invalid-feedback d-block">{errors.name.message}</div>}

              <Controller
                name="contactName"
                control={control}
                render={({ field }) => (
                  <Input {...field} label="Nombre de Contacto" id="contactName" />
                )}
              />

              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input {...field} label="Teléfono" id="phone" />
                )}
              />
              
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input 
                    {...field} 
                    label="Email" 
                    id="email" 
                    type="email" 
                    className={errors.email ? 'is-invalid' : ''}
                  />
                )}
              />
              {errors.email && <div className="invalid-feedback d-block">{errors.email.message}</div>}

              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Input {...field} label="Dirección" id="address" />
                )}
              />
            </div>
            <div className="modal-footer">
              <Button variant="secondary" onClick={onClose} disabled={isLoading}>Cancelar</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupplierForm;