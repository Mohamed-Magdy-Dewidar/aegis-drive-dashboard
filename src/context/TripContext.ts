import { createContext } from 'react';
import { type TripResponse } from '../types';

export interface TripContextType {
  activeTrip: TripResponse | null;
  startActiveTrip: (trip: TripResponse) => void;
  clearActiveTrip: () => void;
  isDriving: boolean;
}

export const TripContext = createContext<TripContextType | undefined>(undefined);