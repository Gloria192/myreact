export interface BusCompany {
  id: string;
  name: string;
  logo?: string;
  rating: number;
  isActive: boolean;
}

export interface PickupPoint {
  id: string;
  name: string;
  district: string;
  province: string;
  type: 'origin' | 'destination' | 'both';
  isActive: boolean;
}

export interface Route {
  id: string;
  name: string;
  originId: string;
  destinationId: string;
  companyId: string;
  distance: number;
  duration: string;
  price: number;
}

export type BusSize = 7 | 18 | 29 | 50;

export interface BusConfig {
  size: BusSize;
  rows: number;
  cols: number;
  hasAisle: boolean;
  seatPriceModifier: number;
}

export interface Seat {
  id: string;
  number: number;
  row: number;
  col: number;
  isAvailable: boolean;
  isSelected: boolean;
  isBlocked: boolean;
  position: 'front' | 'middle' | 'back';
}

export interface Schedule {
  id: string;
  routeId?: string;
  route?: string;
  company?: string;
  busId: string;
  busSize: BusSize;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  availableSeats: number;
  totalSeats: number;
  driverName: string;
  driverPhone: string;
  price: number;
  status: 'scheduled' | 'departed' | 'completed' | 'cancelled';
}

export interface Booking {
  id: string;
  scheduleId: string;
  passengerId: string;
  passengerName: string;
  passengerPhone: string;
  seats: number[];
  seatDetails: { number: number; position: string; price: number }[];
  bookingDate: string;
  travelDate: string;
  totalPrice: number;
  paymentMethod: 'mobile' | 'cash';
  mobileProvider?: 'MTN' | 'Airtel';
  phoneNumber?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  ticketCode: string;
  pickupPointId?: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  role: 'passenger' | 'admin';
}

export const BUS_CONFIGS: Record<BusSize, BusConfig> = {
  7: { size: 7, rows: 3, cols: 3, hasAisle: false, seatPriceModifier: 1.5 },
  18: { size: 18, rows: 5, cols: 4, hasAisle: true, seatPriceModifier: 1 },
  29: { size: 29, rows: 8, cols: 4, hasAisle: true, seatPriceModifier: 1 },
  50: { size: 50, rows: 10, cols: 5, hasAisle: true, seatPriceModifier: 1.2 },
};

export const RWANDA_PROVINCES = [
  'Kigali',
  'Northern',
  'Southern',
  'Eastern',
  'Western',
  'Ngoma',
  'International',
] as const;

export const DEFAULT_PICKUP_POINTS: PickupPoint[] = [
  { id: 'pp1', name: 'Kigali Bus Park (Main Station)', district: 'Nyarugenge', province: 'Kigali', type: 'origin', isActive: true },
  { id: 'pp2', name: 'Nyabugogo Market', district: 'Kicukiro', province: 'Kigali', type: 'origin', isActive: true },
  { id: 'pp3', name: 'Kimironko', district: 'Kicukiro', province: 'Kigali', type: 'origin', isActive: true },
  { id: 'pp4', name: 'Kacyiru', district: 'Gasabo', province: 'Kigali', type: 'origin', isActive: true },
  { id: 'pp5', name: 'Remera (UP Mall)', district: 'Kicukiro', province: 'Kigali', type: 'origin', isActive: true },
  { id: 'pp6', name: 'Kanombe (Airport)', district: 'Kicukiro', province: 'Kigali', type: 'both', isActive: true },
  { id: 'pp7', name: 'Gatuna Border', district: 'Gatuna', province: 'Eastern', type: 'destination', isActive: true },
  { id: 'pp8', name: 'Kayonza', district: 'Kayonza', province: 'Eastern', type: 'destination', isActive: true },
  { id: 'pp9', name: 'Rwamagana', district: 'Rwamagana', province: 'Eastern', type: 'destination', isActive: true },
  { id: 'pp10', name: 'Nyagatare', district: 'Nyagatare', province: 'Eastern', type: 'destination', isActive: true },
  { id: 'pp11', name: 'Gisenyi', district: 'Rubavu', province: 'Western', type: 'destination', isActive: true },
  { id: 'pp12', name: 'Rubavu', district: 'Rubavu', province: 'Western', type: 'destination', isActive: true },
  { id: 'pp13', name: 'Musanze', district: 'Musanze', province: 'Northern', type: 'destination', isActive: true },
  { id: 'pp14', name: 'Huye', district: 'Huye', province: 'Southern', type: 'destination', isActive: true },
  { id: 'pp15', name: 'Muhanga', district: 'Muhanga', province: 'Southern', type: 'destination', isActive: true },
  { id: 'pp16', name: 'Ruhengeri', district: 'Ruhengeri', province: 'Northern', type: 'destination', isActive: true },
  { id: 'pp17', name: 'Byumba', district: 'Byumba', province: 'Northern', type: 'destination', isActive: true },
  { id: 'pp18', name: 'Kampala (Uganda)', district: 'Kampala', province: 'International', type: 'destination', isActive: true },
  { id: 'pp19', name: 'Nairobi (Kenya)', district: 'Nairobi', province: 'International', type: 'destination', isActive: true },
  { id: 'pp20', name: 'Bujumbura (Burundi)', district: 'Bujumbura', province: 'International', type: 'destination', isActive: true },
];

export const BUS_COMPANIES: BusCompany[] = [
  { id: 'bc1', name: 'Virunga Express', rating: 4.5, isActive: true },
  { id: 'bc2', name: 'Horizon Express', rating: 4.2, isActive: true },
  { id: 'bc3', name: 'Royal Express', rating: 4.0, isActive: true },
  { id: 'bc4', name: 'Akagera Express', rating: 4.3, isActive: true },
  { id: 'bc5', name: 'Rwanda Coach', rating: 3.9, isActive: true },
  { id: 'bc6', name: 'VIP Services', rating: 4.8, isActive: true },
];