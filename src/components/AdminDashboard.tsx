import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { RWANDA_PROVINCES } from '../types';
import '../styles/AdminDashboard.css';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { pickupPoints, schedules, bookings, addPickupPoint, updatePickupPoint, deletePickupPoint, deleteSchedule } = useAppStore();
  const [view, setView] = useState<'pickup' | 'schedules' | 'bookings'>('pickup');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', district: '', province: 'Kigali', type: 'origin' as const });

  const handleSave = () => {
    if (!form.name || !form.district) return;
    addPickupPoint({ ...form, isActive: true });
    setForm({ name: '', district: '', province: 'Kigali', type: 'origin' });
    setShowForm(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const totalRevenue = bookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + b.totalPrice, 0);
  const totalBookings = bookings.filter(b => b.status !== 'cancelled').length;

  return (
    <div className="admin-dashboard">
      <header className="header">
        <h1>Admin</h1>
        <button className="btn-outline" onClick={onLogout}>Logout</button>
      </header>

      <div className="stats-row">
        <div className="stat"><span className="stat-value">{pickupPoints.length}</span><span className="stat-label">Locations</span></div>
        <div className="stat"><span className="stat-value">{schedules.length}</span><span className="stat-label">Schedules</span></div>
        <div className="stat"><span className="stat-value">{totalBookings}</span><span className="stat-label">Bookings</span></div>
        <div className="stat"><span className="stat-value">{totalRevenue.toLocaleString()}</span><span className="stat-label">Revenue</span></div>
      </div>

      <nav className="nav-tabs">
        <button className={`nav-tab ${view === 'pickup' ? 'active' : ''}`} onClick={() => setView('pickup')}>Pickup Points</button>
        <button className={`nav-tab ${view === 'schedules' ? 'active' : ''}`} onClick={() => setView('schedules')}>Schedules</button>
        <button className={`nav-tab ${view === 'bookings' ? 'active' : ''}`} onClick={() => setView('bookings')}>Bookings</button>
      </nav>

      <main className="main-content">
        {view === 'pickup' && (
          <section>
            <div className="section-header">
              <h2>Pickup Points</h2>
              <button className="btn-primary" onClick={() => setShowForm(true)}>+ Add Point</button>
            </div>

            {showForm && (
              <div className="add-form">
                <div className="form-group">
                  <label>Point Name</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="e.g., Kigali Bus Park" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>District</label>
                    <input name="district" value={form.district} onChange={handleChange} placeholder="e.g., Nyarugenge" />
                  </div>
                  <div className="form-group">
                    <label>Province</label>
                    <select name="province" value={form.province} onChange={handleChange}>
                      {RWANDA_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select name="type" value={form.type} onChange={handleChange}>
                    <option value="origin">Origin (Departure)</option>
                    <option value="destination">Destination</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div className="form-buttons">
                  <button className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                  <button className="btn-confirm" onClick={handleSave}>Save</button>
                </div>
              </div>
            )}

            <div className="locations-grid">
              {pickupPoints.map(p => (
                <div key={p.id} className="location-card">
                  <div className="location-info">
                    <strong>{p.name}</strong>
                    <span>{p.district}, {p.province}</span>
                    <span className={`type-badge ${p.type}`}>{p.type}</span>
                  </div>
                  <div className="location-actions">
                    <button className="btn-toggle" onClick={() => updatePickupPoint(p.id, { isActive: !p.isActive })}>
                      {p.isActive ? 'Disable' : 'Enable'}
                    </button>
                    <button className="btn-delete" onClick={() => { if (confirm('Delete?')) deletePickupPoint(p.id); }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {view === 'schedules' && (
          <section>
            <div className="section-header">
              <h2>Schedules</h2>
            </div>
            <div className="schedules-list">
              {schedules.map(s => (
                <div key={s.id} className="schedule-item">
                  <div className="schedule-info">
                    <strong>{s.busSize}-seater</strong>
                    <span>{s.departureDate} • {s.departureTime} → {s.arrivalTime}</span>
                    <span>{s.availableSeats}/{s.totalSeats} seats • {s.price.toLocaleString()} RWF</span>
                  </div>
                  <button className="btn-delete" onClick={() => { if (confirm('Delete?')) deleteSchedule(s.id); }}>Delete</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {view === 'bookings' && (
          <section>
            <h2>All Bookings</h2>
            {bookings.length === 0 ? <div className="empty">No bookings</div> : (
              <div className="bookings-list">
                {bookings.map(b => (
                  <div key={b.id} className="booking-card">
                    <div className="booking-main">
                      <strong>{b.passengerName}</strong>
                      <span>{b.ticketCode}</span>
                    </div>
                    <div className="booking-details">
                      <span>{b.seats.length} seat(s) • {b.totalPrice.toLocaleString()} RWF</span>
                      <span>{b.travelDate}</span>
                    </div>
                    <span className={`status ${b.status}`}>{b.status}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};