import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/appStore';
import { SeatMap } from './SeatMap';
import '../styles/PassengerDashboard.css';
import '../styles/SeatMap.css';

interface PassengerDashboardProps {
  onSwitchToAdmin: () => void;
}

type Step = 'search' | 'select' | 'booking' | 'confirmation';

export const PassengerDashboard: React.FC<PassengerDashboardProps> = ({ onSwitchToAdmin }) => {
  const { pickupPoints, schedules, bookings, selectedSeats, clearSelectedSeats, addBooking } = useAppStore();
  const [step, setStep] = useState<Step>('search');
  const [search, setSearch] = useState({ from: '', to: '', date: '' });
  const [selectedSchedule, setSelectedSchedule] = useState<typeof schedules[0] | null>(null);
  const [passenger, setPassenger] = useState<{ name: string; phone: string; payment: 'mobile' | 'cash'; provider: 'MTN' | 'Airtel' }>({ name: '', phone: '', payment: 'mobile', provider: 'MTN' });
  const [showSuccess, setShowSuccess] = useState(false);

  const origins = useMemo(() => pickupPoints.filter(p => p.type === 'origin' || p.type === 'both'), [pickupPoints]);
  const destinations = useMemo(() => pickupPoints.filter(p => p.type === 'destination' || p.type === 'both'), [pickupPoints]);

  const filteredSchedules = useMemo(() => {
    return schedules.filter(s => {
      if (search.date && s.departureDate !== search.date) return false;
      return true;
    });
  }, [schedules, search.date]);

  const handleSelectSchedule = (schedule: typeof schedules[0]) => {
    setSelectedSchedule(schedule);
    setStep('select');
    clearSelectedSeats();
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) return;
    setStep('booking');
  };

  const handleBook = () => {
    if (!selectedSchedule || !passenger.name || !passenger.phone) return;

    const seatPrices = selectedSeats.map(seatNumber => {
      const position = seatNumber <= 3 ? 'front' : seatNumber >= (selectedSchedule.busSize - 2) ? 'back' : 'middle';
      const modifier = position === 'front' ? 1.3 : position === 'back' ? 1.1 : 1;
      return { number: seatNumber, position, price: Math.round(selectedSchedule.price * modifier) };
    });

    const totalPrice = seatPrices.reduce((sum, s) => sum + s.price, 0);

    addBooking({
      scheduleId: selectedSchedule.id,
      passengerId: `pass-${Date.now()}`,
      passengerName: passenger.name,
      passengerPhone: passenger.phone,
      seats: selectedSeats,
      seatDetails: seatPrices,
      bookingDate: new Date().toISOString().split('T')[0],
      travelDate: selectedSchedule.departureDate,
      totalPrice,
      paymentMethod: passenger.payment,
      mobileProvider: passenger.payment === 'mobile' ? passenger.provider : undefined,
      phoneNumber: passenger.payment === 'mobile' ? passenger.phone : undefined,
      status: 'confirmed',
    });

    setStep('confirmation');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const myBookings = bookings.filter(b => b.status !== 'cancelled');

  const handleNewBooking = () => {
    setStep('search');
    setSearch({ from: '', to: '', date: '' });
    setSelectedSchedule(null);
    clearSelectedSeats();
    setPassenger({ name: '', phone: '', payment: 'mobile', provider: 'MTN' });
  };

  return (
    <div className="passenger-dashboard">
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🚌</span>
          <h1>Bus Rwanda</h1>
        </div>
        <button className="btn-outline" onClick={onSwitchToAdmin}>Admin</button>
      </header>

      <nav className="nav-tabs">
        <button className={`nav-tab ${step === 'search' ? 'active' : ''}`} onClick={() => setStep('search')}>Find Bus</button>
        <button className={`nav-tab ${step === 'confirmation' || myBookings.length > 0 ? 'active' : ''}`} onClick={() => setStep('confirmation')}>
          My Tickets ({myBookings.length})
        </button>
      </nav>

      <main className="main-content">
        {step === 'search' && (
          <section>
            <div className="search-box">
              <input type="date" value={search.date} onChange={e => setSearch(s => ({ ...s, date: e.target.value }))} />
              <input type="text" placeholder="Where from?" value={search.from} onChange={e => setSearch(s => ({ ...s, from: e.target.value }))} list="origins" />
              <input type="text" placeholder="Where to?" value={search.to} onChange={e => setSearch(s => ({ ...s, to: e.target.value }))} list="destinations" />
              <datalist id="origins">{origins.map(o => <option key={o.id} value={o.name} />)}</datalist>
              <datalist id="destinations">{destinations.map(d => <option key={d.id} value={d.name} />)}</datalist>
            </div>

            <div className="routes-list">
              {filteredSchedules.length === 0 ? (
                <div className="empty">No buses found for selected date</div>
              ) : (
                filteredSchedules.map(schedule => (
                  <div key={schedule.id} className="route-card">
                    <div className="route-main">
                      <div className="route-path">
                        <span className="bus-icon">🚍</span>
                        <span className="time">{schedule.departureTime}</span>
                        <span className="arrow">→</span>
                        <span className="time">{schedule.arrivalTime}</span>
                      </div>
                      <div className="route-meta">
                        <span>{schedule.busSize}-seater</span>
                        <span>{schedule.availableSeats} seats</span>
                      </div>
                    </div>
                    <div className="route-info">
                      <span className="price">{schedule.price.toLocaleString()} RWF</span>
                    </div>
                    <button className="btn-book" onClick={() => handleSelectSchedule(schedule)}>Select</button>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {step === 'select' && selectedSchedule && (
          <section>
            <div className="step-header">
              <button className="btn-back" onClick={() => setStep('search')}>← Back</button>
              <h3>Select Seats</h3>
            </div>
            <div className="schedule-summary">
              <p>{selectedSchedule.departureDate} • {selectedSchedule.departureTime} → {selectedSchedule.arrivalTime}</p>
              <p>{selectedSchedule.busSize}-seater • {selectedSchedule.price.toLocaleString()} RWF base price</p>
            </div>
            
            <SeatMap
              busSize={selectedSchedule.busSize as 7 | 18 | 29 | 50}
              occupiedSeats={[]}
              maxSelectable={6}
            />

            <button className="btn-primary full-width" onClick={handleContinue} disabled={selectedSeats.length === 0}>
              Continue ({selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''})
            </button>
          </section>
        )}

        {step === 'booking' && selectedSchedule && (
          <section>
            <div className="step-header">
              <button className="btn-back" onClick={() => setStep('select')}>← Back</button>
              <h3>Passenger Details</h3>
            </div>

            <div className="booking-summary">
              <div className="summary-row">
                <span>Date</span>
                <span>{selectedSchedule.departureDate}</span>
              </div>
              <div className="summary-row">
                <span>Time</span>
                <span>{selectedSchedule.departureTime} → {selectedSchedule.arrivalTime}</span>
              </div>
              <div className="summary-row">
                <span>Seats</span>
                <span>{selectedSeats.sort((a, b) => a - b).join(', ')}</span>
              </div>
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={passenger.name} onChange={e => setPassenger(p => ({ ...p, name: e.target.value }))} placeholder="Your name" />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" value={passenger.phone} onChange={e => setPassenger(p => ({ ...p, phone: e.target.value }))} placeholder="+250788123456" />
            </div>

            <div className="form-group">
              <label>Payment Method</label>
              <div className="payment-select">
                <button type="button" className={`payment-btn ${passenger.payment === 'mobile' ? 'active' : ''}`} onClick={() => setPassenger(p => ({ ...p, payment: 'mobile' }))}>📱 Mobile Money</button>
                <button type="button" className={`payment-btn ${passenger.payment === 'cash' ? 'active' : ''}`} onClick={() => setPassenger(p => ({ ...p, payment: 'cash' }))}>💵 Cash</button>
              </div>
            </div>

            {passenger.payment === 'mobile' && (
              <div className="form-group">
                <label>Provider</label>
                <select value={passenger.provider} onChange={e => setPassenger(p => ({ ...p, provider: e.target.value as 'MTN' | 'Airtel' }))}>
                  <option value="MTN">MTN Mobile Money</option>
                  <option value="Airtel">Airtel Money</option>
                </select>
              </div>
            )}

            <div className="total-section">
              <span>Total</span>
              <span className="total-price">
                {selectedSeats.reduce((sum, seatNumber) => {
                  const position = seatNumber <= 3 ? 'front' : seatNumber >= (selectedSchedule.busSize - 2) ? 'back' : 'middle';
                  const modifier = position === 'front' ? 1.3 : position === 'back' ? 1.1 : 1;
                  return sum + Math.round(selectedSchedule.price * modifier);
                }, 0).toLocaleString()} RWF
              </span>
            </div>

            <button className="btn-success full-width" onClick={handleBook} disabled={!passenger.name || !passenger.phone}>
              Confirm Booking
            </button>
          </section>
        )}

        {step === 'confirmation' && (
          <section>
            <h2>My Tickets</h2>
            {myBookings.length === 0 ? (
              <div className="empty">No tickets yet</div>
            ) : (
              <div className="tickets-list">
                {myBookings.map(booking => {
                  const schedule = schedules.find(s => s.id === booking.scheduleId);
                  return (
                    <div key={booking.id} className="ticket-card">
                      <div className="ticket-header">
                        <span className="ticket-code">{booking.ticketCode}</span>
                        <span className={`status ${booking.status}`}>{booking.status}</span>
                      </div>
                      <div className="ticket-route">{schedule?.departureTime} → {schedule?.arrivalTime}</div>
                      <div className="ticket-details">
                        <span>Date: {booking.travelDate}</span>
                        <span>Seats: {booking.seats.sort((a, b) => a - b).join(', ')}</span>
                        <span>Total: {booking.totalPrice.toLocaleString()} RWF</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <button className="btn-primary full-width" onClick={handleNewBooking}>Book New Trip</button>
          </section>
        )}
      </main>

      {showSuccess && <div className="toast">✓ Booking confirmed!</div>}
    </div>
  );
};