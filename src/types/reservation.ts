export interface Timeslot {
  id: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  capacity: number;
  isActive: boolean;
}

export interface CreateTimeslotDto {
  startTime: string;
  endTime: string;
  capacity: number;
}

export interface UpdateTimeslotDto {
  startTime?: string;
  endTime?: string;
  capacity?: number;
  isActive?: boolean;
}

export interface Reservation {
  id: string;
  date: string;
  timeslotId: string;
  menuOptionId: string;
  userId: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
}
