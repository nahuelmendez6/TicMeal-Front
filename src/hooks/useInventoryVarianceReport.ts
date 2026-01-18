// src/hooks/useInventoryVarianceReport.ts
import { useState, useCallback } from 'react';
import { getInventoryVarianceReport } from '../services/reportService'; // Assuming this function exists
import type { InventoryVariance } from '../types/inventory';
import { useAuth } from '../contexts/AuthContext'; // Assuming useAuth for token

export const useInventoryVarianceReport = () => {
  const [reportData, setReportData] = useState<InventoryVariance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchReport = useCallback(async (startDate: string, endDate: string) => {
    if (!token) {
      setError('Authentication token not found.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getInventoryVarianceReport(token, startDate, endDate);
      setReportData(data);
    } catch (err) {
      setError('Failed to fetch inventory variance report.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  return {
    reportData,
    isLoading,
    error,
    fetchReport,
  };
};
