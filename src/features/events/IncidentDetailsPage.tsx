import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fleetApi } from '../../api/fleetApi';
import { type IncidentDetails } from '../../types';
import { MapPin, Gauge, Globe } from 'lucide-react'; // Added for better visuals
import toast from 'react-hot-toast';

export const IncidentDetailsPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  
  const [incident, setIncident] = useState<IncidentDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;

    const fetchData = async () => {
      try {
        const data = await fleetApi.getIncidentDetails(eventId);
        setIncident(data);
      } catch (error) {
        console.error("Failed to fetch incident", error);
        toast.error("Could not load incident details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  if (loading) return <div className="p-8 text-center text-white">Loading Incident Data...</div>;
  if (!incident) return <div className="p-8 text-center text-red-500">Incident not found.</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button 
            onClick={() => navigate(-1)} 
            className="text-gray-300 hover:text-white mb-2 flex items-center gap-2 transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-white">Incident Report</h1>
          <p className="text-gray-400 text-sm mt-1">ID: {incident.id}</p>
        </div>
        <div className="text-right">
          <span className="px-4 py-2 bg-red-600 text-white rounded-full font-bold text-sm shadow-lg">
            {incident.message}
          </span>
          <p className="text-sm text-gray-400 mt-2">
            {new Date(incident.timestamp).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Visual Evidence */}
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-gray-900">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-gray-900">
              📸 Driver Camera
            </h3>
            
            {incident.s3DriverImagePath ? (
              <img 
                src={incident.s3DriverImagePath} 
                alt="Driver Evidence" 
                className="w-full rounded-lg border border-gray-100 shadow-inner"
              />
            ) : (
              <div className="h-64 bg-gray-100 flex items-center justify-center rounded-lg text-gray-400">No Image Available</div>
            )}

            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div className="bg-gray-50 p-2 rounded border border-gray-100">
                <div className="text-xs text-gray-500 font-semibold">EAR (Eyes)</div>
                <div className="font-mono font-bold text-red-600 text-lg">
                  {incident.earValue?.toFixed(3) ?? 'N/A'}
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded border border-gray-100">
                <div className="text-xs text-gray-500 font-semibold">MAR (Mouth)</div>
                <div className="font-mono font-bold text-orange-600 text-lg">
                  {incident.marValue?.toFixed(3) ?? 'N/A'}
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded border border-gray-100">
                <div className="text-xs text-gray-500 font-semibold">Head Yaw</div>
                <div className="font-mono font-bold text-gray-900 text-lg">
                  {incident.headYaw?.toFixed(2) ?? 'N/A'}°
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-gray-900">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-gray-900">
              🛣️ Road Camera
            </h3>
             {incident.s3RoadImagePath ? (
              <img 
                src={incident.s3RoadImagePath} 
                alt="Road Evidence" 
                className="w-full rounded-lg border border-gray-100 shadow-inner"
              />
            ) : (
              <div className="h-64 bg-gray-100 flex items-center justify-center rounded-lg text-gray-400">No Image Available</div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Data */}
        <div className="space-y-6">
          {/* Entity Information */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-gray-900">
            <h3 className="text-lg font-bold mb-4 border-b pb-2 text-gray-900">Entity Information</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">Driver Name</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">{incident.driverFullName || "Unknown"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Vehicle Plate</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">{incident.vehiclePlate || "N/A"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Device ID</dt>
                <dd className="mt-1 text-gray-900 font-mono">{incident.deviceId}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Driver State</dt>
                <dd className="mt-1 text-red-600 font-bold uppercase tracking-wide">
                  {incident.driverState === 1 ? 'DROWSY' : 'NORMAL'}
                </dd>
              </div>
            </dl>
          </div>

          {/* 🆕 New Section: Location & Telemetry */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-gray-900">
            <h3 className="text-lg font-bold mb-4 border-b pb-2 text-gray-900 flex items-center gap-2">
              <Globe size={20} className="text-blue-600" /> Location & Telemetry
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <MapPin size={20} />
                </div>
                <div>
                  <dt className="text-xs font-semibold text-gray-500 uppercase">Coordinates</dt>
                  <dd className="mt-1 text-sm font-mono text-gray-900">
                    {incident.latitude.toFixed(6)}, {incident.longitude.toFixed(6)}
                  </dd>
                  <a 
                    href={`https://www.google.com/maps?q=${incident.latitude},${incident.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline mt-1 block"
                  >
                    View on Google Maps
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                  <Gauge size={20} />
                </div>
                <div>
                  <dt className="text-xs font-semibold text-gray-500 uppercase">Speed at Impact</dt>
                  <dd className="mt-1 text-2xl font-black text-gray-900">
                    {incident.speed.toLocaleString()} <span className="text-sm font-normal text-gray-500">km/h</span>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          {/* Environmental Context */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-gray-900">
            <h3 className="text-lg font-bold mb-4 border-b pb-2 text-gray-900">Road Context</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Hazard Detected?</span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${incident.roadHasHazard ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {incident.roadHasHazard ? "YES" : "NO"}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span className="text-gray-600 font-medium">Vehicles Visible</span>
                <span className="font-mono font-bold text-gray-900 text-lg">{incident.roadVehicleCount}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span className="text-gray-600 font-medium">Pedestrians Visible</span>
                <span className="font-mono font-bold text-gray-900 text-lg">{incident.roadPedestrianCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Closest Object Distance</span>
                <span className="font-mono font-bold text-gray-900 text-lg">{incident.roadClosestDistance?.toFixed(1)} m</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};