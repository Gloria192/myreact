import { createContext } from 'react';
import type { Schedule, Booking } from '../types';

export interface BusContextType {
  schedules: Schedule[];
  bookings: Booking[];
  addSchedule: (schedule: Schedule) => void;
  updateSchedule: (id: string, schedule: Partial<Schedule>) => void;
  deleteSchedule: (id: string) => void;
  addBooking: (booking: Booking) => void;
  cancelBooking: (bookingId: string) => void;
  updateAvailableSeats: (scheduleId: string, seatsBooked: number) => void;
}

export const BusContext = createContext<BusContextType | undefined>(undefined);
