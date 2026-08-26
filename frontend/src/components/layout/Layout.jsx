import { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { AuthContext } from "../../context/AuthContext";
import { Menu } from "lucide-react";

const Layout = () => {
  const { user } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const displayName =
    user?.name ||
    (user?.role
      ? user.role.charAt(0) + user.role.slice(1).toLowerCase()
      : "Guest");

  return (
    <div className="flex h-screen bg-[#FAFAFA] overflow-hidden">
      <Sidebar
        isMobileOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-y-auto">
        <header className="flex h-16 items-center justify-between border-b border-stone-200 bg-white px-4 sm:px-8 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-lg p-2 text-stone-700 hover:bg-stone-100 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-base sm:text-lg font-semibold text-[#361F1D] truncate">
              School Management System
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-medium text-stone-500">
              <span className="hidden sm:inline">Logged in as: </span>
              <strong className="text-[#4A2E2B] font-semibold">
                {displayName}
              </strong>
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
