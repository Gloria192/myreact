import React, { useState } from 'react';
import type { ReactNode } from 'react';
import type { Schedule, Booking } from '../types';
import { BusContext, type BusContextType } from './BusContextType';

export { BusContext, type BusContextType };

const initialSchedules: Schedule[] = [
  // Kigali to Eastern Province
  {
    id: 'sch001',    company: 'Virunga Express',    route: 'Kigali to Gatuna (Uganda Border)',
    departure: 'Kigali',
    arrival: 'Gatuna',
    departureTime: '06:00',
    arrivalTime: '09:30',
    availableSeats: 18,
    totalSeats: 18,
    price: 5000,
    driver: 'Jean Bosco',
    bus: 'BUS-KGL-001'
  },
  {
    id: 'sch002',
    company: 'Virunga Express',
    route: 'Kigali to Gatuna (Uganda Border)',
    departure: 'Kigali',
    arrival: 'Gatuna',
    departureTime: '12:00',
    arrivalTime: '15:30',
    availableSeats: 18,
    totalSeats: 18,
    price: 5000,
    driver: 'Patrick Niyonzima',
    bus: 'BUS-KGL-004'
  },
  {
    id: 'sch003',
    company: 'Horizon Express',
    route: 'Kigali to Kayonza',
    departure: 'Kigali',
    arrival: 'Kayonza',
    departureTime: '07:00',
    arrivalTime: '10:30',
    availableSeats: 18,
    totalSeats: 18,
    price: 4000,
    driver: 'Marie Uwimana',
    bus: 'BUS-KGL-002'
  },
  {
    id: 'sch004',
    company: 'Horizon Express',
    route: 'Kigali to Kayonza',
    departure: 'Kigali',
    arrival: 'Kayonza',
    departureTime: '14:00',
    arrivalTime: '17:30',
    availableSeats: 18,
    totalSeats: 18,
    price: 4000,
    driver: 'Josephine Mukamana',
    bus: 'BUS-KGL-005'
  },
  {
    id: 'sch005',
    company: 'Royal Express',
    route: 'Kigali to Rwamagana',
    departure: 'Kigali',
    arrival: 'Rwamagana',
    departureTime: '06:30',
    arrivalTime: '08:00',
    availableSeats: 18,
    totalSeats: 18,
    price: 3000,
    driver: 'Emmanuel Nkurunziza',
    bus: 'BUS-KGL-006'
  },
  {
    id: 'sch006',
    company: 'Royal Express',
    route: 'Kigali to Rwamagana',
    departure: 'Kigali',
    arrival: 'Rwamagana',
    departureTime: '11:30',
    arrivalTime: '13:00',
    availableSeats: 18,
    totalSeats: 18,
    price: 3000,
    driver: 'Anastase Mugabo',
    bus: 'BUS-KGL-007'
  },
  {
    id: 'sch007',
    company: 'Akagera Express',
    route: 'Kigali to Nyagatare',
    departure: 'Kigali',
    arrival: 'Nyagatare',
    departureTime: '08:00',
    arrivalTime: '12:00',
    availableSeats: 18,
    totalSeats: 18,
    price: 6000,
    driver: 'Tharcisse Hakizimana',
    bus: 'BUS-KGL-008'
  },
  {
    id: 'sch008',
    route: 'Kigali to Nyagatare',
    departure: 'Kigali',
    arrival: 'Nyagatare',
    departureTime: '15:00',
    arrivalTime: '19:00',
    availableSeats: 18,
    totalSeats: 18,
    price: 6000,
    driver: 'Claudine Uwimana',
    bus: 'BUS-KGL-009'
  },

  // Kigali to Western Province
  {
    id: 'sch009',
    route: 'Kigali to Gisenyi',
    departure: 'Kigali',
    arrival: 'Gisenyi',
    departureTime: '07:00',
    arrivalTime: '11:00',
    availableSeats: 18,
    totalSeats: 18,
    price: 6000,
    driver: 'Pierre Ndagijimana',
    bus: 'BUS-KGL-003'
  },
  {
    id: 'sch010',
    route: 'Kigali to Gisenyi',
    departure: 'Kigali',
    arrival: 'Gisenyi',
    departureTime: '13:00',
    arrivalTime: '17:00',
    availableSeats: 18,
    totalSeats: 18,
    price: 6000,
    driver: 'Francois Xavier',
    bus: 'BUS-KGL-010'
  },
  {
    id: 'sch011',
    route: 'Kigali to Rubavu',
    departure: 'Kigali',
    arrival: 'Rubavu',
    departureTime: '08:00',
    arrivalTime: '12:30',
    availableSeats: 18,
    totalSeats: 18,
    price: 6500,
    driver: 'Jean Damascene',
    bus: 'BUS-KGL-011'
  },
  {
    id: 'sch012',
    route: 'Kigali to Rubavu',
    departure: 'Kigali',
    arrival: 'Rubavu',
    departureTime: '14:30',
    arrivalTime: '19:00',
    availableSeats: 18,
    totalSeats: 18,
    price: 6500,
    driver: 'Marie Claire',
    bus: 'BUS-KGL-012'
  },
  {
    id: 'sch013',
    route: 'Kigali to Musanze',
    departure: 'Kigali',
    arrival: 'Musanze',
    departureTime: '06:30',
    arrivalTime: '10:00',
    availableSeats: 18,
    totalSeats: 18,
    price: 5500,
    driver: 'Samuel Ndayishimiye',
    bus: 'BUS-KGL-013'
  },
  {
    id: 'sch014',
    route: 'Kigali to Musanze',
    departure: 'Kigali',
    arrival: 'Musanze',
    departureTime: '12:30',
    arrivalTime: '16:00',
    availableSeats: 18,
    totalSeats: 18,
    price: 5500,
    driver: 'Beatrice Mukantabana',
    bus: 'BUS-KGL-014'
  },

  // Kigali to Southern Province
  {
    id: 'sch015',
    route: 'Kigali to Huye',
    departure: 'Kigali',
    arrival: 'Huye',
    departureTime: '07:30',
    arrivalTime: '09:30',
    availableSeats: 18,
    totalSeats: 18,
    price: 3500,
    driver: 'Didace Nshimiyimana',
    bus: 'BUS-KGL-015'
  },
  {
    id: 'sch016',
    route: 'Kigali to Huye',
    departure: 'Kigali',
    arrival: 'Huye',
    departureTime: '13:30',
    arrivalTime: '15:30',
    availableSeats: 18,
    totalSeats: 18,
    price: 3500,
    driver: 'Jeanne d\'Arc',
    bus: 'BUS-KGL-016'
  },
  {
    id: 'sch017',
    route: 'Kigali to Muhanga',
    departure: 'Kigali',
    arrival: 'Muhanga',
    departureTime: '08:00',
    arrivalTime: '10:00',
    availableSeats: 18,
    totalSeats: 18,
    price: 4000,
    driver: 'Fabrice Niyigena',
    bus: 'BUS-KGL-017'
  },
  {
    id: 'sch018',
    route: 'Kigali to Muhanga',
    departure: 'Kigali',
    arrival: 'Muhanga',
    departureTime: '14:00',
    arrivalTime: '16:00',
    availableSeats: 18,
    totalSeats: 18,
    price: 4000,
    driver: 'Solange Mukamana',
    bus: 'BUS-KGL-018'
  },
  {
    id: 'sch019',
    route: 'Kigali to Nyanza',
    departure: 'Kigali',
    arrival: 'Nyanza',
    departureTime: '09:00',
    arrivalTime: '11:30',
    availableSeats: 18,
    totalSeats: 18,
    price: 4500,
    driver: 'Eric Nkurunziza',
    bus: 'BUS-KGL-019'
  },
  {
    id: 'sch020',
    route: 'Kigali to Nyanza',
    departure: 'Kigali',
    arrival: 'Nyanza',
    departureTime: '15:30',
    arrivalTime: '18:00',
    availableSeats: 18,
    totalSeats: 18,
    price: 4500,
    driver: 'Grace Uwimana',
    bus: 'BUS-KGL-020'
  },

  // Kigali to Northern Province
  {
    id: 'sch021',
    route: 'Kigali to Byumba',
    departure: 'Kigali',
    arrival: 'Byumba',
    departureTime: '06:00',
    arrivalTime: '08:30',
    availableSeats: 18,
    totalSeats: 18,
    price: 4500,
    driver: 'Jean Baptiste',
    bus: 'BUS-KGL-021'
  },
  {
    id: 'sch022',
    route: 'Kigali to Byumba',
    departure: 'Kigali',
    arrival: 'Byumba',
    departureTime: '12:00',
    arrivalTime: '14:30',
    availableSeats: 18,
    totalSeats: 18,
    price: 4500,
    driver: 'Therese Mukamana',
    bus: 'BUS-KGL-022'
  },
  {
    id: 'sch023',
    route: 'Kigali to Ruhengeri',
    departure: 'Kigali',
    arrival: 'Ruhengeri',
    departureTime: '07:00',
    arrivalTime: '10:00',
    availableSeats: 18,
    totalSeats: 18,
    price: 5000,
    driver: 'Pascal Ndayishimiye',
    bus: 'BUS-KGL-023'
  },
  {
    id: 'sch024',
    route: 'Kigali to Ruhengeri',
    departure: 'Kigali',
    arrival: 'Ruhengeri',
    departureTime: '13:00',
    arrivalTime: '16:00',
    availableSeats: 18,
    totalSeats: 18,
    price: 5000,
    driver: 'Christine Uwimana',
    bus: 'BUS-KGL-024'
  },

  // Major City Routes
  {
    id: 'sch025',
    route: 'Kigali to Kigali Airport',
    departure: 'Kigali',
    arrival: 'Kigali Airport',
    departureTime: '05:00',
    arrivalTime: '06:00',
    availableSeats: 12,
    totalSeats: 12,
    price: 2000,
    driver: 'Airport Express',
    bus: 'BUS-KGL-AIR'
  },
  {
    id: 'sch026',
    route: 'Kigali to Kigali Airport',
    departure: 'Kigali',
    arrival: 'Kigali Airport',
    departureTime: '06:00',
    arrivalTime: '07:00',
    availableSeats: 12,
    totalSeats: 12,
    price: 2000,
    driver: 'Airport Express',
    bus: 'BUS-KGL-AIR2'
  },
  {
    id: 'sch027',
    route: 'Kigali to Kigali Airport',
    departure: 'Kigali',
    arrival: 'Kigali Airport',
    departureTime: '07:00',
    arrivalTime: '08:00',
    availableSeats: 12,
    totalSeats: 12,
    price: 2000,
    driver: 'Airport Express',
    bus: 'BUS-KGL-AIR3'
  },

  // International Routes
  {
    id: 'sch028',
    route: 'Kigali to Kampala (Uganda)',
    departure: 'Kigali',
    arrival: 'Kampala',
    departureTime: '08:00',
    arrivalTime: '14:00',
    availableSeats: 24,
    totalSeats: 24,
    price: 15000,
    driver: 'International Driver',
    bus: 'BUS-KGL-INT1'
  },
  {
    id: 'sch029',
    route: 'Kigali to Bujumbura (Burundi)',
    departure: 'Kigali',
    arrival: 'Bujumbura',
    departureTime: '09:00',
    arrivalTime: '15:00',
    availableSeats: 24,
    totalSeats: 24,
    price: 12000,
    driver: 'International Driver',
    bus: 'BUS-KGL-INT2'
  },
  {
    id: 'sch030',
    route: 'Kigali to Nairobi (Kenya)',
    departure: 'Kigali',
    arrival: 'Nairobi',
    departureTime: '10:00',
    arrivalTime: '20:00',
    availableSeats: 30,
    totalSeats: 30,
    price: 20000,
    driver: 'International Driver',
    bus: 'BUS-KGL-INT3'
  }
];

