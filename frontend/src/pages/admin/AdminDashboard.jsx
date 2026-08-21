const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#361F1D]">Admin Dashboard</h1>
        <p className="text-stone-500 text-sm">
          Overview of classes, teachers, and school operations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm border-l-4 border-l-[#4A2E2B] text-center">
          <p className="text-xs uppercase font-bold text-stone-400">
            Total Classes
          </p>
          <p className="text-3xl font-extrabold text-[#361F1D] mt-2">3</p>
          <span className="text-xs text-stone-500">ECD A, ECD B, Grade 1</span>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm border-l-4 border-l-[#F97316] text-center">
          <p className="text-xs uppercase font-bold text-stone-400">
            Assigned Teachers
          </p>
          <p className="text-3xl font-extrabold text-[#361F1D] mt-2">3</p>
          <span className="text-xs text-stone-500">Mary, John, Bongani</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
