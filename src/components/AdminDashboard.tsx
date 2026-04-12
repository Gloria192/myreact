import React, { useState } from 'react';
import { useBusContext } from '../context/useBusContext';
import type { Schedule } from '../types';
import '../styles/AdminDashboard.css';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { schedules, bookings, addSchedule, updateSchedule, deleteSchedule } = useBusContext();
  const [activeTab, setActiveTab] = useState<'schedules' | 'bookings' | 'add-schedule' | 'bulk-add'>('schedules');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [bulkSchedules, setBulkSchedules] = useState<Array<{
    route: string;
    departure: string;
    arrival: string;
    departureTime: string;
    arrivalTime: string;
    totalSeats: number;
    price: number;
    driver: string;
    bus: string;
  }>>([]);

  const [formData, setFormData] = useState({
    company: '',
    route: '',
    departure: '',
    arrival: '',
    departureTime: '',
    arrivalTime: '',
    totalSeats: 24,
    price: 5000,
    driver: '',
    bus: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalSeats' || name === 'price' ? parseInt(value) : value
    }));
  };

  const handleAddSchedule = () => {
    if (!formData.company || !formData.route || !formData.departure || !formData.arrival || !formData.driver || !formData.bus) {
      alert('Please fill in all required fields');
      return;
    }

    const newSchedule: Schedule = {
      id: `sch-${Date.now()}`,
      ...formData,
      availableSeats: formData.totalSeats
    };

    addSchedule(newSchedule);
    setFormData({
      company: '',
      route: '',
      departure: '',
      arrival: '',
      departureTime: '',
      arrivalTime: '',
      totalSeats: 18,
      price: 5000,
      driver: '',
      bus: ''
    });
    setActiveTab('schedules');
    alert('Schedule added successfully!');
  };

  const handleUpdateSchedule = (id: string) => {
    const schedule = schedules.find(s => s.id === id);
    if (schedule) {
      updateSchedule(id, {
        route: formData.route || schedule.route,
        departure: formData.departure || schedule.departure,
        arrival: formData.arrival || schedule.arrival,
        departureTime: formData.departureTime || schedule.departureTime,
        arrivalTime: formData.arrivalTime || schedule.arrivalTime,
        price: formData.price || schedule.price,
        driver: formData.driver || schedule.driver,
        bus: formData.bus || schedule.bus
      });
      setEditingId(null);
      setFormData({
        company: '',
        route: '',
        departure: '',
        arrival: '',
        departureTime: '',
        arrivalTime: '',
        totalSeats: 18,
        price: 5000,
        driver: '',
        bus: ''
      });
      alert('Schedule updated successfully!');
    }
  };

  const handleEditClick = (schedule: Schedule) => {
    setEditingId(schedule.id);
    setFormData({
      company: schedule.company || '',
      route: schedule.route,
      departure: schedule.departure,
      arrival: schedule.arrival,
      departureTime: schedule.departureTime,
      arrivalTime: schedule.arrivalTime,
      totalSeats: schedule.totalSeats,
      price: schedule.price,
      driver: schedule.driver,
      bus: schedule.bus
    });
  };

  const addBulkSchedule = () => {
    const newSchedule = {
      route: formData.route,
      departure: formData.departure,
      arrival: formData.arrival,
      departureTime: formData.departureTime,
      arrivalTime: formData.arrivalTime,
      totalSeats: formData.totalSeats,
      price: formData.price,
      driver: formData.driver,
      bus: formData.bus
    };
    setBulkSchedules([...bulkSchedules, newSchedule]);
    // Reset form for next entry
    setFormData({
      ...formData,
      departureTime: '',
      arrivalTime: '',
      driver: '',
      bus: ''
    });
  };

  const saveBulkSchedules = () => {
    bulkSchedules.forEach(schedule => {
      const newSchedule: Schedule = {
        id: `sch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...schedule,
        availableSeats: schedule.totalSeats
      };
      addSchedule(newSchedule);
    });
    setBulkSchedules([]);
    setActiveTab('schedules');
    alert(`${bulkSchedules.length} schedules added successfully!`);
  };

  const removeBulkSchedule = (index: number) => {
    setBulkSchedules(bulkSchedules.filter((_, i) => i !== index));
  };

  const generateTimeSlots = (startTime: string, endTime: string, interval: number = 2) => {
    const slots = [];
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);

    while (start < end) {
      slots.push(start.toTimeString().slice(0, 5));
      start.setHours(start.getHours() + interval);
    }
    return slots;
  };

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.status !== 'cancelled' ? b.totalPrice : 0), 0);
  const totalBookings = bookings.filter(b => b.status !== 'cancelled').length;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>⚙️ Admin Dashboard</h1>
        <p>Manage schedules, pricing, and bookings</p>
        <button className="logout-btn" onClick={onLogout}>🚪 Logout</button>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Schedules</h3>
          <p className="stat-number">{schedules.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p className="stat-number">{totalBookings}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-number">{totalRevenue.toLocaleString()} RWF</p>
        </div>
        <div className="stat-card">
          <h3>Available Seats</h3>
          <p className="stat-number">
            {schedules.reduce((sum, s) => sum + s.availableSeats, 0)}
          </p>
        </div>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'schedules' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedules')}
        >
          📅 Manage Schedules
        </button>
        <button 
          className={`tab ${activeTab === 'add-schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('add-schedule')}
        >
          ➕ Add Single Schedule
        </button>
        <button 
          className={`tab ${activeTab === 'bulk-add' ? 'active' : ''}`}
          onClick={() => setActiveTab('bulk-add')}
        >
          📋 Bulk Add Schedules
        </button>
        <button 
          className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          🎫 View All Bookings
        </button>
      </div>

      {/* Manage Schedules */}
      {activeTab === 'schedules' && (
        <div className="content-section">
          <h2>Current Schedules</h2>
          {schedules.length === 0 ? (
            <div className="empty-state">No schedules added yet.</div>
          ) : (
            <div className="admin-schedules-grid">
              {schedules.map(schedule => (
                <div key={schedule.id} className="admin-schedule-card">
                  <div className="schedule-header">
                    <h3>{schedule.route}</h3>
                    <button 
                      className="btn-delete"
                      onClick={() => {
                        if (window.confirm('Delete this schedule?')) {
                          deleteSchedule(schedule.id);
                        }
                      }}
                    >
                      🗑️
                    </button>
                  </div>

                  {editingId === schedule.id ? (
                    <div className="edit-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label>Company</label>
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="form-group">
                          <label>Route</label>
                          <input
                            type="text"
                            name="route"
                            value={formData.route}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="form-group">
                          <label>Price (RWF)</label>
                          <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Departure</label>
                          <input
                            type="text"
                            name="departure"
                            value={formData.departure}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="form-group">
                          <label>Arrival</label>
                          <input
                            type="text"
                            name="arrival"
                            value={formData.arrival}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Departure Time</label>
                          <input
                            type="time"
                            name="departureTime"
                            value={formData.departureTime}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="form-group">
                          <label>Arrival Time</label>
                          <input
                            type="time"
                            name="arrivalTime"
                            value={formData.arrivalTime}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Driver</label>
                          <input
                            type="text"
                            name="driver"
                            value={formData.driver}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="form-group">
                          <label>Bus Number</label>
                          <input
                            type="text"
                            name="bus"
                            value={formData.bus}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="form-buttons">
                        <button 
                          className="btn-save"
                          onClick={() => handleUpdateSchedule(schedule.id)}
                        >
                          Save Changes
                        </button>
                        <button 
                          className="btn-cancel"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="schedule-details">
                      <div className="detail-row">
                        <span className="label">From → To:</span>
                        <span className="value">{schedule.departure} → {schedule.arrival}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Times:</span>
                        <span className="value">{schedule.departureTime} - {schedule.arrivalTime}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Bus & Driver:</span>
                        <span className="value">{schedule.bus} ({schedule.driver})</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Seats:</span>
                        <span className="value">{schedule.availableSeats} / {schedule.totalSeats} available</span>
                      </div>
                      <div className="detail-row highlight">
                        <span className="label">Price:</span>
                        <span className="value price">{schedule.price.toLocaleString()} RWF</span>
                      </div>
                      <button 
                        className="btn-edit"
                        onClick={() => handleEditClick(schedule)}
                      >
                        ✏️ Edit
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add New Schedule */}
      {activeTab === 'add-schedule' && (
        <div className="content-section">
          <h2>Create New Schedule</h2>
          <div className="add-schedule-form">
            <div className="form-row">
              <div className="form-group">
                <label>Company *</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="e.g., Virunga Express"
                />
              </div>
              <div className="form-group">
                <label>Route Name *</label>
                <input
                  type="text"
                  name="route"
                  value={formData.route}
                  onChange={handleInputChange}
                  placeholder="e.g., Kigali to Gatuna"
                />
              </div>
              <div className="form-group">
                <label>Price (RWF) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Departure Location *</label>
                <input
                  type="text"
                  name="departure"
                  value={formData.departure}
                  onChange={handleInputChange}
                  placeholder="e.g., Kigali"
                />
              </div>
              <div className="form-group">
                <label>Arrival Location *</label>
                <input
                  type="text"
                  name="arrival"
                  value={formData.arrival}
                  onChange={handleInputChange}
                  placeholder="e.g., Gatuna"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Departure Time</label>
                <input
                  type="time"
                  name="departureTime"
                  value={formData.departureTime}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Arrival Time</label>
                <input
                  type="time"
                  name="arrivalTime"
                  value={formData.arrivalTime}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Driver Name *</label>
                <input
                  type="text"
                  name="driver"
                  value={formData.driver}
                  onChange={handleInputChange}
                  placeholder="e.g., John Doe"
                />
              </div>
              <div className="form-group">
                <label>Bus Number *</label>
                <input
                  type="text"
                  name="bus"
                  value={formData.bus}
                  onChange={handleInputChange}
                  placeholder="e.g., BUS-001"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Total Seats</label>
                <select
                  name="totalSeats"
                  value={formData.totalSeats}
                  onChange={handleInputChange}
                >
                  <option value="24">24 Seats</option>
                  <option value="29">29 Seats</option>
                  <option value="50">50 Seats</option>
                  <option value="80">80 Seats</option>
                </select>
              </div>
            </div>

            <button className="btn-add-schedule" onClick={handleAddSchedule}>
              ➕ Create Schedule
            </button>
          </div>
        </div>
      )}

      {/* Bulk Add Schedules */}
      {activeTab === 'bulk-add' && (
        <div className="content-section">
          <h2>Bulk Add Schedules</h2>
          <p>Add multiple schedules for the same route with different departure times</p>

          <div className="bulk-add-form">
            <div className="form-row">
              <div className="form-group">
                <label>Route Name *</label>
                <input
                  type="text"
                  name="route"
                  value={formData.route}
                  onChange={handleInputChange}
                  placeholder="e.g., Kigali to Gatuna"
                />
              </div>
              <div className="form-group">
                <label>Price (RWF) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Departure Location *</label>
                <input
                  type="text"
                  name="departure"
                  value={formData.departure}
                  onChange={handleInputChange}
                  placeholder="e.g., Kigali"
                />
              </div>
              <div className="form-group">
                <label>Arrival Location *</label>
                <input
                  type="text"
                  name="arrival"
                  value={formData.arrival}
                  onChange={handleInputChange}
                  placeholder="e.g., Gatuna"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Departure Time *</label>
                <input
                  type="time"
                  name="departureTime"
                  value={formData.departureTime}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Arrival Time *</label>
                <input
                  type="time"
                  name="arrivalTime"
                  value={formData.arrivalTime}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Driver Name *</label>
                <input
                  type="text"
                  name="driver"
                  value={formData.driver}
                  onChange={handleInputChange}
                  placeholder="e.g., John Doe"
                />
              </div>
              <div className="form-group">
                <label>Bus Number *</label>
                <input
                  type="text"
                  name="bus"
                  value={formData.bus}
                  onChange={handleInputChange}
                  placeholder="e.g., BUS-001"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Total Seats</label>
                <select
                  name="totalSeats"
                  value={formData.totalSeats}
                  onChange={handleInputChange}
                >
                  <option value="24">24 Seats</option>
                  <option value="29">29 Seats</option>
                  <option value="50">50 Seats</option>
                  <option value="80">80 Seats</option>
                </select>
              </div>
            </div>

            <div className="bulk-actions">
              <button className="btn-add-to-bulk" onClick={addBulkSchedule}>
                ➕ Add to Bulk List
              </button>
              <button
                className="btn-quick-fill"
                onClick={() => {
                  const timeSlots = generateTimeSlots('06:00', '22:00', 2);
                  timeSlots.forEach((time, index) => {
                    const schedule = {
                      route: formData.route,
                      departure: formData.departure,
                      arrival: formData.arrival,
                      departureTime: time,
                      arrivalTime: new Date(`2000-01-01T${time}`).getHours() + 3 >= 24 ?
                        `${(new Date(`2000-01-01T${time}`).getHours() + 3 - 24).toString().padStart(2, '0')}:00` :
                        `${(new Date(`2000-01-01T${time}`).getHours() + 3).toString().padStart(2, '0')}:00`,
                      totalSeats: formData.totalSeats,
                      price: formData.price,
                      driver: `Driver ${index + 1}`,
                      bus: `BUS-${(index + 1).toString().padStart(3, '0')}`
                    };
                    setBulkSchedules(prev => [...prev, schedule]);
                  });
                }}
              >
                ⚡ Quick Fill (All Day)
              </button>
            </div>
          </div>

          {/* Bulk List */}
          {bulkSchedules.length > 0 && (
            <div className="bulk-list">
              <h3>Scheduled to Add ({bulkSchedules.length})</h3>
              <div className="bulk-items">
                {bulkSchedules.map((schedule, index) => (
                  <div key={index} className="bulk-item">
                    <div className="bulk-info">
                      <strong>{schedule.route}</strong> - {schedule.departureTime} to {schedule.arrivalTime}
                      <br />
                      <small>{schedule.bus} ({schedule.driver}) - {schedule.totalSeats} seats</small>
                    </div>
                    <button
                      className="btn-remove-bulk"
                      onClick={() => removeBulkSchedule(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <div className="bulk-save">
                <button className="btn-save-bulk" onClick={saveBulkSchedules}>
                  💾 Save All Schedules ({bulkSchedules.length})
                </button>
                <button className="btn-clear-bulk" onClick={() => setBulkSchedules([])}>
                  🗑️ Clear All
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* View All Bookings */}
      {activeTab === 'bookings' && (
        <div className="content-section">
          <h2>All Bookings</h2>
          {bookings.length === 0 ? (
            <div className="empty-state">No bookings yet.</div>
          ) : (
            <div className="bookings-table">
              <table>
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Passenger</th>
                    <th>Route</th>
                    <th>Seats</th>
                    <th>Total Price</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => {
                    const schedule = schedules.find(s => s.id === booking.scheduleId);
                    return (
                      <tr key={booking.id} className={booking.status === 'cancelled' ? 'cancelled' : ''}>
                        <td><strong>{booking.id}</strong></td>
                        <td>{booking.passengerName}</td>
                        <td>{schedule?.route}</td>
                        <td>{booking.seats.join(', ')}</td>
                        <td>{booking.totalPrice.toLocaleString()} RWF</td>
                        <td>{booking.bookingDate}</td>
                        <td><span className={`status ${booking.status}`}>{booking.status}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
