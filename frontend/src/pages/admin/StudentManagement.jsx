import { useState, useEffect } from "react";
import {
  getAllStudents,
  createStudent,
  deleteStudent,
  transferStudent,
} from "../../services/studentService";
import { getClasses } from "../../services/classService";
import {
  UserPlus,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Users,
  Trash2,
  ArrowRightLeft,
} from "lucide-react";

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    gender: "MALE",
    classId: "",
  });

  const fetchData = async () => {
    try {
      const [studentList, classList] = await Promise.all([
        getAllStudents(),
        getClasses(),
      ]);
      setStudents(studentList);
      setClasses(classList);
      if (classList.length > 0 && !formData.classId) {
        setFormData((prev) => ({ ...prev, classId: classList[0].id }));
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "Failed to load student and class records.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      await createStudent(formData);
      setMessage({
        type: "success",
        text: `Student ${formData.name} enrolled successfully!`,
      });
      setFormData({
        name: "",
        dateOfBirth: "",
        gender: "MALE",
        classId: classes[0]?.id || "",
      });
      await fetchData();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to register student.",
      });
    } finally {
      setSubmitting(false);
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      await deleteStudent(id);
      setMessage({
        type: "success",
        text: `Student ${name} deleted successfully!`,
      });
      await fetchData();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to delete student.",
      });
    }
  };

  const handleTransfer = async (id, name) => {
    if (
      !window.confirm(
        `Are you sure you want to mark ${name} as TRANSFERRED? This will remove them from active class rosters and notify their teacher.`,
      )
    )
      return;

    try {
      await transferStudent(id);
      setMessage({
        type: "success",
        text: `Student ${name} transferred and teacher notified!`,
      });
      await fetchData();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to transfer student.",
      });
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
          Student Management
        </h1>
        <p className="text-sm text-stone-500">
          Enroll new learners and manage student class assignments.
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm h-fit">
          <div className="flex items-center gap-2 mb-6 border-b border-stone-100 pb-4">
            <UserPlus className="h-5 w-5 text-[#F97316] shrink-0" />
            <h2 className="text-lg font-bold text-[#361F1D]">
              Enroll New Student
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
                placeholder="e.g. Anesu Mutasa"
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-800 focus:border-[#F97316] focus:outline-none focus:ring-1 focus:ring-[#F97316]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                required
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-800 focus:border-[#F97316] focus:outline-none focus:ring-1 focus:ring-[#F97316]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                required
                value={formData.gender}
                onChange={handleChange}
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 focus:border-[#F97316] focus:outline-none focus:ring-1 focus:ring-[#F97316]"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Assigned Class
              </label>
              <select
                name="classId"
                required
                value={formData.classId}
                onChange={handleChange}
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 focus:border-[#F97316] focus:outline-none focus:ring-1 focus:ring-[#F97316]"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full rounded-lg bg-[#F97316] py-2.5 font-medium text-white shadow transition-colors hover:bg-[#EA580C] disabled:opacity-50"
            >
              {submitting ? "Enrolling..." : "Enroll Learner"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 bg-[#4A2E2B] px-6 py-4 text-white">
            <Users className="h-5 w-5 text-[#F97316] shrink-0" />
            <h2 className="font-bold">Learner Directory ({students.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[550px]">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-xs font-semibold uppercase text-stone-500">
                  <th className="px-6 py-3">Learner Name</th>
                  <th className="px-6 py-3">Class</th>
                  <th className="px-6 py-3">Date of Birth</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {students.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-8 text-center text-stone-500"
                    >
                      No learners enrolled yet.
                    </td>
                  </tr>
                ) : (
                  students.map((st) => {
                    const studentName =
                      st.name ||
                      (st.firstName && `${st.firstName} ${st.lastName}`) ||
                      "Unnamed Learner";

                    return (
                      <tr
                        key={st.id}
                        className="hover:bg-stone-50 transition-colors"
                      >
                        <td className="px-6 py-4 font-semibold text-[#361F1D]">
                          {studentName}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F97316]/10 px-3 py-1 text-xs font-semibold text-[#F97316] whitespace-nowrap shrink-0">
                            <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                            {st.class?.name || st.className || "Unassigned"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-stone-600 whitespace-nowrap">
                          {st.dateOfBirth || st.dob
                            ? new Date(
                                st.dateOfBirth || st.dob,
                              ).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleTransfer(st.id, studentName)}
                              title="Transfer Student"
                              className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors shrink-0"
                            >
                              <ArrowRightLeft className="h-3.5 w-3.5 shrink-0" />
                              Transfer
                            </button>
                            <button
                              onClick={() => handleDelete(st.id, studentName)}
                              title="Delete Student"
                              className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors shrink-0"
                            >
                              <Trash2 className="h-3.5 w-3.5 shrink-0" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;
