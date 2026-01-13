import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPurchaseOrders, getPurchaseOrderById, createPurchaseOrder, updatePurchaseOrder, receivePurchaseOrder, deletePurchaseOrder } from '../services/purchase.service';
import type { CreatePurchaseOrderDto, UpdatePurchaseOrderDto } from '../types/purchaseOrder';

export const usePurchaseOrders = () => {
  const queryClient = useQueryClient();

  const { data: purchaseOrders, isLoading, isError, error } = useQuery({
    queryKey: ['purchaseOrders'],
    queryFn: getPurchaseOrders,
  });

  const getPurchaseOrderQuery = (id: number | undefined) => useQuery({
    queryKey: ['purchaseOrder', id],
    queryFn: () => getPurchaseOrderById(id!),
    enabled: !!id,
  });

  const createPurchaseOrderMutation = useMutation({
    mutationFn: (newPurchaseOrder: CreatePurchaseOrderDto) => createPurchaseOrder(newPurchaseOrder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
    },
  });

  const updatePurchaseOrderMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePurchaseOrderDto }) => updatePurchaseOrder(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      queryClient.invalidateQueries({ queryKey: ['purchaseOrder', id] });
    },
  });

  const receivePurchaseOrderMutation = useMutation({
    mutationFn: (id: number) => receivePurchaseOrder(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      queryClient.invalidateQueries({ queryKey: ['purchaseOrder', id] });
    },
  });

  const deletePurchaseOrderMutation = useMutation({
    mutationFn: (id: number) => deletePurchaseOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
    },
  });

  return {
    purchaseOrders,
    isLoading,
    isError,
    error,
    getPurchaseOrderQuery,
    createPurchaseOrder: createPurchaseOrderMutation.mutateAsync,
    updatePurchaseOrder: updatePurchaseOrderMutation.mutateAsync,
    receivePurchaseOrder: receivePurchaseOrderMutation.mutateAsync,
    deletePurchaseOrder: deletePurchaseOrderMutation.mutateAsync,
    isCreating: createPurchaseOrderMutation.isPending,
    isUpdating: updatePurchaseOrderMutation.isPending,
    isReceiving: receivePurchaseOrderMutation.isPending,
    isDeleting: deletePurchaseOrderMutation.isPending,
  };
};
