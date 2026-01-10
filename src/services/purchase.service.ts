import api from './api';
import type { PurchaseOrder, CreatePurchaseOrderDto, UpdatePurchaseOrderDto } from '../types/purchaseOrder';

const API_URL = '/purchases';

export const getPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
  const { data } = await api.get<PurchaseOrder[]>(API_URL);
  return data;
};

export const getPurchaseOrderById = async (id: number): Promise<PurchaseOrder> => {
  const { data } = await api.get<PurchaseOrder>(`${API_URL}/${id}`);
  return data;
};

export const createPurchaseOrder = async (purchaseOrderData: CreatePurchaseOrderDto): Promise<PurchaseOrder> => {
  const { data } = await api.post<PurchaseOrder>(API_URL, purchaseOrderData);
  return data;
};

export const updatePurchaseOrder = async (id: number, purchaseOrderData: UpdatePurchaseOrderDto): Promise<PurchaseOrder> => {
  const { data } = await api.patch<PurchaseOrder>(`${API_URL}/${id}`, purchaseOrderData);
  return data;
};

export const receivePurchaseOrder = async (id: number): Promise<PurchaseOrder> => {
  const { data } = await api.post<PurchaseOrder>(`${API_URL}/${id}/receive`);
  return data;
};

export const deletePurchaseOrder = async (id: number): Promise<void> => {
  await api.delete(`${API_URL}/${id}`);
};
