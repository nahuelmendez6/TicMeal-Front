// src/hooks/useWaste.ts
import { useState, useCallback } from 'react';
import { wasteService } from '../services/waste.service';
import type { CreateWasteLogDto, WasteLog } from '../types/waste';

export const useWaste = () => {
  const [wasteLogs, setWasteLogs] = useState<WasteLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWasteLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await wasteService.getWasteLogs();
      setWasteLogs(data);
    } catch (err) {
      setError('Failed to fetch waste logs.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createWasteLog = useCallback(async (wasteData: CreateWasteLogDto) => {
    setIsLoading(true);
    setError(null);
    try {
      const newLog = await wasteService.createWasteLog(wasteData);
      setWasteLogs((prevLogs) => [newLog, ...prevLogs]);
      return newLog;
    } catch (err) {
      setError('Failed to create waste log.');
      console.error(err);
      throw err; // Re-throw to be caught in the component
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    wasteLogs,
    isLoading,
    error,
    fetchWasteLogs,
    createWasteLog,
  };
};
