import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { loginUser } from "../../services/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const data = await loginUser(email, password);
      login(data.user, data.token);

      if (data.user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/teacher/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat p-4 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url('/bg-image.jpeg')`,
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white/20 p-8 shadow-2xl backdrop-blur-md border border-white/30 text-white">
        <div className="text-center mb-6">
          <div className="mx-auto flex justify-center mb-3">
            <img
              src="/Logo.jpg"
              alt="Rumbidzai ECD Centre Logo"
              className="h-28 w-auto object-contain drop-shadow-md"
            />
          </div>
          <h2 className="text-2xl font-bold text-white drop-shadow">
            Rumbidzai ECD Centre
          </h2>
          <p className="text-sm text-white/80 mt-1">
            Sign in to access your portal
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-rose-500/20 p-3 text-sm text-rose-100 border border-rose-500/30 backdrop-blur-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-white/30 bg-white/80 px-3.5 py-2.5 text-stone-900 placeholder-stone-500 focus:border-[#F97316] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F97316] transition"
              placeholder="e.g. teacher@rumbidzai.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/30 bg-white/80 px-3.5 py-2.5 text-stone-900 placeholder-stone-500 focus:border-[#F97316] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F97316] transition"
              placeholder="Enter your account password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-[#D9531E] py-3 font-semibold text-white shadow-lg transition-all hover:bg-[#EA580C] focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;