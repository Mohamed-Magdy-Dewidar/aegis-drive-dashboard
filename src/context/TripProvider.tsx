import React, { useState } from 'react';
import { TripContext } from './TripContext';
import { type TripResponse } from '../types';

export const TripProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeTrip, setActiveTrip] = useState<TripResponse | null>(() => {
    const saved = localStorage.getItem('aegis_active_trip');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const startActiveTrip = (trip: TripResponse) => {
    setActiveTrip(trip);
    localStorage.setItem('aegis_active_trip', JSON.stringify(trip));
  };

  const clearActiveTrip = () => {
    setActiveTrip(null);
    localStorage.removeItem('aegis_active_trip');
  };

  return (
    <TripContext.Provider value={{ 
      activeTrip, 
      startActiveTrip, 
      clearActiveTrip, 
      isDriving: !!activeTrip 
    }}>
      {children}
    </TripContext.Provider>
  );
};