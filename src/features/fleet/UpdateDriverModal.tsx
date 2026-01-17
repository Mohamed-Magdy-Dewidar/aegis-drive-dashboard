import { useState, useEffect } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { fleetApi } from "../../api/fleetApi";
import { type DriverProfile, type UpdateDriverRequest } from "../../types";

interface UpdateDriverModalProps {
  driver: DriverProfile | null; // Allow null to prevent crash if not selected yet
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const UpdateDriverModal: React.FC<UpdateDriverModalProps> = ({
  driver,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  
  // Initialize with safe defaults
  const [formData, setFormData] = useState<UpdateDriverRequest>({
    driverId: 0,
    fullName: "",
    phoneNumber: "",
    email: "",
    companyId: undefined,
  });

  useEffect(() => {
    if (driver && isOpen) {
      setFormData({
        driverId: driver.driverId, // This MUST be set here
        fullName: driver.fullName || "",
        phoneNumber: driver.phoneNumber || "",
        email: driver.email || "",
        companyId: driver.companyId?.toString(),
      });
    }
  }, [driver, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Double check ID before sending - must be a valid number > 0
      if (formData.driverId === undefined || formData.driverId === null || formData.driverId <= 0) {
        throw new Error("Cannot update: Driver ID is missing or invalid.");
      }

      await fleetApi.updateDriver(formData);
      toast.success("Driver updated successfully");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update driver", error);
      let msg = "Update failed.";
      
      if (error instanceof Error) {
        msg = error.message;
      } else if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        'message' in error.response.data
      ) {
        msg = String(error.response.data.message);
      }
      
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen || !driver) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-800 rounded-xl border border-slate-700 shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Update Driver</h2>
          <button onClick={onClose} disabled={loading} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
            <input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};