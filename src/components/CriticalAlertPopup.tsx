import { useSignalR } from "../context/SignalRContext";

export const CriticalAlertPopup = () => {
  const { criticalAlert, dismissCriticalAlert } = useSignalR();

  if (!criticalAlert) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white border-l-8 border-red-600 rounded-lg shadow-2xl max-w-lg w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-red-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <span className="text-3xl">🚨</span>
             <h2 className="text-xl font-bold text-white">CRITICAL DRIVER ALERT</h2>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{criticalAlert.message}</h3>
            <p className="text-gray-600 font-medium">State: <span className="text-red-600 uppercase tracking-wider">{criticalAlert.driverState}</span></p>
            <p className="text-sm text-gray-500 mt-2">
              Vehicle: <strong>{criticalAlert.plateNumber}</strong> • Speed: {criticalAlert.speedKmh} km/h
            </p>
          </div>

          {criticalAlert.driverImageUrl && (
            <div className="mb-6 rounded-lg overflow-hidden border-2 border-red-100 shadow-inner">
               <img 
                 src={criticalAlert.driverImageUrl} 
                 alt="Driver Alert Context" 
                 className="w-full h-56 object-cover"
               />
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-gray-100">
            <button 
              onClick={dismissCriticalAlert}
              className="px-5 py-2.5 text-gray-700 font-semibold hover:bg-gray-100 rounded-md transition-colors"
            >
              Dismiss
            </button>
            <a 
              href={`/events/${criticalAlert.eventId}`} 
              className="px-5 py-2.5 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 shadow-lg shadow-red-200 transition-all"
            >
              View Full Incident
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};