export const BusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const addSchedule = (schedule: Schedule) => {
    setSchedules([...schedules, schedule]);
  };

  const updateSchedule = (id: string, updates: Partial<Schedule>) => {
    setSchedules(schedules.map(sch => 
      sch.id === id ? { ...sch, ...updates } : sch
    ));
  };

  const deleteSchedule = (id: string) => {
    setSchedules(schedules.filter(sch => sch.id !== id));
  };

  const addBooking = (booking: Booking) => {
    setBookings([...bookings, booking]);
    updateAvailableSeats(booking.scheduleId, booking.seats.length);
  };

  const cancelBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      setBookings(bookings.map(b => 
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
      ));
      // Restore seats
      const schedule = schedules.find(s => s.id === booking.scheduleId);
      if (schedule) {
        updateSchedule(booking.scheduleId, {
          availableSeats: schedule.availableSeats + booking.seats.length
        });
      }
    }
  };

  const updateAvailableSeats = (scheduleId: string, seatsBooked: number) => {
    const schedule = schedules.find(s => s.id === scheduleId);
    if (schedule) {
      updateSchedule(scheduleId, {
        availableSeats: Math.max(0, schedule.availableSeats - seatsBooked)
      });
    }
  };

  return (
    <BusContext.Provider value={{ schedules, bookings, addSchedule, updateSchedule, deleteSchedule, addBooking, cancelBooking, updateAvailableSeats }}>
      {children}
    </BusContext.Provider>
  );
};


