// src/services/booking.service.ts
import api from './api';
import { type User } from '../types/user';
import {type MenuItem } from '../types/menu';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  WAITLISTED = 'WAITLISTED',
}

// Minimal MealShift interface based on backend description
// If a more comprehensive type exists elsewhere, it should be used instead.
export interface MealShift {
  id: number;
  name: string;
  quantityAvailable: number;
  // Add other relevant MealShift properties as they become known or needed
}

export interface Booking {
  id: number;
  status: BookingStatus;
  user: User;
  mealShift: MealShift;
  menuItem: MenuItem;
  createdAt: string;
  updatedAt: string;
  // Add other relevant Booking properties
}

export interface CreateBookingDto {
  mealShiftId: number;
  menuItemId: number;
}

const createBooking = async (bookingData: CreateBookingDto): Promise<Booking> => {
  const response = await api.post<Booking>('/bookings', bookingData);
  return response.data;
};

const getAllBookings = async (): Promise<Booking[]> => {
  const response = await api.get<Booking[]>('/bookings');
  return response.data;
};

export const bookingService = {
  createBooking,
  getAllBookings,
};
