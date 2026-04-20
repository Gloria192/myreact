import React from 'react';
import type { BusSize } from '../types';
import { BUS_CONFIGS } from '../types';
import { useAppStore } from '../store/appStore';

interface SeatMapProps {
  busSize: BusSize;
  occupiedSeats: number[];
  maxSelectable?: number;
  onSeatSelect?: (seats: number[]) => void;
}

export const SeatMap: React.FC<SeatMapProps> = ({ 
  busSize, 
  occupiedSeats = [], 
  maxSelectable = 6,
  onSeatSelect 
}) => {
  const { selectedSeats, toggleSeat } = useAppStore();
  const config = BUS_CONFIGS[busSize];
  
  const handleSeatClick = (seatNumber: number) => {
    if (occupiedSeats.includes(seatNumber)) return;
    if (!selectedSeats.includes(seatNumber) && selectedSeats.length >= maxSelectable) return;
    
    toggleSeat(seatNumber);
    onSeatSelect?.(selectedSeats.includes(seatNumber) 
      ? selectedSeats.filter(s => s !== seatNumber)
      : [...selectedSeats, seatNumber]
    );
  };

  const getSeatPosition = (row: number): 'front' | 'middle' | 'back' => {
    if (row <= 1) return 'front';
    if (row >= config.rows - 1) return 'back';
    return 'middle';
  };

  const generateSeats = () => {
    const seats: React.ReactNode[] = [];

    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.cols; col++) {
        const seatNumber = row * config.cols + col + 1;
        if (seatNumber > config.size) continue;
        
        const isOccupied = occupiedSeats.includes(seatNumber);
        const isSelected = selectedSeats.includes(seatNumber);
        const position = getSeatPosition(row);
        
        const isAisleCol = config.hasAisle && col === Math.floor(config.cols / 2);
        
        seats.push(
          <React.Fragment key={seatNumber}>
            {isAisleCol && <div className="aisle" />}
            <button
              key={seatNumber}
              className={`seat ${isOccupied ? 'occupied' : ''} ${isSelected ? 'selected' : ''} ${position}`}
              onClick={() => handleSeatClick(seatNumber)}
              disabled={isOccupied}
              title={`Seat ${seatNumber} - ${position} (${position === 'front' ? 'Premium' : position === 'back' ? 'Rear' : 'Regular'})`}
            >
              {seatNumber}
            </button>
          </React.Fragment>
        );
      }
      seats.push(<div key={`row-${row}`} className="seat-row" />);
    }
    return seats;
  };

  return (
    <div className="seat-map-container">
      <div className="bus-front">
        <span>🚍</span>
      </div>
      
      <div className="seat-layout" style={{ 
        gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
        gridTemplateRows: `repeat(${config.rows}, 1fr)`,
      }}>
        {generateSeats()}
      </div>
      
      <div className="seat-legend">
        <div className="legend-item">
          <span className="seat available" /> Available
        </div>
        <div className="legend-item">
          <span className="seat selected" /> Selected
        </div>
        <div className="legend-item">
          <span className="seat occupied" /> Occupied
        </div>
      </div>
      
      <div className="seat-info">
        <p>Selected: {selectedSeats.length}/{maxSelectable} seats</p>
        {selectedSeats.length > 0 && (
          <p>Seats: {selectedSeats.sort((a, b) => a - b).join(', ')}</p>
        )}
      </div>
    </div>
  );
};

export default SeatMap;