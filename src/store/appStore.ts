import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PickupPoint, BusCompany, Schedule, Booking } from '../types';
import { DEFAULT_PICKUP_POINTS, BUS_COMPANIES } from '../types';

interface AppState {
  pickupPoints: PickupPoint[];
  companies: BusCompany[];
  schedules: Schedule[];
  bookings: Booking[];
  selectedSeats: number[];
  occupiedSeats: Record<string, number[]>;
  
  setSelectedSeats: (seats: number[]) => void;
  toggleSeat: (seatNumber: number) => void;
  clearSelectedSeats: () => void;
  
  addPickupPoint: (point: Omit<PickupPoint, 'id'>) => void;
  updatePickupPoint: (id: string, updates: Partial<PickupPoint>) => void;
  deletePickupPoint: (id: string) => void;
  
  addCompany: (company: Omit<BusCompany, 'id'>) => void;
  updateCompany: (id: string, updates: Partial<BusCompany>) => void;
  
  addSchedule: (schedule: Omit<Schedule, 'id'>) => void;
  updateSchedule: (id: string, updates: Partial<Schedule>) => void;
  deleteSchedule: (id: string) => void;
  
  addBooking: (booking: Omit<Booking, 'id' | 'ticketCode'>) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  cancelBooking: (id: string) => void;
  
  occupySeats: (scheduleId: string, seatNumbers: number[]) => void;
  releaseSeats: (scheduleId: string, seatNumbers: number[]) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);
const generateTicketCode = () => `BR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

const generateDefaultSchedules = (): Schedule[] => {
  return [
    { id: 'sch1', routeId: 'r1', busId: 'b1', busSize: 18, departureDate: '2026-04-21', departureTime: '06:00', arrivalTime: '09:30', availableSeats: 18, totalSeats: 18, driverName: 'Jean Bosco', driverPhone: '+250788123456', price: 5000, status: 'scheduled' },
    { id: 'sch2', routeId: 'r1', busId: 'b2', busSize: 18, departureDate: '2026-04-21', departureTime: '12:00', arrivalTime: '15:30', availableSeats: 18, totalSeats: 18, driverName: 'Patrick N.', driverPhone: '+250788234567', price: 5000, status: 'scheduled' },
    { id: 'sch3', routeId: 'r2', busId: 'b3', busSize: 29, departureDate: '2026-04-21', departureTime: '07:00', arrivalTime: '10:30', availableSeats: 29, totalSeats: 29, driverName: 'Marie U.', driverPhone: '+250788345678', price: 4000, status: 'scheduled' },
    { id: 'sch4', routeId: 'r3', busId: 'b4', busSize: 50, departureDate: '2026-04-21', departureTime: '08:00', arrivalTime: '14:00', availableSeats: 50, totalSeats: 50, driverName: 'International Driver', driverPhone: '+250788456789', price: 15000, status: 'scheduled' },
    { id: 'sch5', routeId: 'r1', busId: 'b5', busSize: 18, departureDate: '2026-04-22', departureTime: '06:00', arrivalTime: '09:30', availableSeats: 18, totalSeats: 18, driverName: 'Jean Bosco', driverPhone: '+250788123456', price: 5000, status: 'scheduled' },
  ];
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      pickupPoints: DEFAULT_PICKUP_POINTS,
      companies: BUS_COMPANIES,
      schedules: generateDefaultSchedules(),
      bookings: [],
      selectedSeats: [],
      occupiedSeats: {},

      setSelectedSeats: (seats) => set({ selectedSeats: seats }),
      
      toggleSeat: (seatNumber) => {
        const { selectedSeats } = get();
        if (selectedSeats.includes(seatNumber)) {
          set({ selectedSeats: selectedSeats.filter(s => s !== seatNumber) });
        } else {
          set({ selectedSeats: [...selectedSeats, seatNumber] });
        }
      },
      
      clearSelectedSeats: () => set({ selectedSeats: [] }),

      addPickupPoint: (point) => {
        const newPoint: PickupPoint = { ...point, id: `pp-${generateId()}` };
        set(state => ({ pickupPoints: [...state.pickupPoints, newPoint] }));
      },

      updatePickupPoint: (id, updates) => {
        set(state => ({
          pickupPoints: state.pickupPoints.map(p => 
            p.id === id ? { ...p, ...updates } : p
          )
        }));
      },

      deletePickupPoint: (id) => {
        set(state => ({ pickupPoints: state.pickupPoints.filter(p => p.id !== id) }));
      },

      addCompany: (company) => {
        const newCompany: BusCompany = { ...company, id: `bc-${generateId()}` };
        set(state => ({ companies: [...state.companies, newCompany] }));
      },

      updateCompany: (id, updates) => {
        set(state => ({
          companies: state.companies.map(c => 
            c.id === id ? { ...c, ...updates } : c
          )
        }));
      },

      addSchedule: (schedule) => {
        const newSchedule: Schedule = { ...schedule, id: `sch-${generateId()}` };
        set(state => ({ schedules: [...state.schedules, newSchedule] }));
      },

      updateSchedule: (id, updates) => {
        set(state => ({
          schedules: state.schedules.map(s => 
            s.id === id ? { ...s, ...updates } : s
          )
        }));
      },

      deleteSchedule: (id) => {
        set(state => ({ schedules: state.schedules.filter(s => s.id !== id) }));
      },

      addBooking: (booking) => {
        const newBooking: Booking = {
          ...booking,
          id: `bk-${generateId()}`,
          ticketCode: generateTicketCode(),
        };
        const { occupySeats } = get();
        set(state => ({ 
          bookings: [...state.bookings, newBooking],
          selectedSeats: [],
        }));
        occupySeats(booking.scheduleId, booking.seats);
      },

      updateBookingStatus: (id, status) => {
        set(state => ({
          bookings: state.bookings.map(b => 
            b.id === id ? { ...b, status } : b
          )
        }));
      },

      cancelBooking: (id) => {
        const { bookings, releaseSeats } = get();
        const booking = bookings.find(b => b.id === id);
        if (booking) {
          releaseSeats(booking.scheduleId, booking.seats);
        }
        set(state => ({
          bookings: state.bookings.map(b => 
            b.id === id ? { ...b, status: 'cancelled' } : b
          )
        }));
      },

      occupySeats: (scheduleId, seatNumbers) => {
        set(state => ({
          occupiedSeats: {
            ...state.occupiedSeats,
            [scheduleId]: [...(state.occupiedSeats[scheduleId] || []), ...seatNumbers],
          }
        }));
      },

      releaseSeats: (scheduleId, seatNumbers) => {
        set(state => ({
          occupiedSeats: {
            ...state.occupiedSeats,
            [scheduleId]: (state.occupiedSeats[scheduleId] || []).filter(s => !seatNumbers.includes(s)),
          }
        }));
      },
    }),
    {
      name: 'bus-rwanda-storage',
      partialize: (state) => ({
        pickupPoints: state.pickupPoints,
        companies: state.companies,
        schedules: state.schedules,
        bookings: state.bookings,
        occupiedSeats: state.occupiedSeats,
      }),
    }
  )
);