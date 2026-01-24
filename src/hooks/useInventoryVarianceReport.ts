// src/hooks/useInventoryVarianceReport.ts
import { useState, useCallback } from 'react';
import { getInventoryVarianceReport } from '../services/reportService';
import type { InventoryVariance } from '../types/inventory'; // Import the new type
import { useAuth } from '../contexts/AuthContext';

export const useInventoryVarianceReport = () => {
  const [reportData, setReportData] = useState<InventoryVariance | null>(null); // Changed type and initial state
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
      setReportData(data); // Store the object directly
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