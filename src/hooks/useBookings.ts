// src/hooks/useBookings.ts
import { useState, useEffect } from 'react';
import { bookingService, type Booking, type CreateBookingDto } from '../services/booking.service';

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await bookingService.getAllBookings();
      setBookings(data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError('Failed to load bookings.');
    } finally {
      setIsLoading(false);
    }
  };

  const createBooking = async (bookingData: CreateBookingDto): Promise<Booking | undefined> => {
    setIsLoading(true);
    setError(null);
    try {
      const newBooking = await bookingService.createBooking(bookingData);
      // Optionally, refresh the list of bookings after creation
      // fetchAllBookings();
      return newBooking;
    } catch (err: any) {
      console.error('Failed to create booking:', err);
      setError(err.response?.data?.message || 'Failed to create booking.');
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  // Optionally, fetch all bookings on hook mount if this hook is primarily for an admin view
  // useEffect(() => {
  //   fetchAllBookings();
  // }, []);

  return {
    bookings,
    isLoading,
    error,
    fetchAllBookings,
    createBooking,
  };
};