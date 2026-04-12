export interface Schedule {
  id: string;
  company?: string;
  route: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  availableSeats: number;
  totalSeats: number;
  price: number;
  driver: string;
  bus: string;
}

export interface Booking {
  id: string;
  scheduleId: string;
  passengerId: string;
  passengerName: string;
  seats: number[];
  bookingDate: string;
  totalPrice: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  paymentMethod: 'mobile' | 'visa';
  mobileProvider?: 'MTN' | 'Airtel';
  phoneNumber?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'passenger' | 'admin';
}
