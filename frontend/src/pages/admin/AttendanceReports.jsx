import { useState, useEffect } from "react";
import { getAttendanceLogs } from "../../services/studentService";
import { getClasses } from "../../services/classService";
import {
  Calendar,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  FileSpreadsheet,
  AlertCircle,
} from "lucide-react";

const AttendanceReports = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFilterOptions = async () => {
    try {
      const classList = await getClasses();
      setClasses(classList || []);
    } catch (err) {
      setError("Failed to load class list.");
    }
  };

  const fetchLogs = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAttendanceLogs(selectedDate, selectedClass);
      setLogs(data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to retrieve attendance logs.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFilterOptions();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [selectedDate, selectedClass]);

  const normalizedLogs = logs.map((log) => {
    let resolvedStatus = log.status?.toUpperCase();
    if (!resolvedStatus) {
      resolvedStatus = log.present ? "PRESENT" : "ABSENT";
    }
    return { ...log, status: resolvedStatus };
  });

  const totalRecords = normalizedLogs.length;
  const presentCount = normalizedLogs.filter(
    (l) => l.status === "PRESENT",
  ).length;
  const absentCount = normalizedLogs.filter(
    (l) => l.status === "ABSENT",
  ).length;
  const lateCount = normalizedLogs.filter((l) => l.status === "LATE").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#361F1D]">
          Attendance Reports & History
        </h1>
        <p className="text-sm text-stone-500">
          Review historical daily attendance records across all classes.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#F97316]" />
          <span className="text-sm font-semibold text-[#361F1D]">Filters:</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex flex-1 sm:flex-none items-center gap-2 rounded-lg border border-stone-300 bg-stone-50 px-3 py-1.5 text-sm">
            <Calendar className="h-4 w-4 text-stone-500 shrink-0" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-stone-800 outline-none w-full"
            />
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="flex-1 sm:flex-none rounded-lg border border-stone-300 bg-stone-50 px-3 py-1.5 text-sm text-stone-800 outline-none focus:border-[#F97316]"
          >
            <option value="">All Classes</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase text-stone-400">
            Total Logs
          </p>
          <p className="text-2xl font-extrabold text-[#361F1D] mt-1">
            {totalRecords}
          </p>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            <p className="text-xs font-bold uppercase">Present</p>
          </div>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">
            {presentCount}
          </p>
        </div>

        <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-rose-700">
            <XCircle className="h-4 w-4" />
            <p className="text-xs font-bold uppercase">Absent</p>
          </div>
          <p className="text-2xl font-extrabold text-rose-700 mt-1">
            {absentCount}
          </p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-amber-700">
            <Clock className="h-4 w-4" />
            <p className="text-xs font-bold uppercase">Late</p>
          </div>
          <p className="text-2xl font-extrabold text-amber-700 mt-1">
            {lateCount}
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-4 text-sm text-rose-800 border border-rose-200">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 bg-[#4A2E2B] px-6 py-4 text-white">
          <FileSpreadsheet className="h-5 w-5 text-[#F97316] shrink-0" />
          <h2 className="font-bold">
            Records for {new Date(selectedDate).toLocaleDateString()}
          </h2>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#F97316] border-t-transparent"></div>
          </div>
        ) : normalizedLogs.length === 0 ? (
          <div className="p-8 text-center text-stone-500">
            No attendance records logged for the selected date or class filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-xs font-semibold uppercase text-stone-500">
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3">Class</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Logged Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {normalizedLogs.map((log) => {
                  const studentName =
                    log.student?.firstName && log.student?.lastName
                      ? `${log.student.firstName} ${log.student.lastName}`
                      : log.student?.name ||
                        `Student #${log.studentId || log.id}`;

                  const className =
                    log.student?.class?.name || log.class?.name || "N/A";

                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-stone-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-[#361F1D]">
                        {studentName}
                      </td>
                      <td className="px-6 py-4 text-stone-600">{className}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            log.status === "PRESENT"
                              ? "bg-emerald-100 text-emerald-800"
                              : log.status === "ABSENT"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {log.status === "PRESENT" && (
                            <CheckCircle2 className="h-3 w-3" />
                          )}
                          {log.status === "ABSENT" && (
                            <XCircle className="h-3 w-3" />
                          )}
                          {log.status === "LATE" && (
                            <Clock className="h-3 w-3" />
                          )}
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-stone-500 text-xs">
                        {new Date(log.date).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceReports;
