import { useState, useEffect } from "react";
import {
  getClasses,
  getTeachers,
  assignTeacherToClass,
} from "../../services/classService";
import {
  GraduationCap,
  UserCheck,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchData = async () => {
    try {
      const [classData, teacherData] = await Promise.all([
        getClasses(),
        getTeachers(),
      ]);
      setClasses(classData);
      setTeachers(teacherData);
    } catch (err) {
      setMessage({
        type: "error",
        text: "Failed to load class and teacher data.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignTeacher = async (classId, teacherId) => {
    setUpdatingId(classId);
    setMessage({ type: "", text: "" });
    const isUnassigning = !teacherId;

    try {
      await assignTeacherToClass(classId, teacherId);
      setMessage({
        type: "success",
        text: isUnassigning
          ? "Teacher unassigned successfully!"
          : "Teacher assigned successfully!",
      });
      await fetchData();
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.message || "Failed to update teacher assignment.",
      });
    } finally {
      setUpdatingId(null);
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#361F1D]">
          Class & Teacher Management
        </h1>
        <p className="text-sm text-stone-500">
          Assign teachers to ECD and Primary classes across Rumbidzai ECD
          School.
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
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#4A2E2B] text-white text-xs uppercase font-semibold">
                <th className="px-6 py-4">Class Name</th>
                <th className="px-6 py-4">Assigned Teacher</th>
                <th className="px-6 py-4">Assign / Change Teacher</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {classes.map((cls) => (
                <tr
                  key={cls.id}
                  className="hover:bg-stone-50 transition-colors"
                >
                  <td className="px-6 py-4 font-semibold text-[#361F1D]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F97316]/10 text-[#F97316] shrink-0">
                        <GraduationCap className="h-5 w-5" />
                      </div>
                      <span>{cls.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {cls.teacher ? (
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                        <div>
                          <p className="font-medium text-stone-800">
                            {cls.teacher.name}
                          </p>
                          <p className="text-xs text-stone-400">
                            {cls.teacher.email}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      disabled={updatingId === cls.id}
                      value={cls.teacherId || ""}
                      onChange={(e) =>
                        handleAssignTeacher(cls.id, e.target.value)
                      }
                      className="w-full sm:w-auto rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 shadow-sm focus:border-[#F97316] focus:outline-none focus:ring-1 focus:ring-[#F97316] disabled:opacity-50"
                    >
                      <option value="">-- Unassigned --</option>
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.name} ({teacher.email})
                        </option>
                      ))}
                    </select>
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

export default ClassManagement;
