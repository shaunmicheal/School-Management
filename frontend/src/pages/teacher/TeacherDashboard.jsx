const TeacherDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#361F1D]">Teacher Portal</h1>
        <p className="text-stone-500 text-sm">
          Manage class attendance and student rosters.
        </p>
      </div>
      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-[#4A2E2B]">Today's Attendance</h2>
        <p className="text-stone-500 text-sm mt-1">
          Select a class to record daily attendance.
        </p>
      </div>
    </div>
  );
};

export default TeacherDashboard;
