import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  getTeacherClassDetails,
  getClassStudents,
  submitAttendance,
} from "../../services/studentService";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Save,
} from "lucide-react";

const AttendanceTracker = () => {
  const { user } = useContext(AuthContext);
  const [assignedClass, setAssignedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchTeacherClass = async () => {
      try {
        if (user?.id) {
          const cls = await getTeacherClassDetails(user.id);
          setAssignedClass(cls);

          if (cls?.id) {
            const studentList = await getClassStudents(cls.id);
            setStudents(studentList);

            // Default all students to PRESENT
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

    fetchTeacherClass();
  }, [user]);

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
            <p className="text-sm text-amber-700 mt-0.5">
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
          {students.length === 0 ? (
            <div className="p-8 text-center text-stone-500">
              No students enrolled in this class yet.
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {students.map((st) => (
                <div
                  key={st.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 hover:bg-stone-50 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-[#361F1D]">{st.name}</p>
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
              ))}
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
    </div>
  );
};

export default AttendanceTracker;
