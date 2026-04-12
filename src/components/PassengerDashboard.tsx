import React, { useState } from 'react';
import { useBusContext } from '../context/useBusContext';
import type { Booking } from '../types';
import '../styles/PassengerDashboard.css';

interface PassengerDashboardProps {
  onSwitchToAdmin: () => void;
}

export const PassengerDashboard: React.FC<PassengerDashboardProps> = ({ onSwitchToAdmin }) => {
  const { schedules, bookings, addBooking, cancelBooking } = useBusContext();
  const [activeTab, setActiveTab] = useState<'schedules' | 'bookings'>('schedules');
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [numSeats, setNumSeats] = useState<number>(1);
  const [passengerName, setPassengerName] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [journeyType, setJourneyType] = useState<'full' | 'half'>('full');
  const [paymentMethod, setPaymentMethod] = useState<'mobile' | 'visa'>('mobile');
  const [mobileProvider, setMobileProvider] = useState<'MTN' | 'Airtel'>('MTN');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleBooking = () => {
    if (!selectedScheduleId || !passengerName || numSeats < 1) {
      alert('Please fill in all fields');
      return;
    }

    if (paymentMethod === 'mobile' && !phoneNumber) {
      alert('Please enter your phone number for mobile money payment');
      return;
    }

    const schedule = schedules.find(s => s.id === selectedScheduleId);
    if (!schedule || schedule.availableSeats < numSeats) {
      alert('Not enough seats available');
      return;
    }

    const seats = Array.from({ length: numSeats }, (_, i) => i + 1);
    const pricePerSeat = journeyType === 'half' ? schedule.price / 2 : schedule.price;
    const booking: Booking = {
      id: `BK-${Date.now()}`,
      scheduleId: selectedScheduleId,
      passengerId: `PASS-${Date.now()}`,
      passengerName,
      seats,
      bookingDate: new Date().toLocaleDateString(),
      totalPrice: pricePerSeat * numSeats,
      status: 'confirmed',
      paymentMethod,
      mobileProvider: paymentMethod === 'mobile' ? mobileProvider : undefined,
      phoneNumber: paymentMethod === 'mobile' ? phoneNumber : undefined
    };

    addBooking(booking);
    setBookingConfirmed(true);
    setTimeout(() => {
      setBookingConfirmed(false);
      setSelectedScheduleId(null);
      setNumSeats(1);
      setPassengerName('');
      setJourneyType('full');
      setPaymentMethod('mobile');
      setMobileProvider('MTN');
      setPhoneNumber('');
    }, 2000);
  };

  const userBookings = bookings.filter(b => b.status !== 'cancelled');
  
  // Filter schedules based on search term
  const filteredSchedules = schedules.filter(schedule => 
    schedule.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.arrival.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="passenger-dashboard">
      <div className="dashboard-header">
        <h1>🚌 Passenger Dashboard</h1>
        <p>Book tickets and check schedules</p>
        <button className="admin-link" onClick={onSwitchToAdmin}>Admin Login</button>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'schedules' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedules')}
        >
          📅 Check Schedule
        </button>
        <button 
          className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          🎫 My Bookings ({userBookings.length})
        </button>
      </div>

      {/* Schedule Section */}
      {activeTab === 'schedules' && (
        <div className="content-section">
          <h2>Available Schedules</h2>
          
          {/* Search Bar */}
          <div className="search-section">
            <input
              type="text"
              placeholder="🔍 Search by route, company, departure, or arrival..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <p className="search-results">Found {filteredSchedules.length} route(s)</p>
          </div>
          
          {filteredSchedules.length === 0 ? (
            <div className="empty-state">No routes found. Try a different search.</div>
          ) : (
          <div className="schedules-grid">
            {filteredSchedules.map(schedule => (
              <div key={schedule.id} className="schedule-card">
                <div className="schedule-header">
                  <h3>{schedule.route}</h3>
                  <p className="company">🚍 {schedule.company || 'Express'}</p>
                  <span className={`availability ${schedule.availableSeats > 5 ? 'available' : 'limited'}`}>
                    {schedule.availableSeats} seats
                  </span>
                </div>
                <div className="schedule-details">
                  <div className="detail-row">
                    <span className="label">From:</span>
                    <span className="value">{schedule.departure}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">To:</span>
                    <span className="value">{schedule.arrival}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">⏰ Departure:</span>
                    <span className="value">{schedule.departureTime}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">⏰ Arrival:</span>
                    <span className="value">{schedule.arrivalTime}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">🚗 Bus:</span>
                    <span className="value">{schedule.bus}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">👨‍✈️ Driver:</span>
                    <span className="value">{schedule.driver}</span>
                  </div>
                  <div className="price-row">
                    <span className="label">Price per seat:</span>
                    <span className="price">{schedule.price.toLocaleString()} RWF</span>
                  </div>
                </div>

                {selectedScheduleId === schedule.id ? (
                  <div className="booking-form">
                    <h4>Book Your Ticket</h4>
                    <div className="form-group">
                      <label>Passenger Name</label>
                      <input
                        type="text"
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Number of Seats</label>
                      <select
                        value={numSeats}
                        onChange={(e) => setNumSeats(parseInt(e.target.value))}
                      >
                        {Array.from({ length: schedule.availableSeats }, (_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Journey Type</label>
                      <div className="journey-options">
                        <label className="journey-label">
                          <input
                            type="radio"
                            value="full"
                            checked={journeyType === 'full'}
                            onChange={(e) => setJourneyType(e.target.value as 'full' | 'half')}
                          />
                          Full Journey ({schedule.price.toLocaleString()} RWF per seat)
                        </label>
                        <label className="journey-label">
                          <input
                            type="radio"
                            value="half"
                            checked={journeyType === 'half'}
                            onChange={(e) => setJourneyType(e.target.value as 'full' | 'half')}
                          />
                          Half Journey ({(schedule.price / 2).toLocaleString()} RWF per seat)
                        </label>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Payment Method</label>
                      <div className="payment-options">
                        <label className="payment-label">
                          <input
                            type="radio"
                            value="mobile"
                            checked={paymentMethod === 'mobile'}
                            onChange={(e) => setPaymentMethod(e.target.value as 'mobile' | 'visa')}
                          />
                          📱 Mobile Money
                        </label>
                        <label className="payment-label">
                          <input
                            type="radio"
                            value="visa"
                            checked={paymentMethod === 'visa'}
                            onChange={(e) => setPaymentMethod(e.target.value as 'mobile' | 'visa')}
                          />
                          💳 Visa Card
                        </label>
                      </div>
                    </div>
                    {paymentMethod === 'mobile' && (
                      <>
                        <div className="form-group">
                          <label>Phone Number *</label>
                          <input
                            type="tel"
                            placeholder="e.g., +250788123456"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label>Mobile Provider</label>
                          <select
                            value={mobileProvider}
                            onChange={(e) => setMobileProvider(e.target.value as 'MTN' | 'Airtel')}
                          >
                            <option value="MTN">MTN Mobile Money</option>
                            <option value="Airtel">Airtel Money</option>
                          </select>
                        </div>
                      </>
                    )}
                    <div className="total-price">
                      Total: {((journeyType === 'half' ? schedule.price / 2 : schedule.price) * numSeats).toLocaleString()} RWF
                    </div>
                    <div className="form-buttons">
                      <button className="btn-confirm" onClick={handleBooking}>
                        Confirm Booking
                      </button>
                      <button className="btn-cancel" onClick={() => setSelectedScheduleId(null)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    className="btn-book"
                    onClick={() => setSelectedScheduleId(schedule.id)}
                    disabled={schedule.availableSeats === 0}
                  >
                    {schedule.availableSeats === 0 ? 'No Seats Available' : 'Book Now'}
                  </button>
                )}
              </div>
            ))}
          </div>
          )}
          {bookingConfirmed && (
            <div className="success-message">✓ Booking confirmed successfully!</div>
          )}
        </div>
      )}

      {/* My Bookings Section */}
      {activeTab === 'bookings' && (
        <div className="content-section">
          <h2>My Bookings</h2>
          {userBookings.length === 0 ? (
            <div className="empty-state">No bookings yet. Start booking your tickets!</div>
          ) : (
            <div className="bookings-list">
              {userBookings.map(booking => {
                const schedule = schedules.find(s => s.id === booking.scheduleId);
                return (
                  <div key={booking.id} className="booking-item">
                    <div className="booking-info">
                      <h4>{schedule?.route}</h4>
                      <p>📅 Booking Date: {booking.bookingDate}</p>
                      <p>👤 Passenger: {booking.passengerName}</p>
                      <p>🎫 Seats: {booking.seats.join(', ')}</p>
                      <p>⏰ Departure: {schedule?.departureTime}</p>
                      <p className="journey-type">🚌 Type: {schedule && booking.totalPrice === schedule.price * booking.seats.length ? 'Full Journey' : 'Half Journey'}</p>
                      <p className="payment-info">💳 Payment: {booking.paymentMethod === 'mobile' ? `${booking.mobileProvider} Mobile Money` : 'Visa Card'}</p>
                      {booking.phoneNumber && <p className="phone-info">📱 Phone: {booking.phoneNumber}</p>}
                      <p className="booking-price">💰 Total: {booking.totalPrice.toLocaleString()} RWF</p>
                    </div>
                    <div className="booking-status">
                      <span className={`status ${booking.status}`}>{booking.status.toUpperCase()}</span>
                    </div>
                    {booking.status === 'confirmed' && (
                      <button 
                        className="btn-cancel-booking"
                        onClick={() => cancelBooking(booking.id)}
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
