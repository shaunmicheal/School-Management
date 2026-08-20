import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  ClipboardCheck,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const adminLinks = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Classes & Teachers", path: "/admin/classes", icon: GraduationCap },
    { name: "Learner Directory", path: "/admin/students", icon: Users },
    {
      name: "Attendance Reports",
      path: "/admin/attendance",
      icon: ClipboardCheck,
    },
    { name: "User Management", path: "/admin/users", icon: Users },
  ];

  const teacherLinks = [
    {
      name: "My Class Dashboard",
      path: "/teacher/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Take Attendance",
      path: "/teacher/attendance",
      icon: ClipboardCheck,
    },
  ];

  const links = user?.role === "ADMIN" ? adminLinks : teacherLinks;

  return (
    <aside className="flex h-screen w-64 flex-col bg-[#4A2E2B] text-white shadow-xl">
      <div className="flex items-center gap-3 border-b border-[#5C3A36] px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F97316] font-bold text-white shadow">
          R
        </div>
        <div>
          <h1 className="font-bold tracking-wide text-stone-100">
            Rumbidzai ECD
          </h1>
          <p className="text-xs text-amber-200/70">Management Portal</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 px-4 py-6">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#F97316] text-white shadow-md"
                    : "text-amber-100/80 hover:bg-[#5C3A36] hover:text-white"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-[#5C3A36] p-4">
        <div className="mb-3 rounded-lg bg-[#361F1D] p-3">
          <p className="text-sm font-semibold text-white truncate">
            {user?.name || "User"}
          </p>
          <span className="inline-block rounded bg-[#F97316]/20 px-2 py-0.5 text-[10px] font-semibold text-[#F97316] uppercase">
            {user?.role}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#5C3A36] px-4 py-2 text-sm font-medium text-amber-200 hover:bg-rose-950/40 hover:text-rose-200 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
