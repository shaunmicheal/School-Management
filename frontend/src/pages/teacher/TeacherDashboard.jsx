import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  getTeacherClassDetails,
  getClassStudents,
} from "../../services/studentService";
import API from "../../services/api";
import {
  Users,
  Edit2,
  X,
  Phone,
  MapPin,
  UserCheck,
  AlertCircle,
} from "lucide-react";

const EditStudentModal = ({ student, onClose, onUpdated }) => {
  const parseDate = (dateString) => {
    if (!dateString) return "";
    const parsed = new Date(dateString);
    return isNaN(parsed.getTime())
      ? ""
      : parsed.toISOString().split("T")[0];
  };

  const [formData, setFormData] = useState({
    firstName: student.firstName || "",
    lastName: student.lastName || "",
    parentName: student.parentName === "N/A" ? "" : student.parentName || "",
    parentPhone: student.parentPhone === "N/A" ? "" : student.parentPhone || "",
    address: student.address === "N/A" ? "" : student.address || "",
    dateOfBirth: parseDate(student.dateOfBirth),
    gender: student.gender || "MALE",
  });
  const [saving, setSaving] = useState(false);

  const studentFullName =
    student.firstName && student.lastName
      ? `${student.firstName} ${student.lastName}`
      : student.name || `Student #${student.id}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.patch(`/students/${student.id}`, formData);
      onUpdated();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update student profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg space-y-4 rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between pb-1">
          <h3 className="text-lg font-bold text-[#361F1D]">
            Edit {studentFullName}'s Details
          </h3>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-stone-600">
                First Name
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="w-full rounded-lg border border-stone-300 p-2 text-sm outline-none focus:border-[#F97316]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-stone-600">
                Last Name
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="w-full rounded-lg border border-stone-300 p-2 text-sm outline-none focus:border-[#F97316]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-stone-600">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
                className="w-full rounded-lg border border-stone-300 p-2 text-sm outline-none focus:border-[#F97316]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-stone-600">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className="w-full rounded-lg border border-stone-300 p-2 text-sm outline-none focus:border-[#F97316]"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-stone-600">
              Parent/Guardian Name
            </label>
            <input
              type="text"
              value={formData.parentName}
              onChange={(e) =>
                setFormData({ ...formData, parentName: e.target.value })
              }
              className="w-full rounded-lg border border-stone-300 p-2 text-sm outline-none focus:border-[#F97316]"
              placeholder="e.g. John Doe"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-stone-600">
              Parent Phone Number
            </label>
            <input
              type="text"
              value={formData.parentPhone}
              onChange={(e) =>
                setFormData({ ...formData, parentPhone: e.target.value })
              }
              className="w-full rounded-lg border border-stone-300 p-2 text-sm outline-none focus:border-[#F97316]"
              placeholder="e.g. 0771234567"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-stone-600">
              Physical Address
            </label>
            <textarea
              rows="2"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full resize-none rounded-lg border border-stone-300 p-2 text-sm outline-none focus:border-[#F97316]"
              placeholder="Home address"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-stone-300 px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#F97316] px-4 py-2 text-xs font-semibold text-white hover:bg-[#EA580C] disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Details"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TeacherDashboard = () => {
  const { user } = useContext(AuthContext);
  const [assignedClass, setAssignedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStudent, setEditingStudent] = useState(null);

  const fetchClassDetails = async () => {
    try {
      if (user?.id) {
        const cls = await getTeacherClassDetails(user.id);
        setAssignedClass(cls);

        if (cls?.id) {
          const studentList = await getClassStudents(cls.id);
          setStudents(studentList);
        }
      }
    } catch (err) {
      console.error("Failed to fetch class roster:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassDetails();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#F97316] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#361F1D]">Teacher Portal</h1>
        <p className="text-sm text-stone-500">
          {assignedClass
            ? `Assigned Class: ${assignedClass.name}`
            : "Manage class attendance and student rosters."}
        </p>
      </div>

      {!assignedClass ? (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
          <AlertCircle className="h-6 w-6 text-amber-600" />
          <div>
            <h3 className="font-bold">No Class Assigned</h3>
            <p className="text-sm text-amber-700">
              You are currently not assigned as a lead teacher for any class.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
          <div className="flex items-center justify-between bg-[#4A2E2B] px-6 py-4 text-white">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#F97316]" />
              <h2 className="font-bold">Class Roster ({students.length})</h2>
            </div>
          </div>

          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-xs font-semibold uppercase text-stone-500">
                <th className="px-6 py-3">Learner Name</th>
                <th className="px-6 py-3">Parent / Guardian</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Address</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {students.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-stone-500"
                  >
                    No learners currently enrolled in this class.
                  </td>
                </tr>
              ) : (
                students.map((st) => {
                  const fullName =
                    st.firstName && st.lastName
                      ? `${st.firstName} ${st.lastName}`
                      : st.name || `Student #${st.id}`;

                  return (
                    <tr
                      key={st.id}
                      className="transition-colors hover:bg-stone-50"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-[#361F1D]">
                          {fullName}
                        </div>
                        <div className="text-xs text-stone-400">
                          ID: #{st.id}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-stone-700">
                        {st.parentName && st.parentName !== "N/A" ? (
                          <div className="flex items-center gap-1.5">
                            <UserCheck className="h-3.5 w-3.5 text-stone-400" />
                            {st.parentName}
                          </div>
                        ) : (
                          <span className="inline-block rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                            Missing Info
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-stone-700">
                        {st.parentPhone && st.parentPhone !== "N/A" ? (
                          <div className="flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5 text-stone-400" />
                            {st.parentPhone}
                          </div>
                        ) : (
                          <span className="text-xs text-stone-400">N/A</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-stone-700">
                        {st.address && st.address !== "N/A" ? (
                          <div className="flex max-w-xs items-center gap-1.5 truncate">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-stone-400" />
                            <span className="truncate">{st.address}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-stone-400">N/A</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setEditingStudent(st)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-semibold text-[#F97316] transition-colors hover:bg-[#F97316]/10"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          Edit Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
      {editingStudent && (
        <EditStudentModal
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onUpdated={fetchClassDetails}
        />
      )}
    </div>
  );
};

export default TeacherDashboard;