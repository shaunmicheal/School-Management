import { useContext } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { AuthContext } from "../../context/AuthContext";

const Layout = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex h-screen bg-[#FAFAFA] overflow-hidden">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Top Header Bar */}
        <header className="flex h-16 items-center justify-between border-b border-stone-200 bg-white px-8 shadow-sm">
          <h2 className="text-lg font-semibold text-[#361F1D]">
            School Management System
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-stone-500">
              Logged in as:{" "}
              <strong className="text-[#4A2E2B]">{user?.email}</strong>
            </span>
          </div>
        </header>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
