import { useState, useCallback } from 'react';
import { timeslotService } from '../services/timeslot.service';
import { Timeslot, CreateTimeslotDto, UpdateTimeslotDto } from '../types/reservation';

export const useTimeslots = () => {
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTimeslots = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await timeslotService.getAll();
      setTimeslots(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching timeslots');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTimeslot = async (data: CreateTimeslotDto) => {
    setLoading(true);
    setError(null);
    try {
      await timeslotService.create(data);
      await fetchTimeslots();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating timeslot');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTimeslot = async (id: string, data: UpdateTimeslotDto) => {
    setLoading(true);
    setError(null);
    try {
      await timeslotService.update(id, data);
      await fetchTimeslots();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error updating timeslot');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTimeslot = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await timeslotService.delete(id);
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
