import { useState, useCallback } from 'react';
import { timeslotService } from '../services/timeslot.service';
import type { Timeslot, CreateTimeslotDto, UpdateTimeslotDto } from '../types/reservation';
import { useAuth } from '../contexts/AuthContext';

export const useTimeslots = () => {
  const { userProfile } = useAuth();
  const companyId = userProfile?.company?.id;

  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTimeslots = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await timeslotService.getAll(companyId);
      setTimeslots(data);
    } catch (err: any) {
      console.error('[useTimeslots] Error fetching timeslots:', err);
      const status = err.response?.status;
      const msg = err.response?.data?.message || err.message;
      setError(`Error fetching timeslots${status ? ` (${status})` : ''}: ${msg}`);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const createTimeslot = async (data: CreateTimeslotDto) => {
    if (!companyId) return;
    setLoading(true);
    setError(null);
    try {
      await timeslotService.create(companyId, data);
      await fetchTimeslots();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating timeslot');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTimeslot = async (id: string, data: UpdateTimeslotDto) => {
    if (!companyId) return;
    setLoading(true);
    setError(null);
    try {
      await timeslotService.update(companyId, id, data);
      await fetchTimeslots();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error updating timeslot');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTimeslot = async (id: string) => {
    if (!companyId) return;
    setLoading(true);
    setError(null);
    try {
      await timeslotService.delete(companyId, id);
      await fetchTimeslots();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error deleting timeslot');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    timeslots,
    loading,
    error,
    fetchTimeslots,
    createTimeslot,
    updateTimeslot,
    deleteTimeslot
  };
};
