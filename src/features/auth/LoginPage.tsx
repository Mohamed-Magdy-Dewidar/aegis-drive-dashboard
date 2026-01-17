import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Truck } from "lucide-react";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await authApi.login({ email, password });

      if (!response || !response.token) {
        throw new Error("Token is missing from response!");
      }

      // ✅ FIX: Only pass the token. AuthContext fetches the user profile automatically.
      await login(response.token);
      navigate("/");
    } catch (err) {
      // Safe error handling without 'any'
      if (err instanceof Error) {
        setError(err.message);
        console.error("Login error:", err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
      <div className="bg-brand-surface w-full max-w-md rounded-xl shadow-2xl p-8 border border-slate-700">
        <div className="text-center mb-8">
          <Truck className="w-12 h-12 text-brand-primary mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-slate-400 text-sm">
            Sign in to monitor your fleet
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">
              Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-2.5 text-slate-500"
                size={18}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white focus:ring-1 focus:ring-brand-primary outline-none"
                placeholder="manager@company.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-2.5 text-slate-500"
                size={18}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white focus:ring-1 focus:ring-brand-primary outline-none"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-primary hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 mt-2"
          >
            {isSubmitting ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};
