import { useState } from 'react';
import { type TripResponse } from '../../../types';
import { Timer, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

export const TripHUD = ({ trip }: { trip: TripResponse }) => {
  const [isOpen, setIsOpen] = useState(false);
  const minutes = Math.floor(trip.duration / 60);
  const km = (trip.distance / 1000).toFixed(1);

  return (
    /* Main Container: Absolute position with right-80 as requested */
    /* flex-col ensures the content expands downward */
    <div className="absolute top-4 right-80 z-[1000] flex flex-col items-center gap-2">
      
      {/* 🟢 The Drop-Down Trigger (Lenovo Vantage Style) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 items-center gap-3 bg-slate-800/90 backdrop-blur-md border border-slate-700 px-4 rounded-full shadow-lg hover:bg-slate-700 transition-all active:scale-95 shrink-0"
      >
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest whitespace-nowrap">
            Active Mission
          </span>
        </div>
        {isOpen ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
      </button>

      {/* 📦 The Revealed Content (Expands DOWNWARD) */}
      {isOpen && (
        <div className="w-72 bg-slate-800/95 backdrop-blur-md border border-slate-700 p-5 rounded-3xl shadow-2xl animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Timer size={12} />
                <span className="text-[10px] font-bold uppercase tracking-tight">Time</span>
              </div>
              <p className="text-lg font-black text-white">
                {minutes} <span className="text-xs font-normal text-slate-400">min</span>
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500">
                <MapPin size={12} />
                <span className="text-[10px] font-bold uppercase tracking-tight">Dist.</span>
              </div>
              <p className="text-lg font-black text-white">
                {km} <span className="text-xs font-normal text-slate-400">km</span>
              </p>
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700/30">
            <p className="text-[9px] text-slate-500 font-bold uppercase mb-1 tracking-wider">Destination</p>
            <p className="text-xs text-blue-100 font-medium line-clamp-1">
              {trip.destinationText || "Unknown Location"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};