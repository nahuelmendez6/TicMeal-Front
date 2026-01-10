import api from './api';
import type { Supplier, CreateSupplierDto, UpdateSupplierDto } from '../types/supplier';

const API_URL = '/suppliers';

export const getSuppliers = async (): Promise<Supplier[]> => {
  const { data } = await api.get<Supplier[]>(API_URL);
  return data;
};

export const createSupplier = async (supplierData: CreateSupplierDto): Promise<Supplier> => {
  const { data } = await api.post<Supplier>(API_URL, supplierData);
  return data;
};

export const updateSupplier = async (id: number, supplierData: UpdateSupplierDto): Promise<Supplier> => {
  const { data } = await api.patch<Supplier>(`${API_URL}/${id}`, supplierData);
  return data;
};

export const deleteSupplier = async (id: number): Promise<void> => {
  await api.delete(`${API_URL}/${id}`);
};
