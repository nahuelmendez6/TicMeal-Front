// src/hooks/useProduction.ts
import { useState, useCallback } from 'react';
import { productionService, type PickingList } from '../services/production.service';

export const useProduction = () => {
  const [pickingList, setPickingList] = useState<PickingList | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPickingList = useCallback(async (date: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productionService.getPickingListByDate(date);
      setPickingList(data);
      return data;
    } catch (err: any) {
      console.error('Failed to fetch picking list:', err);
      setError(err.response?.data?.message || 'Failed to load picking list.');
      setPickingList(null);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const triggerManualPlan = useCallback(async (date: string): Promise<any | undefined> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await productionService.triggerProductionPlanManual(date);
      // Optionally, refetch the picking list after triggering the plan
      // await fetchPickingList(date);
      return result;
    } catch (err: any) {
      console.error('Failed to trigger manual production plan:', err);
      setError(err.response?.data?.message || 'Failed to trigger production plan.');
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    pickingList,
    isLoading,
    error,
    fetchPickingList,
    triggerManualPlan,
  };
};
