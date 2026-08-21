import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  getTeacherClassDetails,
  getClassStudents,
  submitAttendance,
} from "../../services/studentService";
import API from "../../services/api";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Save,
  Edit2,
  X,
} from "lucide-react";
const EditStudentModal = ({ student, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({
    firstName: student.firstName || "",
    lastName: student.lastName || "",
    parentName: student.parentName === "N/A" ? "" : student.parentName || "",
    parentPhone: student.parentPhone === "N/A" ? "" : student.parentPhone || "",
    address: student.address === "N/A" ? "" : student.address || "",
    dateOfBirth: student.dateOfBirth
      ? new Date(student.dateOfBirth).toISOString().split("T")[0]
      : "",
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

const AttendanceTracker = () => {
  const { user } = useContext(AuthContext);
  const [assignedClass, setAssignedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [editingStudent, setEditingStudent] = useState(null);

  const fetchTeacherClass = async () => {
    try {
      if (user?.id) {
        const cls = await getTeacherClassDetails(user.id);
        setAssignedClass(cls);

        if (cls?.id) {
          const studentList = await getClassStudents(cls.id);
          setStudents(studentList);

          const initialStatus = {};
          studentList.forEach((st) => {
            initialStatus[st.id] = "PRESENT";
          });
          setAttendance(initialStatus);
        }
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to load class roster." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherClass();
  }, [user]);
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleStatusChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!assignedClass) return;

    setSubmitting(true);
    setMessage({ type: "", text: "" });

    const records = Object.keys(attendance).map((studentId) => ({
      studentId: parseInt(studentId),
      status: attendance[studentId],
    }));

    try {
      await submitAttendance(assignedClass.id, date, records);
      setMessage({
        type: "success",
        text: `Attendance for ${date} saved successfully!`,
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to submit attendance.",
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

  if (!assignedClass) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-amber-600" />
          <div>
            <h3 className="font-bold">No Class Assigned</h3>
            <p className="mt-0.5 text-sm text-amber-700">
              You are currently not assigned to any class. Please contact the
              administrator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#361F1D]">
            Daily Attendance – {assignedClass.name}
          </h1>
          <p className="text-sm text-stone-500">
            Mark attendance status for students enrolled in {assignedClass.name}
            .
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2 shadow-sm">
          <Calendar className="h-4 w-4 text-[#4A2E2B]" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="text-sm font-medium text-stone-800 outline-none"
          />
        </div>
      </div>

      {message.text && (
        <div
          className={`flex items-center gap-2 rounded-lg border p-4 text-sm font-medium ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
          {students.length === 0 ? (
            <div className="p-8 text-center text-stone-500">
              No students enrolled in this class yet.
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {students.map((st) => {
                const fullName =
                  st.firstName && st.lastName
                    ? `${st.firstName} ${st.lastName}`
                    : st.name || `Student #${st.id}`;

                return (
                  <div
                    key={st.id}
                    className="flex flex-col gap-4 p-4 transition-colors hover:bg-stone-50 sm:flex-row sm:items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-[#361F1D]">
                          {fullName}
                        </p>
                        <button
                          type="button"
                          onClick={() => setEditingStudent(st)}
                          className="flex items-center gap-1 text-xs text-[#F97316] hover:underline"
                          title="Edit missing details"
                        >
                          <Edit2 className="h-3 w-3" /> Edit
                        </button>
                      </div>
                      <p className="text-xs text-stone-400">
                        Student ID: #{st.id}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(st.id, "PRESENT")}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                          attendance[st.id] === "PRESENT"
                            ? "bg-emerald-600 text-white shadow"
                            : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                        }`}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Present
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(st.id, "ABSENT")}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                          attendance[st.id] === "ABSENT"
                            ? "bg-rose-600 text-white shadow"
                            : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                        }`}
                      >
                        <XCircle className="h-4 w-4" />
                        Absent
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(st.id, "LATE")}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                          attendance[st.id] === "LATE"
                            ? "bg-amber-500 text-white shadow"
                            : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                        }`}
                      >
                        <Clock className="h-4 w-4" />
                        Late
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {students.length > 0 && (
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-lg bg-[#F97316] px-6 py-2.5 font-medium text-white shadow transition-colors hover:bg-[#EA580C] disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{submitting ? "Saving..." : "Save Attendance"}</span>
            </button>
          </div>
        )}
      </form>
      {editingStudent && (
        <EditStudentModal
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onUpdated={fetchTeacherClass}
        />
      )}
    </div>
  );
};

export default AttendanceTracker;
