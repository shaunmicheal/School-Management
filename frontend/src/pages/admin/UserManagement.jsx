import { useState, useEffect } from "react";
import { getUsers, createUser } from "../../services/userService";
import {
  UserPlus,
  Users,
  CheckCircle2,
  AlertCircle,
  Shield,
  GraduationCap,
} from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "TEACHER",
  });

  const fetchUserList = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to load user list." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      await createUser(formData);
      setMessage({
        type: "success",
        text: `New ${formData.role.toLowerCase()} account created successfully!`,
      });
      setFormData({ name: "", email: "", password: "", role: "TEACHER" });
      await fetchUserList();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to create user account.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#F97316] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#361F1D]">
          User & Staff Management
        </h1>
        <p className="text-sm text-stone-500">
          Register new Teachers or Admins and view system access accounts.
        </p>
      </div>
      {message.text && (
        <div
          className={`flex items-center gap-2 rounded-lg p-4 text-sm font-medium border ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm h-fit">
          <div className="flex items-center gap-2 mb-6 border-b border-stone-100 pb-4">
            <UserPlus className="h-5 w-5 text-[#F97316]" />
            <h2 className="text-lg font-bold text-[#361F1D]">
              Register New Staff
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Tendai Moyo"
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-800 placeholder-stone-400 focus:border-[#F97316] focus:outline-none focus:ring-1 focus:ring-[#F97316]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="tendai@rumbidzai.com"
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-800 placeholder-stone-400 focus:border-[#F97316] focus:outline-none focus:ring-1 focus:ring-[#F97316]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-800 placeholder-stone-400 focus:border-[#F97316] focus:outline-none focus:ring-1 focus:ring-[#F97316]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Account Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 focus:border-[#F97316] focus:outline-none focus:ring-1 focus:ring-[#F97316]"
              >
                <option value="TEACHER">Teacher</option>
                <option value="ADMIN">School Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full rounded-lg bg-[#F97316] py-2.5 font-medium text-white shadow transition-colors hover:bg-[#EA580C] disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create User Account"}
            </button>
          </form>
        </div>
        <div className="lg:col-span-2 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 bg-[#4A2E2B] px-6 py-4 text-white">
            <Users className="h-5 w-5 text-[#F97316]" />
            <h2 className="font-bold">Active Staff Directory</h2>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-xs font-semibold uppercase text-stone-500">
                <th className="px-6 py-3">Name & Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Assigned Class</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-[#361F1D]">{u.name}</p>
                    <p className="text-xs text-stone-400">{u.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        u.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {u.role === "ADMIN" ? (
                        <Shield className="h-3 w-3" />
                      ) : (
                        <GraduationCap className="h-3 w-3" />
                      )}
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-stone-600 font-medium">
                    {u.class ? (
                      u.class.name
                    ) : (
                      <span className="text-stone-400 font-normal">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
