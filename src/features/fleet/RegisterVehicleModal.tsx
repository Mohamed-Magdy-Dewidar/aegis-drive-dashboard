import React, { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { fleetApi } from "../../api/fleetApi";
import { type RegisterVehicleRequest } from "../../types";

interface RegisterVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RegisterVehicleModal: React.FC<RegisterVehicleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterVehicleRequest>({
    plateNumber: "",
    model: "",
    companyId: undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.plateNumber?.trim()) {
      toast.error("Plate number is required");
      return;
    }

    setLoading(true);
    try {
      await fleetApi.registerVehicle(formData);
      onSuccess();
      // Reset form
      setFormData({
        plateNumber: "",
        model: "",
        companyId: undefined,
      });
    } catch (error) {
      console.error("Failed to register vehicle", error);
      let errorMessage = "Failed to register vehicle.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
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
        errorMessage = String(error.response.data.message);
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || undefined,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-slate-800 rounded-xl border border-slate-700 shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">Register New Vehicle</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Plate Number */}
          <div>
            <label
              htmlFor="plateNumber"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Plate Number <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="plateNumber"
              name="plateNumber"
              value={formData.plateNumber || ""}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent disabled:opacity-50"
              placeholder="ABC-123"
            />
          </div>

          {/* Model */}
          <div>
            <label
              htmlFor="model"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Model
            </label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model || ""}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent disabled:opacity-50"
              placeholder="Toyota Camry 2023"
            />
          </div>

          {/* Company ID (Optional - only if needed) */}
          <div>
            <label
              htmlFor="companyId"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Company ID (Optional)
            </label>
            <input
              type="text"
              id="companyId"
              name="companyId"
              value={formData.companyId || ""}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent disabled:opacity-50"
              placeholder="Leave empty if inferred from token"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-brand-primary hover:bg-blue-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
